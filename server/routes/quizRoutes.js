const express = require('express');
const {
  getQuizzesByCourse,
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
} = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, adminOnly, getAllQuizzes);
router.get('/course/:courseId', protect, getQuizzesByCourse);
router.get('/:id', protect, adminOnly, getQuizById);
router.post('/:id/submit', protect, submitQuiz);
router.post('/', protect, adminOnly, createQuiz);
router.put('/:id', protect, adminOnly, updateQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);

module.exports = router;