import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);

  const load = async () => {
    const res = await api.get('/courses');
    setCourses(res.data);
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
      <div className="space-y-2">
        {courses.map((course) => (
          <div key={course._id} className="flex items-center justify-between rounded-[12px] border border-white/6 bg-bg-surface p-3 transition hover:bg-[rgba(193,18,31,0.05)]">
            <div>
              <p className="font-semibold text-mercury-50">{course.title}</p>
              <p className="text-[12px] text-mercury-700">{course.slug}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/courses/${course._id}/edit`} className="rounded-[8px] border border-cherry-500 px-3 py-1 text-sm text-cherry-500 transition hover:bg-[rgba(193,18,31,0.08)]">
                Edit
              </Link>
              <button onClick={() => remove(course._id)} className="rounded-[8px] border border-cherry-500 bg-[rgba(193,18,31,0.1)] px-3 py-1 text-sm text-cherry-200 transition hover:bg-[rgba(193,18,31,0.16)]">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
