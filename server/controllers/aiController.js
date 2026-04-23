const asyncHandler = require('../middleware/asyncHandler');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');
const Quiz = require('../models/Quiz');

const makeTerms = (text) =>
  Array.from(
    new Set(
      String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((term) => term.length > 2)
    )
  );

const scoreText = (text, terms) => {
  const source = String(text || '').toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (source.includes(term)) score += 1;
  }
  return score;
};

const buildContext = async (question) => {
  const terms = makeTerms(question);

  const [courses, lessons, exercises, quizzes] = await Promise.all([
    Course.find({ isPublished: true }).select('title slug description language').lean(),
    Lesson.find().select('courseId title slug content codeExample language').lean(),
    Exercise.find().select('lessonId title description starterCode validationRules').lean(),
    Quiz.find({ isPublished: true }).select('courseId question options explanation').lean(),
  ]);

  const scoredCourses = courses
    .map((course) => ({
      ...course,
      score: scoreText(`${course.title} ${course.description} ${course.language}`, terms),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const topCourseIds = new Set(scoredCourses.map((course) => String(course._id)));

  const scoredLessons = lessons
    .filter((lesson) => topCourseIds.has(String(lesson.courseId)) || scoreText(`${lesson.title} ${lesson.content}`, terms) > 0)
    .map((lesson) => ({
      ...lesson,
      score: scoreText(`${lesson.title} ${lesson.content} ${lesson.codeExample}`, terms),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const topLessonIds = new Set(scoredLessons.map((lesson) => String(lesson._id)));

  const scoredExercises = exercises
    .filter((exercise) => topLessonIds.has(String(exercise.lessonId)) || scoreText(`${exercise.title} ${exercise.description}`, terms) > 0)
    .map((exercise) => ({
      ...exercise,
      score: scoreText(`${exercise.title} ${exercise.description} ${(exercise.validationRules || []).join(' ')}`, terms),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const scoredQuizzes = quizzes
    .filter((quiz) => topCourseIds.has(String(quiz.courseId)) || scoreText(`${quiz.question} ${quiz.explanation}`, terms) > 0)
    .map((quiz) => ({
      ...quiz,
      score: scoreText(`${quiz.question} ${quiz.explanation}`, terms),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const contextLines = [];

  if (scoredCourses.length) {
    contextLines.push('Courses:');
    for (const course of scoredCourses) {
      contextLines.push(`- ${course.title} (${course.language}): ${course.description}`);
    }
  }

  if (scoredLessons.length) {
    contextLines.push('Lessons:');
    for (const lesson of scoredLessons) {
      const snippet = String(lesson.content || '').replace(/\s+/g, ' ').slice(0, 220);
      contextLines.push(`- ${lesson.title}: ${snippet}`);
    }
  }

  if (scoredExercises.length) {
    contextLines.push('Exercises:');
    for (const exercise of scoredExercises) {
      contextLines.push(`- ${exercise.title}: ${exercise.description}`);
    }
  }

  if (scoredQuizzes.length) {
    contextLines.push('Quizzes:');
    for (const quiz of scoredQuizzes) {
      const opt = (quiz.options || []).slice(0, 4).join(' | ');
      contextLines.push(`- ${quiz.question} Options: ${opt}`);
    }
  }

  return contextLines.join('\n');
};

const askTutor = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question || String(question).trim().length < 5) {
    const err = new Error('Please provide a more specific question.');
    err.statusCode = 400;
    throw err;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  if (!apiKey) {
    const err = new Error('AI is not configured. Set OPENAI_API_KEY in server/.env');
    err.statusCode = 503;
    throw err;
  }

  const learningContext = await buildContext(question);

  const systemPrompt = [
    'You are CodeLab+ Tutor, an AI assistant for a programming learning platform.',
    'Only answer questions that are relevant to web development learning topics in this platform: HTML, CSS, JavaScript, lessons, exercises, quizzes, XP progression, and platform usage.',
    'If the user asks an unrelated question, briefly refuse and redirect to supported learning topics.',
    'Keep answers practical and learner-friendly with short steps and examples when useful.',
    'Do not invent course content beyond provided context; if uncertain, say so.',
    'Keep answer concise (around 120-220 words unless user asks for more).',
  ].join(' ');

  const userPrompt = [
    `Question: ${String(question).trim()}`,
    'Platform context:',
    learningContext || 'No direct matching context found in current seeded content.',
  ].join('\n\n');

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    const err = new Error(`AI request failed: ${errBody}`);
    err.statusCode = 502;
    throw err;
  }

  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    const err = new Error('AI returned an empty response.');
    err.statusCode = 502;
    throw err;
  }

  res.json({ answer });
});

module.exports = {
  askTutor,
};