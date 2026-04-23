const express = require('express');
const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

module.exports = router;
