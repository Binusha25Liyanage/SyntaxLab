import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import SkeletonCard from '../components/SkeletonCard';
import { api } from '../utils/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Learning paths</p>
        <h1 className="mt-2 font-display text-[36px] font-bold leading-tight text-mercury-50">Courses</h1>
        <p className="mt-3 text-[15px] leading-7 text-mercury-500">Pick a path and move through lessons with a disciplined progression.</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input className="field-dark w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-mercury-700" placeholder="Search courses" />
        <button className="pressable rounded-xl border border-white/10 bg-bg-elevated px-5 py-3 text-sm font-semibold text-mercury-50 transition hover:border-cherry-500/40">
          Filter
        </button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)}
        {!loading && courses.map((course, index) => <CourseCard key={course._id} course={course} style={{ '--i': index }} />)}
      </div>
    </div>
  );
}
