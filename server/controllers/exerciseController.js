const Exercise = require('../models/Exercise');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { evaluateCodeMasterBadge, evaluateTopTenBadge } = require('../utils/gamification');

const runValidationRules = (code, rules = []) => {
  const normalizedCode = (code || '').toLowerCase();

  for (const rule of rules) {
    const [kind, value] = rule.split(':');
    if (!kind || !value) {
      continue;
    }

    const needle = value.toLowerCase();

    if (kind === 'contains' && !normalizedCode.includes(needle)) {
      return { ok: false, failedRule: rule };
    }

    if (kind === 'has-element') {
      const elementPattern = new RegExp(`<\\s*${needle}([\\s>])`, 'i');
      if (!elementPattern.test(code)) {
        return { ok: false, failedRule: rule };
      }
    }
  }

  return { ok: true };
};

const getExercisesByLesson = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({ lessonId: req.params.lessonId }).select('-solutionCode').sort({ createdAt: 1 });
  res.json(exercises);
});

const getExerciseById = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) {
    const err = new Error('Exercise not found');
    err.statusCode = 404;
    throw err;
  }
  res.json(exercise);
});

const createExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.create(req.body);
  res.status(201).json({ ...exercise.toObject(), solutionCode: undefined });
});

const updateExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!exercise) {
    const err = new Error('Exercise not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ ...exercise.toObject(), solutionCode: undefined });
});

const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findByIdAndDelete(req.params.id);
  if (!exercise) {
    const err = new Error('Exercise not found');
    err.statusCode = 404;
    throw err;
  }
  res.json({ message: 'Exercise deleted successfully' });
});

const submitExercise = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    const err = new Error('Exercise not found');
    err.statusCode = 404;
    throw err;
  }

  const validation = runValidationRules(code, exercise.validationRules);
  if (!validation.ok) {
    return res.status(400).json({
      passed: false,
      message: `Validation failed for rule: ${validation.failedRule}`,
    });
  }

  const user = await User.findById(req.user._id);
  const alreadyCompleted = user.completedExercises.some((id) => id.toString() === exercise._id.toString());

  let xpGained = 0;
  if (!alreadyCompleted) {
    user.completedExercises.push(exercise._id);
    user.xp += exercise.xpReward;
    xpGained = exercise.xpReward;

    const lesson = await Lesson.findById(exercise.lessonId).select('courseId');
    if (lesson) {
      await evaluateCodeMasterBadge(user, lesson.courseId);
    }
    await evaluateTopTenBadge(user);
    await user.save();
  }

  res.json({
    passed: true,
    xpGained,
    totalXp: user.xp,
    message: alreadyCompleted ? 'Exercise already completed previously' : 'Exercise passed',
    badges: user.badges,
  });
});

module.exports = {
  getExercisesByLesson,
  getExerciseById,
  submitExercise,
  createExercise,
  updateExercise,
  deleteExercise,
};
