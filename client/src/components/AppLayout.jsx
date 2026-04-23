import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, Trophy, User, LayoutDashboard, BookOpen, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const level = Math.floor((user?.xp || 0) / 100) + 1;
  const progress = (user?.xp || 0) % 100;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <button onClick={() => setOpen((v) => !v)} className="rounded-lg border p-2">
          <Menu size={18} />
        </button>
        <span className="font-semibold text-indigo-600">CodeLab+</span>
      </div>

      <div className="flex">
        <aside
          className={`fixed z-40 h-screen w-72 bg-navy text-white transition-transform md:translate-x-0 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            <Link to="/" className="text-2xl font-bold tracking-tight text-indigo-300">
              CodeLab+
            </Link>
            <div className="mt-6 rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-300">Level {level}</p>
              <div className="mt-2 h-2 rounded-full bg-slate-700">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-400">{user?.xp || 0} XP</p>
            </div>
          </div>

          <nav className="space-y-1 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin/dashboard"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <Shield size={16} />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="absolute bottom-6 left-4 right-4">
            <button onClick={logout} className="w-full rounded-xl bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700">
              Logout
            </button>
          </div>
        </aside>

        <main className="min-h-screen flex-1 px-4 pb-8 pt-20 md:ml-72 md:px-8 md:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
