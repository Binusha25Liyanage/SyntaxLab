const express = require('express');
const {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  completeLesson,
} = require('../controllers/lessonController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', protect, getLessonById);
router.post('/', protect, adminOnly, createLesson);
router.put('/:id', protect, adminOnly, updateLesson);
router.delete('/:id', protect, adminOnly, deleteLesson);
router.post('/:id/complete', protect, completeLesson);

module.exports = router;
