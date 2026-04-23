import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/SkeletonCard';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/courses/${slug}`);
        setCourse(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const completedLessonSet = useMemo(
    () => new Set((user?.completedLessons || []).map((lesson) => lesson._id || lesson)),
    [user?.completedLessons]
  );

  const progress = useMemo(() => {
    if (!course?.lessons?.length) return 0;
    const done = course.lessons.filter((lesson) => completedLessonSet.has(lesson._id)).length;
    return Math.round((done / course.lessons.length) * 100);
  }, [course?.lessons, completedLessonSet]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{course.description}</p>
        <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-500">Course progress: {progress}%</p>
      </section>

      <section className="grid gap-3">
        {course.lessons.map((lesson) => (
          <Link
            key={lesson._id}
            to={`/courses/${course.slug}/${lesson.slug}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
          >
            <span>{lesson.title}</span>
            {completedLessonSet.has(lesson._id) && <span className="text-sm text-green-600">Completed</span>}
          </Link>
        ))}
      </section>
    </div>
  );
}
