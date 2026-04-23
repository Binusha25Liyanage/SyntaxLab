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
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <button onClick={completeLesson} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">
          Mark Complete
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <article className="glass rounded-2xl p-4 xl:col-span-2">
          <ReactMarkdown className="prose prose-slate dark:prose-invert max-w-none">{lesson.content}</ReactMarkdown>
        </article>

        <article className="glass rounded-2xl p-4 xl:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('code')}
                className={`rounded-lg px-3 py-1 text-sm ${activeTab === 'code' ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                Code
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`rounded-lg px-3 py-1 text-sm ${activeTab === 'preview' ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                Preview
              </button>
            </div>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs uppercase text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200">
              {lesson.language}
            </span>
          </div>

          {activeTab === 'code' ? (
            <Editor
              height="420px"
              theme={prefersDark ? 'vs-dark' : 'light'}
              language={lesson.language}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          ) : (
            <iframe
              title="preview"
              className="h-[420px] w-full rounded-xl border border-slate-200 bg-white dark:border-slate-700"
              sandbox="allow-scripts"
              srcDoc={toSrcDoc(lesson.language, debouncedCode)}
            />
          )}
        </article>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Exercises</h2>
        {exercises.map((exercise) => (
          <article key={exercise._id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold">{exercise.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{exercise.description}</p>
            <button
              onClick={() => submitExercise(exercise._id)}
              className="mt-3 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Submit
            </button>
            {feedback[exercise._id] && (
              <p className={`mt-2 text-sm ${feedback[exercise._id].type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {feedback[exercise._id].text}
              </p>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
