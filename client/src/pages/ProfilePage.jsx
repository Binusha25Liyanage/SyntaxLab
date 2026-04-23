import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const initials = (user?.username || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <section className="panel rounded-2xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cherry-500 font-display text-sm font-bold text-white">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-[24px] font-semibold text-mercury-50">{user?.username}</h1>
              <p className="text-[15px] leading-7 text-mercury-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-mercury-700">
            <span>Level {Math.floor((user?.xp || 0) / 100) + 1}</span>
            <span>•</span>
            <span>{user?.xp || 0} XP</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="panel rounded-2xl p-5">
          <h2 className="font-display text-[18px] font-semibold text-mercury-50">Progress</h2>
          <p className="mt-2 text-[14px] text-mercury-500">Completed lessons: {user?.completedLessons?.length || 0}</p>
          <p className="text-[14px] text-mercury-500">Completed exercises: {user?.completedExercises?.length || 0}</p>
        </article>
        <article className="panel rounded-2xl p-5">
          <h2 className="font-display text-[18px] font-semibold text-mercury-50">Badges</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {user?.badges?.length ? (
              user.badges.map((badge) => (
                <span key={`${badge.name}-${badge.awardedAt}`} className="rounded-full border border-[rgba(193,18,31,0.3)] bg-[rgba(193,18,31,0.15)] px-3 py-1 text-[12px] font-semibold text-mercury-50">
                  {badge.name}
                </span>
              ))
            ) : (
              <p className="text-[14px] text-mercury-700">No badges yet.</p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
