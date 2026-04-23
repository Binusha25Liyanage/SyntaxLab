import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
      <form onSubmit={onSubmit} className="panel w-full rounded-[12px] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Join</p>
        <h1 className="mt-2 font-display text-[36px] font-bold text-mercury-50">Create account</h1>
        <div className="mt-6 space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="field-dark w-full rounded-[10px] px-3 py-3 text-[14px] outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button disabled={loading} className="pressable mt-5 w-full rounded-[10px] bg-cherry-500 py-3 text-[14px] font-semibold text-white transition hover:bg-cherry-700">
          {loading ? 'Creating...' : 'Register'}
        </button>
        <p className="mt-3 text-[14px] text-mercury-500">
          Already have an account? <Link to="/login" className="text-cherry-500">Login</Link>
        </p>
      </form>
    </div>
  );
}
