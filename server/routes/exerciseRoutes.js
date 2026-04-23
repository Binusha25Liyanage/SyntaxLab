const express = require('express');
const {
  getExercisesByLesson,
  getExerciseById,
  submitExercise,
  createExercise,
  updateExercise,
  deleteExercise,
} = require('../controllers/exerciseController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/lesson/:lessonId', protect, getExercisesByLesson);
router.get('/:id', protect, adminOnly, getExerciseById);
router.post('/:id/submit', protect, submitExercise);
router.post('/', protect, adminOnly, createExercise);
router.put('/:id', protect, adminOnly, updateExercise);
router.delete('/:id', protect, adminOnly, deleteExercise);

module.exports = router;
