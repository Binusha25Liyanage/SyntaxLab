import { useEffect, useState } from 'react';
import { api } from '../../utils/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/users/admin/stats');
      setStats(res.data);
    };
    load();
  }, []);

  if (!stats) {
    return <p>Loading stats...</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <article className="glass rounded-2xl p-5">
        <p className="text-sm text-slate-500">Users</p>
        <p className="text-3xl font-bold">{stats.userCount}</p>
      </article>
      <article className="glass rounded-2xl p-5">
        <p className="text-sm text-slate-500">Courses</p>
        <p className="text-3xl font-bold">{stats.courseCount}</p>
      </article>
      <article className="glass rounded-2xl p-5">
        <p className="text-sm text-slate-500">Lessons</p>
        <p className="text-3xl font-bold">{stats.lessonCount}</p>
      </article>
      <article className="glass rounded-2xl p-5">
        <p className="text-sm text-slate-500">Completed Lessons</p>
        <p className="text-3xl font-bold">{stats.totalCompletedLessons}</p>
      </article>
    </div>
  );
}
