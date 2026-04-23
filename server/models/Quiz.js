const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    question: { type: String, required: true, trim: true },
    options: [{ type: String, required: true, trim: true }],
    correctIndex: { type: Number, required: true, min: 0 },
    explanation: { type: String, default: '' },
    order: { type: Number, default: 0 },
    xpReward: { type: Number, default: 10 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

quizSchema.index({ courseId: 1, order: 1 });

module.exports = mongoose.model('Quiz', quizSchema);