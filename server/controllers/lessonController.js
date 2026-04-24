const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { sanitizeLessonContent } = require('../utils/sanitize');
const { evaluateLessonBadges, evaluateTopTenBadge } = require('../utils/gamification');

const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    const err = new Error('Lesson not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(lesson);
});

const createLesson = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    content: sanitizeLessonContent(req.body.content),
  };

  const lesson = await Lesson.create(payload);
  await Course.findByIdAndUpdate(lesson.courseId, { $addToSet: { lessons: lesson._id } });
  res.status(201).json(lesson);
});

const updateLesson = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (typeof payload.content === 'string') {
    payload.content = sanitizeLessonContent(payload.content);
  }

  const lesson = await Lesson.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!lesson) {
    const err = new Error('Lesson not found');
    err.statusCode = 404;
    throw err;
  }

  res.json(lesson);
});

const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);
  if (!lesson) {
    const err = new Error('Lesson not found');
    err.statusCode = 404;
    throw err;
  }

  await Course.findByIdAndUpdate(lesson.courseId, { $pull: { lessons: lesson._id } });
  await Exercise.deleteMany({ lessonId: lesson._id });
  res.json({ message: 'Lesson deleted successfully' });
});

const completeLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    const err = new Error('Lesson not found');
    err.statusCode = 404;
    throw err;
  }

  const user = await User.findById(req.user._id);
  const alreadyCompleted = user.completedLessons.some((id) => id.toString() === lesson._id.toString());

  let xpGained = 0;
  if (!alreadyCompleted) {
    user.completedLessons.push(lesson._id);
    user.xp += lesson.xpReward;
    xpGained = lesson.xpReward;
    await evaluateLessonBadges(user);
    await evaluateTopTenBadge(user);
    await user.save();
  }

  res.json({
    message: alreadyCompleted ? 'Lesson already completed' : 'Lesson completed',
    xpGained,
    totalXp: user.xp,
    badges: user.badges,
  });
});

module.exports = {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  completeLesson,
};
