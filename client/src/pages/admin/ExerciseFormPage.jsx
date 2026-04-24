import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const initial = {
  lessonId: '',
  title: '',
  description: '',
  starterCode: '',
  solutionCode: '',
  validationRules: 'contains:<h1>',
  xpReward: 20,
};

export default function ExerciseFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (id) return;
    const lessonId = searchParams.get('lessonId');
    if (!lessonId) return;
    setForm((prev) => ({ ...prev, lessonId }));
  }, [id, searchParams]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await api.get(`/exercises/${id}`);
        const exercise = res.data;

        setForm({
          lessonId: exercise.lessonId,
          title: exercise.title,
          description: exercise.description,
          starterCode: exercise.starterCode,
          solutionCode: '',
          validationRules: (exercise.validationRules || []).join(','),
          xpReward: exercise.xpReward,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load exercise');
      }
    };
    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        validationRules: form.validationRules.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (id) {
        await api.put(`/exercises/${id}`, payload);
        toast.success('Exercise updated');
      } else {
        await api.post('/exercises', payload);
        toast.success('Exercise created');
        setForm(initial);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  return (
    <form onSubmit={submit} className="panel max-w-3xl space-y-3 rounded-[12px] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Admin form</p>
      <h1 className="font-display text-[36px] font-bold text-mercury-50">{id ? 'Edit Exercise' : 'New Exercise'}</h1>
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Lesson ID" value={form.lessonId} onChange={(e) => setForm({ ...form, lessonId: e.target.value })} />
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <textarea className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Starter code" value={form.starterCode} onChange={(e) => setForm({ ...form, starterCode: e.target.value })} />
      <textarea className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Solution code" value={form.solutionCode} onChange={(e) => setForm({ ...form, solutionCode: e.target.value })} />
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Validation rules comma separated" value={form.validationRules} onChange={(e) => setForm({ ...form, validationRules: e.target.value })} />
      <button className="pressable rounded-[10px] bg-cherry-500 px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-cherry-700">{id ? 'Update Exercise' : 'Create Exercise'}</button>
    </form>
  );
}
