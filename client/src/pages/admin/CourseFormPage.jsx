import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const initialForm = {
  title: '',
  slug: '',
  description: '',
  language: 'html',
  order: 1,
  isPublished: true,
};

export default function CourseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const res = await api.get('/courses');
      const found = res.data.find((course) => course._id === id);
      if (found) setForm(found);
    };
    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/courses/${id}`, form);
      } else {
        await api.post('/courses', form);
      }
      toast.success('Course saved');
      navigate('/admin/courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  return (
    <form onSubmit={submit} className="panel max-w-2xl space-y-3 rounded-[12px] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Admin form</p>
      <h1 className="font-display text-[36px] font-bold text-mercury-50">{id ? 'Edit Course' : 'New Course'}</h1>
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      <textarea className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <select className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="javascript">JavaScript</option>
      </select>
      <label className="flex items-center gap-2 text-[14px] text-mercury-500">
        <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
        Published
      </label>
      <button className="pressable rounded-[10px] bg-cherry-500 px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-cherry-700">Save</button>
    </form>
  );
}
