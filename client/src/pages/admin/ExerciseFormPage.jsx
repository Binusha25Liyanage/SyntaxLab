import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const [form, setForm] = useState(initial);

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
    <form onSubmit={submit} className="glass max-w-3xl space-y-3 rounded-2xl p-6">
      <h1 className="text-2xl font-bold">{id ? 'Edit Exercise' : 'New Exercise'}</h1>
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Lesson ID" value={form.lessonId} onChange={(e) => setForm({ ...form, lessonId: e.target.value })} />
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea className="w-full rounded-lg border px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <textarea className="w-full rounded-lg border px-3 py-2" placeholder="Starter code" value={form.starterCode} onChange={(e) => setForm({ ...form, starterCode: e.target.value })} />
      <textarea className="w-full rounded-lg border px-3 py-2" placeholder="Solution code" value={form.solutionCode} onChange={(e) => setForm({ ...form, solutionCode: e.target.value })} />
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Validation rules comma separated" value={form.validationRules} onChange={(e) => setForm({ ...form, validationRules: e.target.value })} />
      <button className="rounded-lg bg-indigo-500 px-4 py-2 text-white">{id ? 'Update Exercise' : 'Create Exercise'}</button>
    </form>
  );
}
