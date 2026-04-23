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
    <form onSubmit={submit} className="glass max-w-2xl space-y-3 rounded-2xl p-6">
      <h1 className="text-2xl font-bold">{id ? 'Edit Course' : 'New Course'}</h1>
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input className="w-full rounded-lg border px-3 py-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      <textarea className="w-full rounded-lg border px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <select className="w-full rounded-lg border px-3 py-2" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="javascript">JavaScript</option>
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
        Published
      </label>
      <button className="rounded-lg bg-indigo-500 px-4 py-2 text-white">Save</button>
    </form>
  );
}
