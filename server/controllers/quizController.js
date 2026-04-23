const Quiz = require('../models/Quiz');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { evaluateTopTenBadge } = require('../utils/gamification');

const sanitizeQuizPayload = (payload) => {
  const options = Array.isArray(payload.options)
    ? payload.options.map((option) => String(option).trim()).filter(Boolean)
    : [];

  return {
    ...payload,
    options,
    correctIndex: Number(payload.correctIndex),
    order: Number(payload.order || 0),
    xpReward: Number(payload.xpReward || 10),
    isPublished: Boolean(payload.isPublished),
  };
};

const getQuizzesByCourse = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ courseId: req.params.courseId, isPublished: true })
    .sort({ order: 1, createdAt: 1 })
    .select('-correctIndex');

  res.json(quizzes);
});

const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find()
    .populate('courseId', 'title slug')
    .sort({ order: 1, createdAt: 1 })
    .select('-correctIndex');

  res.json(quizzes);
});

const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    const err = new Error('Quiz not found');
    err.statusCode = 404;
    throw err;
  }

  res.json(quiz);
});

const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.create(sanitizeQuizPayload(req.body));
  res.status(201).json({ ...quiz.toObject(), correctIndex: undefined });
});

const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, sanitizeQuizPayload(req.body), {
    new: true,
    runValidators: true,
  });

  if (!quiz) {
    const err = new Error('Quiz not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ ...quiz.toObject(), correctIndex: undefined });
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) {
    const err = new Error('Quiz not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ message: 'Quiz deleted successfully' });
});

const submitQuiz = asyncHandler(async (req, res) => {
  const { optionIndex } = req.body;
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    const err = new Error('Quiz not found');
    err.statusCode = 404;
    throw err;
  }

  const chosenIndex = Number(optionIndex);
  const passed = chosenIndex === quiz.correctIndex;

  if (!passed) {
    return res.status(400).json({
      passed: false,
      message: 'Incorrect answer. Review the course material and try again.',
    });
  }

  const user = await User.findById(req.user._id);
  const alreadyCompleted = user.completedQuizzes.some((id) => id.toString() === quiz._id.toString());

  let xpGained = 0;
  if (!alreadyCompleted) {
    user.completedQuizzes.push(quiz._id);
    user.xp += quiz.xpReward;
    xpGained = quiz.xpReward;
    await evaluateTopTenBadge(user);
    await user.save();
  }

  res.json({
    passed: true,
    xpGained,
    totalXp: user.xp,
    message: alreadyCompleted ? 'Quiz already completed previously' : 'Quiz passed',
    explanation: quiz.explanation,
  });
});

module.exports = {
  getQuizzesByCourse,
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
};