const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    codeExample: { type: String, default: '' },
    language: { type: String, enum: ['html', 'css', 'javascript'], required: true },
    order: { type: Number, default: 0 },
    xpReward: { type: Number, default: 10 },
  },
  { timestamps: true }
);

lessonSchema.index({ courseId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Lesson', lessonSchema);
