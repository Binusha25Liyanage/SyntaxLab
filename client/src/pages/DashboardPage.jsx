import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const level = useMemo(() => Math.floor((user?.xp || 0) / 100) + 1, [user?.xp]);
  const progress = useMemo(() => (user?.xp || 0) % 100, [user?.xp]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">Track your coding streak and progress.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="glass rounded-2xl p-5">
          <p className="text-sm text-slate-500">XP</p>
          <p className="text-3xl font-bold">{user?.xp || 0}</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <p className="text-sm text-slate-500">Level</p>
          <p className="text-3xl font-bold">{level}</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <p className="text-sm text-slate-500">Lessons Completed</p>
          <p className="text-3xl font-bold">{user?.completedLessons?.length || 0}</p>
        </article>
      </section>

      <section className="glass rounded-2xl p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span>Level {level} Progress</span>
          <span>{progress}/100 XP</span>
        </div>
        <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {user?.badges?.length ? (
            user.badges.map((badge) => (
              <span key={`${badge.name}-${badge.awardedAt}`} className="rounded-full bg-indigo-100 px-3 py-1 text-sm dark:bg-indigo-900/40">
                {badge.name}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">No badges yet. Complete your first lesson.</p>
          )}
        </div>
      </section>
    </div>
  );
}
