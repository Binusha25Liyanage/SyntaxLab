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
      <h1 className="text-3xl font-bold">Courses</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Pick a path and start coding in minutes.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)}
        {!loading && courses.map((course) => <CourseCard key={course._id} course={course} />)}
      </div>
    </div>
  );
}
