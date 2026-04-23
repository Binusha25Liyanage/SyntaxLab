import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h1 className="text-3xl font-bold">{user?.username}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{user?.email}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="glass rounded-2xl p-5">
          <h2 className="text-xl font-semibold">Progress</h2>
          <p className="mt-2">Completed lessons: {user?.completedLessons?.length || 0}</p>
          <p>Completed exercises: {user?.completedExercises?.length || 0}</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <h2 className="text-xl font-semibold">Badges</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {user?.badges?.length ? (
              user.badges.map((badge) => (
                <span key={`${badge.name}-${badge.awardedAt}`} className="rounded-full bg-indigo-100 px-3 py-1 text-sm dark:bg-indigo-900/40">
                  {badge.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">No badges yet.</p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
