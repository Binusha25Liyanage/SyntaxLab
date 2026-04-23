import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.22),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.2),transparent_40%)]" />
      <section className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-start justify-center px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl text-5xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl"
        >
          Learn to code with live practice, instant feedback, and measurable progress.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300"
        >
          CodeLab+ blends guided lessons with a real editor, live preview, and gamified learning paths.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8 flex gap-4">
          <Link to="/courses" className="rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white hover:bg-indigo-600">
            Explore Courses
          </Link>
          <Link to="/register" className="rounded-xl border border-slate-300 px-5 py-3 font-semibold dark:border-slate-700">
            Get Started
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
