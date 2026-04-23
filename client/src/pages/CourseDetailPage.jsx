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
      <section className="panel rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Course overview</p>
        <h1 className="mt-2 font-display text-[36px] font-bold text-mercury-50">{course.title}</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-mercury-500">{course.description}</p>
        <div className="mt-5 h-1.5 rounded-full bg-bg-overlay">
          <div className="h-full rounded-full bg-gradient-to-r from-cherry-500 to-[#E84040] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-[12px] text-mercury-700">Course progress: {progress}%</p>
      </section>

      <section className="grid gap-3">
        {course.lessons.map((lesson) => (
          <Link
            key={lesson._id}
            to={`/courses/${course.slug}/${lesson.slug}`}
            className="flex items-center justify-between rounded-[12px] border border-white/6 bg-bg-surface px-4 py-3 transition hover:border-[rgba(193,18,31,0.4)] hover:bg-[rgba(193,18,31,0.05)]"
          >
            <span className="text-[15px] text-mercury-50">{lesson.title}</span>
            {completedLessonSet.has(lesson._id) && <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-success">Completed</span>}
          </Link>
        ))}
      </section>
    </div>
  );
}
