import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import Hyperspeed from '../components/Hyperspeed';

export default function AiTutorPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const effectOptions = useMemo(
    () => ({
      distortion: 'turbulentDistortion',
      length: 360,
      roadWidth: 9,
      islandWidth: 2,
      lanesPerRoad: 3,
      fov: 95,
      fovSpeedUp: 140,
      speedUp: 1.8,
      carLightsFade: 0.45,
      totalSideLightSticks: 16,
      lightPairsPerRoadWay: 34,
      colors: {
        roadColor: 0x09090b,
        islandColor: 0x121217,
        background: 0x050507,
        shoulderLines: 0x6f737d,
        brokenLines: 0xa5abb7,
        leftCars: [0xc1121f, 0xe5383b, 0xf1faee],
        rightCars: [0x8f95a3, 0xced2db, 0x7a818f],
        sticks: 0xc1121f,
      },
    }),
    []
  );
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Ask me anything about your SyntaxLab+ lessons, exercises, quizzes, HTML, CSS, or JavaScript learning path.',
    },
  ]);

  const ask = async (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await api.post('/ai/ask', { question: trimmed });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.answer }]);
    } catch (error) {
      const msg = error.response?.data?.message || 'AI tutor is currently unavailable.';
      toast.error(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I could not process that right now. Check AI server configuration and try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative -mx-4 -mt-20 min-h-screen overflow-hidden md:-mx-8 md:-mt-8">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
        <Hyperspeed effectOptions={effectOptions} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_14%,rgba(193,18,31,0.24),transparent_52%),radial-gradient(circle_at_82%_4%,rgba(206,210,219,0.18),transparent_40%),linear-gradient(180deg,rgba(6,6,8,0.62),rgba(6,6,8,0.84))]" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-5 px-4 pb-8 pt-20 md:px-8 md:pt-8">
      <section className="panel rounded-[12px] border-white/10 bg-[rgba(8,9,12,0.72)] p-6 backdrop-blur-[2px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">AI tutor</p>
        <h1 className="mt-2 font-display text-[36px] font-bold text-mercury-50">Learning Assistant</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-mercury-500">
          Ask course-related questions and get guidance grounded in SyntaxLab+ lessons, exercises, and quizzes.
        </p>
      </section>

      <section className="panel rounded-[12px] border-white/10 bg-[rgba(8,9,12,0.72)] p-4 backdrop-blur-[2px] md:p-6">
        <div className="max-h-[56vh] space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={`rounded-[12px] border px-4 py-3 text-[14px] leading-7 ${
                message.role === 'user'
                  ? 'ml-auto max-w-[85%] border-cherry-500/40 bg-[rgba(193,18,31,0.14)] text-mercury-50'
                  : 'max-w-[95%] border-white/8 bg-bg-elevated text-mercury-300'
              }`}
            >
              {message.content}
            </article>
          ))}
          {loading && (
            <article className="max-w-[95%] rounded-[12px] border border-white/8 bg-bg-elevated px-4 py-3 text-[14px] text-mercury-500">
              Thinking...
            </article>
          )}
        </div>

        <form onSubmit={ask} className="mt-4 flex flex-col gap-3 md:flex-row">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about a lesson, concept, exercise, or quiz..."
            className="field-dark min-h-[68px] w-full rounded-[10px] px-3 py-3 text-[14px] outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="pressable h-[68px] rounded-[10px] bg-cherry-500 px-5 text-[14px] font-semibold text-white transition hover:bg-cherry-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Ask AI
          </button>
        </form>
      </section>
      </div>
    </div>
  );
}