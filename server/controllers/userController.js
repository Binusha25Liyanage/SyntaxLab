const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const asyncHandler = require('../middleware/asyncHandler');
const { evaluateTopTenBadge } = require('../utils/gamification');

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -refreshToken')
    .populate('completedLessons', 'title slug courseId')
    .populate('completedExercises', 'title lessonId');

  await evaluateTopTenBadge(user);
  await user.save();

  res.json(user);
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const topUsers = await User.find()
    .select('username xp badges')
    .sort({ xp: -1, createdAt: 1 })
    .limit(10);

  res.json(topUsers.map((user, index) => ({ rank: index + 1, ...user.toObject() })));
});

const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const [total, users] = await Promise.all([
    User.countDocuments(),
    User.find()
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.json({
    page,
    total,
    totalPages: Math.ceil(total / limit),
    users,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  res.json({ message: 'User deleted successfully' });
});

const getAdminStats = asyncHandler(async (req, res) => {
  const [userCount, courseCount, lessonCount] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Lesson.countDocuments(),
  ]);

  const completionStats = await User.aggregate([
    {
      $project: {
        completedLessonCount: { $size: '$completedLessons' },
      },
    },
    {
      $group: {
        _id: null,
        totalCompletedLessons: { $sum: '$completedLessonCount' },
      },
    },
  ]);

  res.json({
    userCount,
    courseCount,
    lessonCount,
    totalCompletedLessons: completionStats[0]?.totalCompletedLessons || 0,
  });
});

module.exports = {
  getMe,
  getLeaderboard,
  getUsers,
  deleteUser,
  getAdminStats,
};
