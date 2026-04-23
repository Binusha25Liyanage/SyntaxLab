import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const initial = {
  courseId: '',
  title: '',
  slug: '',
  content: '',
  codeExample: '',
  language: 'html',
  order: 1,
  xpReward: 10,
};

export default function LessonFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await api.get(`/lessons/${id}`);
        setForm({
          courseId: res.data.courseId,
          title: res.data.title,
          slug: res.data.slug,
          content: res.data.content,
          codeExample: res.data.codeExample,
          language: res.data.language,
          order: res.data.order,
          xpReward: res.data.xpReward,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load lesson');
      }
    };
    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/lessons/${id}`, form);
        toast.success('Lesson updated');
      } else {
        await api.post('/lessons', form);
        toast.success('Lesson created');
        setForm(initial);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  return (
    <form onSubmit={submit} className="glass max-w-3xl space-y-3 rounded-2xl p-6">
      <h1 className="text-2xl font-bold">{id ? 'Edit Lesson' : 'New Lesson'}</h1>
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Course ID" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} />
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      <textarea className="h-40 w-full rounded-lg border px-3 py-2" placeholder="Markdown content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      <textarea className="h-32 w-full rounded-lg border px-3 py-2" placeholder="Code example" value={form.codeExample} onChange={(e) => setForm({ ...form, codeExample: e.target.value })} />
      <button className="rounded-lg bg-indigo-500 px-4 py-2 text-white">{id ? 'Update Lesson' : 'Create Lesson'}</button>
    </form>
  );
}
