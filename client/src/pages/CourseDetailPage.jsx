import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/SkeletonCard';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/courses/${slug}`);
        setCourse(res.data);
        const quizzesRes = await api.get(`/quizzes/course/${res.data._id}`);
        setQuizzes(quizzesRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const completedLessonSet = useMemo(
    () => new Set((user?.completedLessons || []).map((lesson) => lesson._id || lesson)),
    [user?.completedLessons]
  );

  const progress = useMemo(() => {
    if (!course?.lessons?.length) return 0;
    const done = course.lessons.filter((lesson) => completedLessonSet.has(lesson._id)).length;
    return Math.round((done / course.lessons.length) * 100);
  }, [course?.lessons, completedLessonSet]);

  const submitQuiz = async (quizId) => {
    const optionIndex = selectedAnswers[quizId];
    if (optionIndex === undefined || optionIndex === null) {
      toast.error('Choose an answer first');
      return;
    }

    try {
      const res = await api.post(`/quizzes/${quizId}/submit`, { optionIndex });
      setQuizFeedback((prev) => ({
        ...prev,
        [quizId]: {
          type: 'success',
          text: `${res.data.message} (+${res.data.xpGained} XP)`,
          explanation: res.data.explanation,
        },
      }));
      toast.success(`Quiz passed! +${res.data.xpGained} XP`);
    } catch (error) {
      const message = error.response?.data?.message || 'Quiz submission failed';
      setQuizFeedback((prev) => ({
        ...prev,
        [quizId]: { type: 'error', text: message },
      }));
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <div className="space-y-6">
      <section className="panel rounded-2xl p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Course overview</p>
        <h1 className="mt-2 font-display text-[36px] font-bold text-mercury-50">{course.title}</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-mercury-500">{course.description}</p>
        <div className="mt-5 h-1.5 rounded-full bg-bg-overlay">
          <div className="h-full rounded-full bg-gradient-to-r from-cherry-500 to-[#E84040] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-[12px] text-mercury-700">Course progress: {progress}%</p>
      </section>

      <section className="grid gap-3">
        {course.lessons.map((lesson) => (
          <Link
            key={lesson._id}
            to={`/courses/${course.slug}/${lesson.slug}`}
            className="flex items-center justify-between rounded-[12px] border border-white/6 bg-bg-surface px-4 py-3 transition hover:border-[rgba(193,18,31,0.4)] hover:bg-[rgba(193,18,31,0.05)]"
          >
            <span className="text-[15px] text-mercury-50">{lesson.title}</span>
            {completedLessonSet.has(lesson._id) && <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-success">Completed</span>}
          </Link>
        ))}
      </section>

      {quizzes.length > 0 && (
        <section className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Course quizzes</p>
            <h2 className="mt-2 font-display text-[24px] font-semibold text-mercury-50">Check your understanding</h2>
          </div>

          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <article key={quiz._id} className="panel rounded-[12px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Quiz</p>
                    <h3 className="mt-2 text-[18px] font-semibold text-mercury-50">{quiz.question}</h3>
                  </div>
                  <span className="rounded-full bg-[rgba(193,18,31,0.15)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-cherry-500">
                    +{quiz.xpReward} XP
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {quiz.options.map((option, index) => (
                    <label key={`${quiz._id}-${index}`} className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-white/6 bg-bg-elevated px-4 py-3 text-[14px] text-mercury-500 transition hover:border-[rgba(193,18,31,0.35)] hover:text-mercury-50">
                      <input
                        type="radio"
                        name={quiz._id}
                        checked={selectedAnswers[quiz._id] === index}
                        onChange={() => setSelectedAnswers((prev) => ({ ...prev, [quiz._id]: index }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => submitQuiz(quiz._id)}
                  className="pressable mt-4 rounded-[10px] bg-cherry-500 px-5 py-2 text-[14px] font-semibold text-white transition hover:bg-cherry-700"
                >
                  Submit Quiz
                </button>

                {quizFeedback[quiz._id] && (
                  <div
                    className={`mt-3 rounded-[12px] border p-3 text-[14px] ${
                      quizFeedback[quiz._id].type === 'success'
                        ? 'border-success bg-[rgba(34,197,94,0.1)] text-success'
                        : 'border-cherry-500 bg-[rgba(193,18,31,0.1)] text-cherry-200'
                    }`}
                  >
                    <p>{quizFeedback[quiz._id].text}</p>
                    {quizFeedback[quiz._id].explanation && (
                      <p className="mt-2 text-[13px] text-mercury-300">{quizFeedback[quiz._id].explanation}</p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
