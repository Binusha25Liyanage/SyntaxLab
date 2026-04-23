import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

export default function AdminUsersPage() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (nextPage = 1) => {
    const res = await api.get(`/users?page=${nextPage}`);
    setRows(res.data.users);
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    load(1);
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success('User removed');
      load(page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Admin roster</p>
        <h1 className="mt-2 font-display text-[36px] font-bold text-mercury-50">Users</h1>
      </div>
      <div className="overflow-hidden rounded-[12px] border border-white/6 bg-bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#111111]">
            <tr>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Username</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Email</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Role</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">XP</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user._id} className="border-t border-white/4 transition hover:bg-[rgba(193,18,31,0.05)]">
                <td className="px-4 py-3 text-mercury-50">{user.username}</td>
                <td className="px-4 py-3 text-mercury-500">{user.email}</td>
                <td className="px-4 py-3 text-mercury-500">{user.role}</td>
                <td className="px-4 py-3 text-mercury-50">{user.xp}</td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(user._id)} className="rounded-[8px] border border-cherry-500 bg-[rgba(193,18,31,0.1)] px-2 py-1 text-xs text-cherry-200 transition hover:bg-[rgba(193,18,31,0.16)]">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2">
        <button disabled={page <= 1} onClick={() => load(page - 1)} className="rounded-[8px] border border-white/10 px-3 py-1 text-mercury-50 disabled:opacity-40">
          Prev
        </button>
        <span className="text-sm text-mercury-500">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => load(page + 1)} className="rounded-[8px] border border-white/10 px-3 py-1 text-mercury-50 disabled:opacity-40">
          Next
        </button>
      </div>
    </div>
  );
}
