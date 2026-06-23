"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

interface Attempt { id: number; studentName: string; department: string; setId: number; setName: string | null; score: number; totalQuestions: number; timeTakenSeconds: number | null; completedAt: string; }

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState("");
  const [filterSet, setFilterSet] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => { checkAuth(); }, []);

  async function checkAuth() { try { const r = await fetch("/api/admin/check"); if (r.ok) { setAuthed(true); loadData(); } } catch {} setChecking(false); }
  async function login(e: React.FormEvent) { e.preventDefault(); setBusy(true); setErr(""); try { const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) }); if (r.ok) { setAuthed(true); loadData(); } else setErr("Invalid password"); } catch { setErr("Login failed"); } setBusy(false); }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setAuthed(false); setPw(""); }
  async function loadData() { try { setAttempts(await (await fetch("/api/attempts")).json()); } catch {} setLoading(false); }

  const fmt = (s: number | null) => s ? `${Math.floor(s / 60)}m ${s % 60}s` : "—";

  if (checking) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" /></div>;

  if (!authed) return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm animate-scale-in">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mx-auto mb-3"><span className="text-2xl">🔐</span></div>
            <h1 className="text-xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-1">Enter password to continue</p>
          </div>
          <form onSubmit={login} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Password" required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 placeholder-gray-400" />
            {err && <p className="text-red-600 text-sm bg-red-50 p-2.5 rounded-lg">{err}</p>}
            <button type="submit" disabled={busy} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition disabled:opacity-50">{busy ? "…" : "Login"}</button>
          </form>
          <div className="mt-4 text-center"><a href="/" className="text-xs text-gray-400 hover:text-indigo-600 transition">← Back to Quiz</a></div>
        </div>
      </div>
      <Footer />
    </div>
  );

  const depts = [...new Set(attempts.map(a => a.department))];
  const setNames = [...new Set(attempts.map(a => a.setName).filter(Boolean))];
  const filtered = attempts.filter(a => (!filterDept || a.department === filterDept) && (!filterSet || a.setName === filterSet) && (!search || a.studentName.toLowerCase().includes(search.toLowerCase())));
  const avg = filtered.length ? Math.round(filtered.reduce((s, a) => s + (a.score / a.totalQuestions) * 100, 0) / filtered.length) : 0;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3 animate-fade-in">
          <div><h1 className="text-2xl font-bold text-gray-800">📊 Dashboard</h1><p className="text-gray-400 text-sm">Student performance overview</p></div>
          <div className="flex gap-2">
            <a href="/" className="bg-white border border-gray-200 text-gray-600 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 transition">← Quiz</a>
            <button onClick={logout} className="bg-red-50 text-red-600 text-sm py-2 px-3 rounded-lg hover:bg-red-100 transition">Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
          {[["Attempts", filtered.length, "text-indigo-600"], ["Students", new Set(filtered.map(a => a.studentName)).size, "text-green-600"], ["Avg Score", `${avg}%`, "text-yellow-600"], ["Depts", depts.length, "text-purple-600"]].map(([l, v, c], i) => (
            <div key={String(l)} style={{ animationDelay: `${i * 60}ms` }} className="animate-slide-up bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] text-gray-400 uppercase font-medium">{String(l)}</p>
              <p className={`text-2xl font-bold mt-0.5 ${c}`}>{String(v)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-3 mb-4 shadow-sm animate-fade-in">
          <div className="flex flex-wrap gap-2.5">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name…"
              className="flex-1 min-w-[160px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-1 focus:ring-indigo-500" />
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="">All Depts</option>{depts.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={filterSet} onChange={e => setFilterSet(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="">All Sets</option>{setNames.map(s => <option key={s} value={s!}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm animate-slide-up delay-100">
          {!filtered.length ? (
            <div className="p-10 text-center text-gray-400"><p className="text-3xl mb-2">📭</p><p>No attempts yet</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase">
                  {["#", "Name", "Dept", "Set", "Score", "%", "Time", "Date"].map(h => <th key={h} className="px-3 py-2.5 text-left font-medium">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((a, i) => {
                    const p = Math.round((a.score / a.totalQuestions) * 100);
                    const pc = p >= 70 ? "text-green-700 bg-green-50" : p >= 50 ? "text-yellow-700 bg-yellow-50" : "text-red-700 bg-red-50";
                    return (
                      <tr key={a.id} className="hover:bg-gray-50 transition">
                        <td className="px-3 py-2.5 text-gray-400 font-mono text-xs">{i + 1}</td>
                        <td className="px-3 py-2.5 font-semibold text-gray-800">{a.studentName}</td>
                        <td className="px-3 py-2.5 text-gray-500">{a.department}</td>
                        <td className="px-3 py-2.5 text-gray-500">{a.setName || `Set ${a.setId}`}</td>
                        <td className="px-3 py-2.5 font-mono text-gray-800">{a.score}/{a.totalQuestions}</td>
                        <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pc}`}>{p}%</span></td>
                        <td className="px-3 py-2.5 font-mono text-gray-500 text-xs">{fmt(a.timeTakenSeconds)}</td>
                        <td className="px-3 py-2.5 text-gray-400 text-xs">{new Date(a.completedAt).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
