import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const badgeStyles = {
    html: 'bg-[#FBECEE] text-[#7B0D14]',
    javascript: 'bg-[#1A1500] text-[#D4A017]',
    css: 'bg-[#001629] text-[#5AA0D4]',
  };

  const progress = course.progress || 0;
  const progressLabel = progress > 0 ? `${progress}% complete` : 'Not started';

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group relative overflow-hidden rounded-[12px] border border-white/7 bg-bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(193,18,31,0.4)]"
    >
      <div className={`absolute right-5 top-5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${badgeStyles[course.language] || 'bg-bg-overlay text-mercury-500'}`}>
        {course.language}
      </div>
      <h3 className="max-w-[80%] text-[15px] font-semibold leading-6 text-mercury-50 transition group-hover:text-cherry-500">
        {course.title}
      </h3>
      <p className="mt-2 text-[12px] text-mercury-700">{course.lessons?.length || 0} lessons · Structured path</p>
      <p className="mt-4 text-[15px] leading-7 text-mercury-500">{course.description}</p>
      <div className="mt-5">
        <div className="h-1 rounded-full bg-bg-overlay">
          <div className="h-full rounded-full bg-cherry-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] ${progress > 0 ? 'text-cherry-500' : 'text-mercury-700'}`}>
          {progressLabel}
        </p>
      </div>
    </Link>
  );
}
