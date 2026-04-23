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
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cherry-500">Top performers</p>
        <h1 className="mt-2 font-display text-[36px] font-bold text-mercury-50">Leaderboard</h1>
      </div>
      <div className="overflow-hidden rounded-[12px] border border-white/6 bg-bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#111111]">
            <tr>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Rank</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">Username</th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-mercury-700">XP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="border-t border-white/4 transition hover:bg-[rgba(193,18,31,0.05)]">
                <td className="px-4 py-3 text-mercury-500">#{row.rank}</td>
                <td className="px-4 py-3 text-mercury-50">{row.username}</td>
                <td className="px-4 py-3 font-semibold text-cherry-500">{row.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
