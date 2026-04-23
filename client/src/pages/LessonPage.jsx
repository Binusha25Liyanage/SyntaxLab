import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';

const toSrcDoc = (language, code) => {
  if (language === 'html') return code;
  if (language === 'css') {
    return `<!doctype html><html><head><style>${code}</style></head><body><h1>CSS Preview</h1><p>Style this content.</p></body></html>`;
  }
  return `<!doctype html><html><body><div id="app"></div><script>${code}</script></body></html>`;
};

export default function LessonPage() {
  const { slug, lessonSlug } = useParams();
  const { refreshProfile } = useAuth();

  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('code');
  const [code, setCode] = useState('');
  const debouncedCode = useDebounce(code, 500);

  const [feedback, setFeedback] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  const prefersDark = useMemo(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    []
  );

  useEffect(() => {
    const load = async () => {
      try {
        const courseRes = await api.get(`/courses/${slug}`);
        setCourse(courseRes.data);
        const foundLesson = courseRes.data.lessons.find((l) => l.slug === lessonSlug);
        if (!foundLesson) return;

        const lessonRes = await api.get(`/lessons/${foundLesson._id}`);
        setLesson(lessonRes.data);
        setCode(lessonRes.data.codeExample || '');

        const exRes = await api.get(`/exercises/lesson/${foundLesson._id}`);
        setExercises(exRes.data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, lessonSlug]);

  const submitExercise = async (exerciseId) => {
    try {
      const res = await api.post(`/exercises/${exerciseId}/submit`, { code });
      setFeedback((prev) => ({
        ...prev,
        [exerciseId]: { type: 'success', text: `${res.data.message} (+${res.data.xpGained} XP)` },
      }));
      toast.success(`Exercise passed! +${res.data.xpGained} XP`);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      await refreshProfile();
    } catch (error) {
      const message = error.response?.data?.message || 'Submission failed';
      setFeedback((prev) => ({
        ...prev,
        [exerciseId]: { type: 'error', text: message },
      }));
      toast.error(message);
    }
  };

  const completeLesson = async () => {
    if (!lesson) return;
    const res = await api.post(`/lessons/${lesson._id}/complete`);
    toast.success(`Lesson completed! +${res.data.xpGained} XP`);
    await refreshProfile();
  };

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />;
  }

  if (!lesson || !course) {
    return <p>Lesson not found.</p>;
  }

  return (
    <div className="space-y-5">
      {showConfetti && <Confetti recycle={false} numberOfPieces={220} />}
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mercury-700">Lesson</p>
          <h1 className="font-display text-[24px] font-bold text-mercury-50">{lesson.title}</h1>
        </div>
        <button onClick={completeLesson} className="pressable rounded-[10px] bg-cherry-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cherry-700">
          Mark Complete
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[42fr_58fr]">
        <article className="panel rounded-2xl p-7 xl:p-8">
          <div className="mb-6 text-[11px] text-mercury-700">
            <span>{course.title}</span> <span className="px-1">›</span> <span>{lesson.title}</span>
          </div>
          <ReactMarkdown className="lesson-copy max-w-none">{lesson.content}</ReactMarkdown>
          <button onClick={completeLesson} className="pressable mt-6 w-full rounded-[10px] bg-cherry-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cherry-700">
            Complete lesson
          </button>
        </article>

        <article className="editor-frame rounded-2xl">
          <div className="flex h-10 items-center justify-between border-b border-white/6 bg-[#0A0A0A] px-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('code')}
                className={`rounded-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition ${activeTab === 'code' ? 'bg-cherry-500 text-white' : 'bg-bg-overlay text-mercury-500'}`}
              >
                Code
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`rounded-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition ${activeTab === 'preview' ? 'bg-cherry-500 text-white' : 'bg-bg-overlay text-mercury-500'}`}
              >
                Preview
              </button>
            </div>
            <span className="rounded-full bg-cherry-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
              {lesson.language}
            </span>
          </div>

          {activeTab === 'code' ? (
            <Editor
              height="420px"
              theme="vs-dark"
              language={lesson.language}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }}
            />
          ) : (
            <iframe
              title="preview"
              className="h-[420px] w-full border-t border-white/6 bg-white"
              sandbox="allow-scripts"
              srcDoc={toSrcDoc(lesson.language, debouncedCode)}
            />
          )}

          <div className="border-t border-white/6 bg-bg-surface px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-mercury-700">Exercise</p>
                <p className="mt-2 text-[14px] text-mercury-500">Complete the task below, validate your code, and earn XP.</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {exercises.map((exercise) => (
                <article key={exercise._id} className="rounded-[12px] border border-white/6 bg-bg-elevated p-4">
                  <h3 className="text-[15px] font-semibold text-mercury-50">{exercise.title}</h3>
                  <p className="mt-2 text-[14px] leading-7 text-mercury-500">{exercise.description}</p>
                  <button
                    onClick={() => submitExercise(exercise._id)}
                    className="pressable mt-4 rounded-[8px] bg-cherry-500 px-5 py-2 text-[14px] font-semibold text-white transition hover:bg-cherry-700"
                  >
                    Submit
                  </button>
                  {feedback[exercise._id] && (
                    <div
                      className={`mt-3 rounded-[12px] border p-3 text-[14px] ${
                        feedback[exercise._id].type === 'success'
                          ? 'border-success bg-[rgba(34,197,94,0.1)] text-success'
                          : 'border-cherry-500 bg-[rgba(193,18,31,0.1)] text-cherry-200'
                      }`}
                    >
                      {feedback[exercise._id].text}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
