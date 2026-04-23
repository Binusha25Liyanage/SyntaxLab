import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div
      className="relative overflow-hidden bg-bg-base"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(193,18,31,0.18),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(255,255,255,0.06),transparent_24%)]" />
      <section className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 py-20 md:px-8">
        <div className="max-w-[720px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500 fade-up">Precision engineering meets bold academia</p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 max-w-4xl font-display text-[32px] font-extrabold leading-[1.1] tracking-tight text-mercury-50 md:text-[52px]"
        >
          Learn to code.
          <span className="block text-cherry-500">Build real things.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
            className="mt-6 max-w-[480px] text-[16px] leading-7 text-mercury-500"
        >
          CodeLab+ pairs structured lessons with a live editor, immediate validation, and a rigorous learning path built to produce real output.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8 flex flex-wrap gap-3">
          <Link to="/courses" className="pressable rounded-[10px] bg-cherry-500 px-7 py-3 text-[14px] font-semibold text-white transition hover:bg-cherry-700">
            Explore Courses
          </Link>
          <Link to="/register" className="pressable rounded-[10px] border border-white/15 px-7 py-3 text-[14px] font-semibold text-mercury-300 transition hover:border-white/25 hover:text-mercury-50">
            Get Started
          </Link>
        </motion.div>
        <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
          {[
            ['2,400+', 'Learners'],
            ['3', 'Courses'],
            ['48', 'Lessons'],
          ].map(([value, label]) => (
            <div key={label} className="panel rounded-xl p-4 fade-up">
              <div className="text-[20px] font-bold text-mercury-50">{value}</div>
              <div className="mt-1 text-[12px] text-mercury-700">{label}</div>
            </div>
          ))}
        </div>
        </div>
      </section>
    </div>
  );
}
