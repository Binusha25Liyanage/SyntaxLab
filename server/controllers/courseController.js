const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');
const Quiz = require('../models/Quiz');
const asyncHandler = require('../middleware/asyncHandler');

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });
  res.json(courses);
});

const getAllCoursesAdmin = asyncHandler(async (req, res) => {
  const courses = await Course.find().sort({ order: 1, createdAt: 1 });
  res.json(courses);
});

const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug }).lean();
  if (!course) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }

  const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1, createdAt: 1 });
  res.json({ ...course, lessons });
});

const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }

  res.json(course);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    const err = new Error('Course not found');
    err.statusCode = 404;
    throw err;
  }

  const lessons = await Lesson.find({ courseId: course._id }).select('_id').lean();
  const lessonIds = lessons.map((lesson) => lesson._id);

  await Promise.all([
    Lesson.deleteMany({ courseId: course._id }),
    Exercise.deleteMany({ lessonId: { $in: lessonIds } }),
    Quiz.deleteMany({ courseId: course._id }),
  ]);

  res.json({ message: 'Course deleted successfully' });
});

module.exports = {
  getCourses,
  getAllCoursesAdmin,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
};
