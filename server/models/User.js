const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    awardedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    xp: { type: Number, default: 0 },
    badges: [badgeSchema],
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    completedExercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
    completedQuizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    refreshToken: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('User', userSchema);
