import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function LeaderboardPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/users/leaderboard');
      setRows(res.data);
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Top Coders</h1>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">XP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="px-4 py-3">#{row.rank}</td>
                <td className="px-4 py-3">{row.username}</td>
                <td className="px-4 py-3 font-semibold text-indigo-600">{row.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
