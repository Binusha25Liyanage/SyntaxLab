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
    <form onSubmit={submit} className="panel max-w-3xl space-y-3 rounded-[12px] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Admin form</p>
      <h1 className="font-display text-[36px] font-bold text-mercury-50">{id ? 'Edit Lesson' : 'New Lesson'}</h1>
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Course ID" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} />
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      <textarea className="field-dark h-40 w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Markdown content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      <textarea className="field-dark h-32 w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Code example" value={form.codeExample} onChange={(e) => setForm({ ...form, codeExample: e.target.value })} />
      <button className="pressable rounded-[10px] bg-cherry-500 px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-cherry-700">{id ? 'Update Lesson' : 'Create Lesson'}</button>
    </form>
  );
}
