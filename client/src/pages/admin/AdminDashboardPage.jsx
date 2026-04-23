import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookPlus, FileText, Users, ClipboardList, ShieldCheck, Layers3, BadgePlus } from 'lucide-react';
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
    return <p className="text-mercury-500">Loading admin dashboard...</p>;
  }

  const serviceCards = [
    {
      title: 'Create Course',
      description: 'Add a new learning path, publish it, and define its language focus.',
      to: '/admin/courses/new',
      icon: BookPlus,
    },
    {
      title: 'Create Lesson',
      description: 'Build a lesson with markdown content, starter code, and XP rewards.',
      to: '/admin/lessons/new',
      icon: FileText,
    },
    {
      title: 'Create Exercise',
      description: 'Attach validation rules and hidden solutions for guided practice.',
      to: '/admin/exercises/new',
      icon: ClipboardList,
    },
    {
      title: 'Create Quiz',
      description: 'Add course quizzes with multiple-choice answers and XP rewards.',
      to: '/admin/quizzes/new',
      icon: BadgePlus,
    },
    {
      title: 'Manage Users',
      description: 'Review learner roles, XP, and remove accounts when necessary.',
      to: '/admin/users',
      icon: Users,
    },
  ];

  const managementLinks = [
    { label: 'Open Courses list', to: '/admin/courses' },
    { label: 'Open Course creator', to: '/admin/courses/new' },
    { label: 'Open Lesson creator', to: '/admin/lessons/new' },
    { label: 'Open Exercise creator', to: '/admin/exercises/new' },
    { label: 'Open Quiz creator', to: '/admin/quizzes/new' },
    { label: 'Open Quizzes list', to: '/admin/quizzes' },
    { label: 'Open Users panel', to: '/admin/users' },
  ];

  return (
    <div className="space-y-6">
      <section className="panel rounded-[12px] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Admin control panel</p>
            <h1 className="mt-2 font-display text-[36px] font-bold text-mercury-50">Admin Dashboard</h1>
            <p className="mt-3 text-[15px] leading-7 text-mercury-500">
              Manage courses, lessons, exercises, and learners from a single command surface.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-[12px] border border-white/6 bg-bg-elevated px-4 py-3">
            <ShieldCheck className="text-cherry-500" size={18} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Role</p>
              <p className="text-[14px] font-semibold text-mercury-50">Admin access enabled</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
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
        <article className="panel rounded-2xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Quizzes</p>
          <p className="mt-2 font-display text-[32px] font-bold text-mercury-50">{stats.quizCount || 0}</p>
        </article>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Admin services</p>
            <h2 className="mt-2 font-display text-[24px] font-semibold text-mercury-50">Quick actions</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((card, index) => (
            <Link
              key={card.title}
              to={card.to}
              style={{ '--i': index }}
              className="fade-up panel pressable rounded-[12px] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(193,18,31,0.4)] hover:bg-[rgba(193,18,31,0.05)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[rgba(193,18,31,0.25)] bg-[rgba(193,18,31,0.12)] text-cherry-500">
                <card.icon size={18} />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-mercury-50">{card.title}</h3>
              <p className="mt-2 text-[14px] leading-7 text-mercury-500">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="panel rounded-[12px] p-5">
          <div className="flex items-center gap-2">
            <Layers3 size={16} className="text-cherry-500" />
            <h2 className="font-display text-[18px] font-semibold text-mercury-50">Management links</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {managementLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-[10px] border border-white/6 bg-bg-elevated px-4 py-3 text-[14px] text-mercury-500 transition hover:border-[rgba(193,18,31,0.35)] hover:text-mercury-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </article>

        <article className="panel rounded-[12px] p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-cherry-500" />
            <h2 className="font-display text-[18px] font-semibold text-mercury-50">Admin workflow</h2>
          </div>
          <ol className="mt-4 space-y-3 text-[14px] leading-7 text-mercury-500">
            <li>1. Create a course and publish it when the content is ready.</li>
            <li>2. Add lessons to the course with markdown explanation and starter code.</li>
            <li>3. Attach exercises with validation rules and hidden solutions.</li>
            <li>4. Review users, completion stats, and manage access when needed.</li>
          </ol>
        </article>
      </section>
    </div>
  );
}
