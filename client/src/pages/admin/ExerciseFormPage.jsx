import { useState } from 'react';
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
  const [form, setForm] = useState(initial);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/exercises', {
        ...form,
        validationRules: form.validationRules.split(',').map((s) => s.trim()).filter(Boolean),
      });
      toast.success('Exercise created');
      setForm(initial);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  return (
    <form onSubmit={submit} className="glass max-w-3xl space-y-3 rounded-2xl p-6">
      <h1 className="text-2xl font-bold">New Exercise</h1>
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Lesson ID" value={form.lessonId} onChange={(e) => setForm({ ...form, lessonId: e.target.value })} />
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea className="w-full rounded-lg border px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <textarea className="w-full rounded-lg border px-3 py-2" placeholder="Starter code" value={form.starterCode} onChange={(e) => setForm({ ...form, starterCode: e.target.value })} />
      <textarea className="w-full rounded-lg border px-3 py-2" placeholder="Solution code" value={form.solutionCode} onChange={(e) => setForm({ ...form, solutionCode: e.target.value })} />
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Validation rules comma separated" value={form.validationRules} onChange={(e) => setForm({ ...form, validationRules: e.target.value })} />
      <button className="rounded-lg bg-indigo-500 px-4 py-2 text-white">Create Exercise</button>
    </form>
  );
}
