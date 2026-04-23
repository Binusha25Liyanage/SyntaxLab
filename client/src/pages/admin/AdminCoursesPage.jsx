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
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <Link to="/admin/courses/new" className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white">
          New Course
        </Link>
      </div>
      <div className="space-y-2">
        {courses.map((course) => (
          <div key={course._id} className="flex items-center justify-between rounded-xl border bg-white p-3 dark:bg-slate-900">
            <div>
              <p className="font-medium">{course.title}</p>
              <p className="text-xs text-slate-500">{course.slug}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/courses/${course._id}/edit`} className="rounded-md border px-3 py-1 text-sm">
                Edit
              </Link>
              <button onClick={() => remove(course._id)} className="rounded-md bg-rose-500 px-3 py-1 text-sm text-white">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
