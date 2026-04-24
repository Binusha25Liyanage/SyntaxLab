import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [coursesRes, quizzesRes] = await Promise.all([
        api.get('/courses/admin/all'),
        api.get('/quizzes'),
      ]);

      const courseList = coursesRes.data;
      setCourses(courseList);

      const lessonsByCourse = await Promise.all(
        courseList.map(async (course) => {
          const courseDetailRes = await api.get(`/courses/${course.slug}`);
          const lessons = courseDetailRes.data.lessons || [];

          const lessonsWithExercises = await Promise.all(
            lessons.map(async (lesson) => {
              const exercisesRes = await api.get(`/exercises/lesson/${lesson._id}`);
              return {
                ...lesson,
                exercises: exercisesRes.data || [],
              };
            })
          );

          return {
            courseId: course._id,
            lessons: lessonsWithExercises,
          };
        })
      );

      const map = lessonsByCourse.reduce((acc, entry) => {
        const quizzes = quizzesRes.data.filter((quiz) => {
          const quizCourseId = typeof quiz.courseId === 'string' ? quiz.courseId : quiz.courseId?._id;
          return quizCourseId === entry.courseId;
        });

        acc[entry.courseId] = {
          lessons: entry.lessons,
          quizzes,
        };
        return acc;
      }, {});

      setContentMap(map);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const removeLesson = async (id) => {
    try {
      await api.delete(`/lessons/${id}`);
      toast.success('Lesson deleted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const removeExercise = async (id) => {
    try {
      await api.delete(`/exercises/${id}`);
      toast.success('Exercise deleted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const removeQuiz = async (id) => {
    try {
      await api.delete(`/quizzes/${id}`);
      toast.success('Quiz deleted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Admin content</p>
          <h1 className="mt-2 font-display text-[36px] font-bold text-mercury-50">Manage Courses</h1>
        </div>
        <Link to="/admin/courses/new" className="pressable rounded-[8px] bg-cherry-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cherry-700">
          New Course
        </Link>
      </div>
      {loading && <div className="panel rounded-[12px] p-4 text-sm text-mercury-500">Loading course content...</div>}
      <div className="space-y-2">
        {!loading && courses.map((course) => (
          <div key={course._id} className="rounded-[12px] border border-white/6 bg-bg-surface p-3 transition hover:bg-[rgba(193,18,31,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-mercury-50">{course.title}</p>
                <p className="text-[12px] text-mercury-700">{course.slug}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-mercury-700">
                  {course.isPublished ? 'Published' : 'Draft'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/courses/${course._id}/edit`} className="rounded-[8px] border border-cherry-500 px-3 py-1 text-sm text-cherry-500 transition hover:bg-[rgba(193,18,31,0.08)]">
                  Edit Course
                </Link>
                <Link to={`/admin/lessons/new?courseId=${encodeURIComponent(course._id)}`} className="rounded-[8px] border border-white/10 px-3 py-1 text-sm text-mercury-300 transition hover:border-white/20 hover:text-mercury-50">
                  Add Lesson
                </Link>
                <Link to={`/admin/quizzes/new?courseId=${encodeURIComponent(course._id)}`} className="rounded-[8px] border border-white/10 px-3 py-1 text-sm text-mercury-300 transition hover:border-white/20 hover:text-mercury-50">
                  Add Quiz
                </Link>
                <button onClick={() => remove(course._id)} className="rounded-[8px] border border-cherry-500 bg-[rgba(193,18,31,0.1)] px-3 py-1 text-sm text-cherry-200 transition hover:bg-[rgba(193,18,31,0.16)]">
                  Delete Course
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <section className="rounded-[10px] border border-white/8 bg-bg-elevated p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-mercury-500">Lessons</p>
                </div>
                <div className="space-y-2">
                  {(contentMap[course._id]?.lessons || []).length === 0 && <p className="text-xs text-mercury-700">No lessons yet.</p>}
                  {(contentMap[course._id]?.lessons || []).map((lesson) => (
                    <div key={lesson._id} className="rounded-[8px] border border-white/8 p-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-mercury-100">{lesson.title}</p>
                          <p className="text-[11px] text-mercury-700">{lesson.slug}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/admin/lessons/${lesson._id}/edit`} className="rounded-[8px] border border-cherry-500 px-2 py-1 text-xs text-cherry-500">Edit</Link>
                          <Link to={`/admin/exercises/new?lessonId=${encodeURIComponent(lesson._id)}`} className="rounded-[8px] border border-white/10 px-2 py-1 text-xs text-mercury-300">Add Exercise</Link>
                          <button onClick={() => removeLesson(lesson._id)} className="rounded-[8px] border border-cherry-500/70 px-2 py-1 text-xs text-cherry-200">Delete</button>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        {(lesson.exercises || []).length === 0 && <p className="text-[11px] text-mercury-700">No exercises.</p>}
                        {(lesson.exercises || []).map((exercise) => (
                          <div key={exercise._id} className="flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-white/8 px-2 py-1">
                            <p className="text-[12px] text-mercury-300">{exercise.title}</p>
                            <div className="flex gap-2">
                              <Link to={`/admin/exercises/${exercise._id}/edit`} className="text-[11px] text-cherry-500">Edit</Link>
                              <button onClick={() => removeExercise(exercise._id)} className="text-[11px] text-cherry-200">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[10px] border border-white/8 bg-bg-elevated p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-mercury-500">Quizzes</p>
                <div className="space-y-1">
                  {(contentMap[course._id]?.quizzes || []).length === 0 && <p className="text-xs text-mercury-700">No quizzes yet.</p>}
                  {(contentMap[course._id]?.quizzes || []).map((quiz) => (
                    <div key={quiz._id} className="flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-white/8 px-2 py-1">
                      <div>
                        <p className="text-[12px] text-mercury-300">{quiz.question}</p>
                        <p className="text-[10px] uppercase tracking-[0.08em] text-mercury-700">{quiz.isPublished ? 'Published' : 'Draft'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/admin/quizzes/${quiz._id}/edit`} className="text-[11px] text-cherry-500">Edit</Link>
                        <button onClick={() => removeQuiz(quiz._id)} className="text-[11px] text-cherry-200">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
