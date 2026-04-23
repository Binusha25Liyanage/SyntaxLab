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
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="overflow-hidden rounded-2xl border bg-white dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">XP</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.xp}</td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(user._id)} className="rounded-md bg-rose-500 px-2 py-1 text-xs text-white">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2">
        <button disabled={page <= 1} onClick={() => load(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">
          Prev
        </button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => load(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">
          Next
        </button>
      </div>
    </div>
  );
}
