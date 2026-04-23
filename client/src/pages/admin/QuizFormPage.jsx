import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const initialForm = {
  courseId: '',
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctIndex: 0,
  explanation: '',
  order: 1,
  xpReward: 15,
  isPublished: true,
};

export default function QuizFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [coursesRes, quizRes] = await Promise.all([
          api.get('/courses'),
          id ? api.get(`/quizzes/${id}`) : Promise.resolve(null),
        ]);

        setCourses(coursesRes.data);

        if (quizRes?.data) {
          const quiz = quizRes.data;
          setForm({
            courseId: quiz.courseId,
            question: quiz.question,
            optionA: quiz.options?.[0] || '',
            optionB: quiz.options?.[1] || '',
            optionC: quiz.options?.[2] || '',
            optionD: quiz.options?.[3] || '',
            correctIndex: quiz.correctIndex,
            explanation: quiz.explanation,
            order: quiz.order,
            xpReward: quiz.xpReward,
            isPublished: quiz.isPublished,
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load quiz data');
      }
    };

    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      courseId: form.courseId,
      question: form.question,
      options: [form.optionA, form.optionB, form.optionC, form.optionD].filter(Boolean),
      correctIndex: Number(form.correctIndex),
      explanation: form.explanation,
      order: Number(form.order),
      xpReward: Number(form.xpReward),
      isPublished: form.isPublished,
    };

    try {
      if (id) {
        await api.put(`/quizzes/${id}`, payload);
        toast.success('Quiz updated');
      } else {
        await api.post('/quizzes', payload);
        toast.success('Quiz created');
        setForm(initialForm);
      }
      navigate('/admin/quizzes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  return (
    <form onSubmit={submit} className="panel max-w-3xl space-y-3 rounded-[12px] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Admin form</p>
      <h1 className="font-display text-[36px] font-bold text-mercury-50">{id ? 'Edit Quiz' : 'New Quiz'}</h1>

      <select
        className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none"
        value={form.courseId}
        onChange={(e) => setForm({ ...form, courseId: e.target.value })}
      >
        <option value="">Select course</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.title}
          </option>
        ))}
      </select>

      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Option A" value={form.optionA} onChange={(e) => setForm({ ...form, optionA: e.target.value })} />
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Option B" value={form.optionB} onChange={(e) => setForm({ ...form, optionB: e.target.value })} />
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Option C" value={form.optionC} onChange={(e) => setForm({ ...form, optionC: e.target.value })} />
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Option D" value={form.optionD} onChange={(e) => setForm({ ...form, optionD: e.target.value })} />

      <select
        className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none"
        value={form.correctIndex}
        onChange={(e) => setForm({ ...form, correctIndex: e.target.value })}
      >
        <option value={0}>Correct answer: Option A</option>
        <option value={1}>Correct answer: Option B</option>
        <option value={2}>Correct answer: Option C</option>
        <option value={3}>Correct answer: Option D</option>
      </select>

      <textarea className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Explanation" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />

      <div className="grid gap-3 md:grid-cols-2">
        <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
        <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="XP reward" type="number" value={form.xpReward} onChange={(e) => setForm({ ...form, xpReward: e.target.value })} />
      </div>

      <label className="flex items-center gap-2 text-[14px] text-mercury-500">
        <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
        Published
      </label>

      <button className="pressable rounded-[10px] bg-cherry-500 px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-cherry-700">
        {id ? 'Update Quiz' : 'Create Quiz'}
      </button>
    </form>
  );
}