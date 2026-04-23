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
  const initials = (user?.username || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell min-h-screen">
      <div className="nav-shell fixed left-0 top-0 z-50 flex h-14 w-full items-center justify-between px-4 md:hidden">
        <button onClick={() => setOpen((v) => !v)} className="pressable rounded-lg border border-white/10 bg-white/5 p-2 text-mercury-50">
          <Menu size={18} />
        </button>
        <span className="font-display text-[20px] font-bold tracking-tight text-mercury-100">
          CodeLab<span className="text-cherry-500">+</span>
        </span>
      </div>

      <div className="flex">
        <aside
          className={`sidebar-shell fixed z-40 h-screen w-60 text-mercury-50 transition-transform md:translate-x-0 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            <Link to="/" className="font-display text-[20px] font-bold tracking-tight text-mercury-100">
              CodeLab<span className="text-cherry-500">+</span>
            </Link>
            <div className="panel mt-6 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cherry-500 font-display text-sm font-bold text-white">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-mercury-50">{user?.username}</p>
                  <p className="text-xs uppercase tracking-[0.12em] text-mercury-700">Level {level}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-bg-overlay">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cherry-500 to-[#E84040] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-mercury-700">{user?.xp || 0} XP</p>
            </div>
          </div>

          <nav className="space-y-1 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 border-l-2 px-3 py-2 text-[14px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'border-cherry-500 bg-[rgba(193,18,31,0.15)] text-cherry-500'
                      : 'border-transparent text-mercury-500 hover:bg-[rgba(193,18,31,0.08)] hover:text-mercury-50'
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
                  `flex items-center gap-3 border-l-2 px-3 py-2 text-[14px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'border-cherry-500 bg-[rgba(193,18,31,0.15)] text-cherry-500'
                      : 'border-transparent text-mercury-500 hover:bg-[rgba(193,18,31,0.08)] hover:text-mercury-50'
                  }`
                }
              >
                <Shield size={16} />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="absolute bottom-6 left-4 right-4">
            <button onClick={logout} className="pressable w-full rounded-lg border border-white/10 bg-bg-elevated px-3 py-2 text-sm text-mercury-50 transition hover:border-cherry-500/40 hover:bg-cherry-700">
              Logout
            </button>
          </div>
        </aside>

        <main className="min-h-screen flex-1 px-4 pb-8 pt-20 md:ml-60 md:px-8 md:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
