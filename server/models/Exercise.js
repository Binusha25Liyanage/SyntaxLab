const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    starterCode: { type: String, default: '' },
    solutionCode: { type: String, required: true },
    validationRules: [{ type: String }],
    xpReward: { type: Number, default: 20 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
