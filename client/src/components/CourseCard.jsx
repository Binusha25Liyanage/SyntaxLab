import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
        {course.language}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 transition group-hover:text-indigo-600 dark:text-slate-100">
        {course.title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{course.description}</p>
    </Link>
  );
}
