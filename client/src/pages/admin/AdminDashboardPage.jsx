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
    return <p className="text-mercury-500">Loading stats...</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <article className="panel rounded-2xl p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Users</p>
        <p className="mt-2 font-display text-[32px] font-bold text-mercury-50">{stats.userCount}</p>
      </article>
      <article className="panel rounded-2xl p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Courses</p>
        <p className="mt-2 font-display text-[32px] font-bold text-mercury-50">{stats.courseCount}</p>
      </article>
      <article className="panel rounded-2xl p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Lessons</p>
        <p className="mt-2 font-display text-[32px] font-bold text-mercury-50">{stats.lessonCount}</p>
      </article>
      <article className="panel rounded-2xl p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Completed Lessons</p>
        <p className="mt-2 font-display text-[32px] font-bold text-mercury-50">{stats.totalCompletedLessons}</p>
      </article>
    </div>
  );
}
