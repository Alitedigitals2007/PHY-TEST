"use client";

import { useState, useEffect, useRef } from "react";
import Latex from "@/components/Latex";
import Footer from "@/components/Footer";

interface Question { id: number; questionText: string; optionA: string; optionB: string; optionC: string; optionD: string; correctOption: string; explanation: string | null; orderIndex: number; }
interface Answer { selectedOption: string; isCorrect: boolean; }
interface Props { setId: number; setName: string; studentName: string; department: string; onComplete: (score: number, total: number, timeSec: number) => void; onBack: () => void; }

export default function QuizPage({ setId, setName, studentName, department, onComplete, onBack }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`/api/sets/${setId}/questions`).then(r => r.json()).then(d => { setQuestions(d); setLoading(false); });
    timer.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const pick = (opt: string) => { const qid = questions[idx].id; if (answers[qid]) return; setAnswers(p => ({ ...p, [qid]: { selectedOption: opt, isCorrect: opt === questions[idx].correctOption } })); };
  const score = () => Object.values(answers).filter(a => a.isCorrect).length;

  const submit = async () => {
    if (submitting) return; setSubmitting(true);
    if (timer.current) clearInterval(timer.current);
    const t = Math.floor((Date.now() - startTime) / 1000); const s = score();
    try { await fetch("/api/attempts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentName, department, setId, score: s, totalQuestions: questions.length, timeTakenSeconds: t }) }); } catch {}
    onComplete(s, questions.length, t);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" /></div>;
  if (!questions.length) return <div className="min-h-screen flex items-center justify-center text-center text-gray-400"><p className="text-4xl mb-3">📭</p><p>No questions found.</p><button onClick={onBack} className="mt-3 text-indigo-600 hover:underline">← Back</button></div>;

  const q = questions[idx]; const ans = answers[q.id]; const done = !!ans;
  const opts = [{ k: "A", t: q.optionA }, { k: "B", t: q.optionB }, { k: "C", t: q.optionC }, { k: "D", t: q.optionD }];
  const answered = Object.keys(answers).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white border border-gray-100 rounded-xl p-3.5 mb-3 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <h2 className="font-bold text-gray-800 text-sm truncate">{setName}</h2>
              <p className="text-xs text-gray-400">{studentName}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center"><p className="text-[10px] text-gray-400 uppercase">Done</p><p className="text-sm font-bold text-indigo-600">{answered}/{questions.length}</p></div>
              <div className="text-center"><p className="text-[10px] text-gray-400 uppercase">Time</p><p className="text-sm font-bold text-gray-700 font-mono">{fmt(elapsed)}</p></div>
              <button onClick={() => setShowConfirm(true)} className="bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition active:scale-95">Submit</button>
            </div>
          </div>
          <div className="mt-2.5 bg-gray-100 rounded-full h-1.5"><div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(answered / questions.length) * 100}%` }} /></div>
        </div>

        {/* Navigator */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 mb-3 shadow-sm animate-fade-in delay-100">
          <div className="flex flex-wrap gap-1.5">
            {questions.map((qi, i) => {
              const a = answers[qi.id];
              let cls = "w-8 h-8 rounded-lg text-xs font-semibold transition-all active:scale-90 ";
              if (i === idx) cls += "bg-indigo-600 text-white shadow-md shadow-indigo-200";
              else if (a?.isCorrect) cls += "bg-green-100 text-green-700";
              else if (a && !a.isCorrect) cls += "bg-red-100 text-red-700";
              else cls += "bg-gray-100 text-gray-500 hover:bg-gray-200";
              return <button key={qi.id} onClick={() => setIdx(i)} className={cls}>{i + 1}</button>;
            })}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-3 shadow-sm animate-scale-in">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-5 leading-relaxed">
            <span className="text-indigo-600 font-bold mr-1.5">Q{idx + 1}.</span>
            <Latex>{q.questionText}</Latex>
          </h3>
          <div className="space-y-2.5">
            {opts.map(o => {
              let cls = "w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 ";
              if (!done) cls += "border-gray-100 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 cursor-pointer active:scale-[0.99]";
              else if (o.k === q.correctOption) cls += "border-green-400 bg-green-50 text-green-800";
              else if (o.k === ans?.selectedOption) cls += "border-red-400 bg-red-50 text-red-800";
              else cls += "border-gray-100 text-gray-400";
              return (
                <button key={o.k} onClick={() => pick(o.k)} disabled={done} className={cls}>
                  <span className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${!done ? "bg-gray-100 text-gray-600" : o.k === q.correctOption ? "bg-green-500 text-white" : o.k === ans?.selectedOption ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400"}`}>{o.k}</span>
                    <span className="text-sm"><Latex>{o.t}</Latex></span>
                    {done && o.k === q.correctOption && <span className="ml-auto text-green-600 font-bold">✓</span>}
                    {done && o.k === ans?.selectedOption && o.k !== q.correctOption && <span className="ml-auto text-red-600 font-bold">✗</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {done && (
          <div className={`rounded-xl p-4 mb-3 animate-slide-up ${ans.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <div className="flex items-start gap-2.5">
              <span className="text-xl flex-shrink-0">{ans.isCorrect ? "🎉" : "❌"}</span>
              <div className="text-sm">
                <p className={`font-bold ${ans.isCorrect ? "text-green-700" : "text-red-700"}`}>{ans.isCorrect ? "Correct!" : "Incorrect!"}</p>
                {!ans.isCorrect && <p className="text-red-600 mt-1">Correct answer: <span className="font-bold">{q.correctOption}. <Latex>{opts.find(o => o.k === q.correctOption)?.t || ""}</Latex></span></p>}
                {q.explanation && <p className="text-gray-600 mt-1.5 leading-relaxed">💡 <Latex>{q.explanation}</Latex></p>}
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div className="flex gap-2.5 animate-fade-in delay-200">
          <button onClick={() => idx > 0 && setIdx(idx - 1)} disabled={idx === 0}
            className="flex-1 bg-white border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] text-sm">← Prev</button>
          {idx === questions.length - 1 ? (
            <button onClick={() => setShowConfirm(true)} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-500 transition active:scale-[0.98] text-sm">Submit 🏁</button>
          ) : (
            <button onClick={() => setIdx(idx + 1)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-500 transition active:scale-[0.98] text-sm">Next →</button>
          )}
        </div>

        {/* Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-sm shadow-xl animate-scale-in text-center">
              <p className="text-3xl mb-2">📝</p>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Submit Quiz?</h3>
              <p className="text-gray-500 text-sm mb-3">Answered <span className="text-indigo-600 font-bold">{answered}</span> of <span className="font-bold">{questions.length}</span></p>
              {answered < questions.length && <p className="text-orange-600 text-xs mb-3 bg-orange-50 p-2 rounded-lg">⚠️ {questions.length - answered} unanswered will be marked wrong</p>}
              <div className="flex gap-2.5">
                <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition text-sm">Continue</button>
                <button onClick={submit} disabled={submitting} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-500 transition disabled:opacity-50 text-sm">{submitting ? "…" : "Submit"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
