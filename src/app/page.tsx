"use client";

import { useState, useEffect } from "react";
import QuizPage from "@/components/QuizPage";
import ResultsPage from "@/components/ResultsPage";
import Footer from "@/components/Footer";

interface QuizSet { id: number; name: string; description: string | null; questionCount: number; }
type AppState = "register" | "selectSet" | "quiz" | "results";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("register");
  const [studentName, setStudentName] = useState("");
  const [department, setDepartment] = useState("");
  const [sets, setSets] = useState<QuizSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<QuizSet | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => { seedAndLoad(); }, []);

  async function seedAndLoad() {
    setSeeding(true);
    try { await fetch("/api/seed", { method: "POST" }); const r = await fetch("/api/sets"); setSets(await r.json()); } catch (e) { console.error(e); }
    setSeeding(false);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (studentName.trim() && department.trim()) setAppState("selectSet");
  }

  if (seeding) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent mx-auto mb-4" />
        <p className="text-gray-400">Loading quiz data…</p>
      </div>
    </div>
  );

  if (appState === "register") return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-float shadow-lg shadow-indigo-200">
              <span className="text-3xl">⚛️</span>
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PHY Test Yourself</h1>
            <p className="text-gray-400 text-sm mt-1">Physics Quiz Portal</p>
          </div>

          <a href="https://theprepium.vercel.app" target="_blank" rel="noopener noreferrer"
            className="block mb-6 p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 hover:border-indigo-300 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0"><span className="text-lg">🚀</span></div>
              <div className="min-w-0">
                <p className="font-semibold text-indigo-700 text-sm group-hover:text-indigo-900 transition">Prepium</p>
                <p className="text-[11px] text-gray-500 leading-snug">AI-powered study tools: practice questions, CGPA calculator & deadline tracker</p>
              </div>
              <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </a>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="animate-slide-up">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Enter your full name" required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-800 placeholder-gray-400" />
              </div>
              <div className="animate-slide-up delay-100">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Department</label>
                <input type="text" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Physics, Engineering" required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-800 placeholder-gray-400" />
              </div>
              <button type="submit" className="animate-slide-up delay-200 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-200 active:scale-[0.98]">
                Start Quiz →
              </button>
            </form>
          </div>
          <div className="mt-5 text-center">
            <a href="/admin" className="text-xs text-gray-400 hover:text-indigo-600 transition">Admin Panel →</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (appState === "selectSet") return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, <span className="text-indigo-600">{studentName}</span></h1>
          <p className="text-gray-400 text-sm mt-1">{department} · Choose a set below</p>
        </div>
        {sets.length === 0 ? (
          <div className="text-center py-16 text-gray-400 animate-fade-in"><p className="text-4xl mb-3">📭</p><p>No quiz sets available yet.</p></div>
        ) : (
          <div className="space-y-3">
            {sets.map((set, i) => (
              <button key={set.id} onClick={() => { setSelectedSet(set); setAppState("quiz"); }}
                style={{ animationDelay: `${i * 80}ms` }}
                className="animate-slide-up w-full bg-white border border-gray-100 rounded-xl p-5 text-left hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50 transition-all group active:scale-[0.99]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-800 group-hover:text-indigo-600 transition">{set.name}</h2>
                    {set.description && <p className="text-gray-400 text-sm mt-0.5">{set.description}</p>}
                    <span className="inline-block mt-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">{set.questionCount} questions</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-indigo-500 transition-all group-hover:translate-x-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="text-center mt-5">
          <button onClick={() => { setStudentName(""); setDepartment(""); setAppState("register"); }} className="text-xs text-gray-400 hover:text-indigo-600 transition">← Change details</button>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (appState === "quiz" && selectedSet) return (
    <QuizPage setId={selectedSet.id} setName={selectedSet.name} studentName={studentName} department={department}
      onComplete={(s, t, time) => { setFinalScore(s); setFinalTotal(t); setFinalTime(time); setAppState("results"); }}
      onBack={() => setAppState("selectSet")} />
  );

  if (appState === "results") return (
    <ResultsPage studentName={studentName} setName={selectedSet?.name || ""} score={finalScore} total={finalTotal} timeTakenSeconds={finalTime}
      onRetake={() => { setSelectedSet(null); setAppState("selectSet"); }}
      onNewStudent={() => { setStudentName(""); setDepartment(""); setSelectedSet(null); setAppState("register"); }} />
  );

  return null;
}
