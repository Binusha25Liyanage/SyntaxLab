import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const level = useMemo(() => Math.floor((user?.xp || 0) / 100) + 1, [user?.xp]);
  const progress = useMemo(() => (user?.xp || 0) % 100, [user?.xp]);
  const initials = (user?.username || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <header className="panel rounded-2xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cherry-500 font-display text-sm font-bold text-white">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-[24px] font-semibold text-mercury-50">{user?.username}</h1>
              <p className="text-[15px] leading-7 text-mercury-500">Track your coding progress with disciplined, visible milestones.</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Level</p>
            <p className="font-display text-[24px] font-bold text-mercury-50">{level}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">XP</p>
          <p className="mt-2 font-display text-[32px] font-bold text-mercury-50">{user?.xp || 0}</p>
        </article>
        <article className="panel rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Level</p>
          <p className="mt-2 font-display text-[32px] font-bold text-mercury-50">{level}</p>
        </article>
        <article className="panel rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Lessons Completed</p>
          <p className="mt-2 font-display text-[32px] font-bold text-mercury-50">{user?.completedLessons?.length || 0}</p>
        </article>
      </section>

      <section className="panel rounded-2xl p-5">
        <div className="mb-2 flex justify-between text-sm">
          <span>Level {level} Progress</span>
          <span>{progress}/100 XP</span>
        </div>
        <div className="h-1.5 rounded-full bg-bg-overlay">
          <div className="h-full rounded-full bg-gradient-to-r from-cherry-500 to-[#E84040] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="panel rounded-2xl p-5">
        <h2 className="font-display text-[18px] font-semibold text-mercury-50">Badges</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {user?.badges?.length ? (
            user.badges.map((badge) => (
              <span key={`${badge.name}-${badge.awardedAt}`} className="rounded-full border border-[rgba(193,18,31,0.3)] bg-[rgba(193,18,31,0.15)] px-3 py-1 text-[12px] font-semibold text-mercury-50">
                {badge.name}
              </span>
            ))
          ) : (
            <p className="text-[14px] text-mercury-700">No badges yet. Complete your first lesson.</p>
          )}
        </div>
      </section>
    </div>
  );
}
