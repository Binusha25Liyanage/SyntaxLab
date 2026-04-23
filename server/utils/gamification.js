const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');

const awardBadge = (user, name) => {
  const hasBadge = user.badges.some((badge) => badge.name === name);
  if (!hasBadge) {
    user.badges.push({ name, awardedAt: new Date() });
  }
};

const evaluateLessonBadges = async (user) => {
  const lessonCount = user.completedLessons.length;
  if (lessonCount >= 1) {
    awardBadge(user, 'First Lesson');
  }
  if (lessonCount >= 5) {
    awardBadge(user, 'Quick Learner');
  }
};

const evaluateTopTenBadge = async (user) => {
  const topUsers = await User.find().sort({ xp: -1 }).limit(10).select('_id');
  const isTopTen = topUsers.some((u) => u._id.toString() === user._id.toString());
  if (isTopTen) {
    awardBadge(user, 'Top 10');
  }
};

const evaluateCodeMasterBadge = async (user, courseId) => {
  const lessons = await Lesson.find({ courseId }).select('_id');
  if (!lessons.length) return;

  const lessonIds = lessons.map((lesson) => lesson._id);
  const totalExercises = await Exercise.countDocuments({ lessonId: { $in: lessonIds } });
  if (!totalExercises) return;

  const completedCount = await Exercise.countDocuments({
    _id: { $in: user.completedExercises },
    lessonId: { $in: lessonIds },
  });

  if (completedCount === totalExercises) {
    awardBadge(user, 'Code Master');
  }
};

module.exports = {
  awardBadge,
  evaluateLessonBadges,
  evaluateTopTenBadge,
  evaluateCodeMasterBadge,
};
