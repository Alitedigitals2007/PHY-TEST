"use client";

import Footer from "@/components/Footer";

interface Props { studentName: string; setName: string; score: number; total: number; timeTakenSeconds: number; onRetake: () => void; onNewStudent: () => void; }

export default function ResultsPage({ studentName, setName, score, total, timeTakenSeconds, onRetake, onNewStudent }: Props) {
  const pct = Math.round((score / total) * 100);
  const time = `${Math.floor(timeTakenSeconds / 60)}m ${timeTakenSeconds % 60}s`;
  const [emoji, msg, color, bg] = pct >= 90 ? ["🏆", "Outstanding!", "text-green-600", "bg-green-50 border-green-200"] : pct >= 70 ? ["🎉", "Great job!", "text-green-600", "bg-green-50 border-green-200"] : pct >= 50 ? ["👍", "Good effort!", "text-yellow-600", "bg-yellow-50 border-yellow-200"] : pct >= 30 ? ["📚", "Keep going!", "text-orange-600", "bg-orange-50 border-orange-200"] : ["💪", "Don't give up!", "text-red-600", "bg-red-50 border-red-200"];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm text-center animate-scale-in">
          <div className="text-5xl mb-3 animate-float">{emoji}</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Quiz Complete!</h1>
          <p className="text-gray-400 text-sm mb-5">{msg}</p>

          <div className={`rounded-xl p-5 mb-5 border animate-slide-up ${bg}`}>
            <p className={`text-5xl font-extrabold ${color}`}>{pct}%</p>
            <p className="text-gray-600 mt-1">{score} of {total} correct</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-5 text-sm">
            <div className="bg-white border border-gray-100 rounded-xl p-3 animate-slide-up delay-100">
              <p className="text-[10px] text-gray-400 uppercase">Student</p>
              <p className="font-semibold text-gray-800 mt-0.5 truncate">{studentName}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 animate-slide-up delay-100">
              <p className="text-[10px] text-gray-400 uppercase">Time</p>
              <p className="font-semibold text-gray-800 mt-0.5 font-mono">{time}</p>
            </div>
            <div className="col-span-2 bg-white border border-gray-100 rounded-xl p-3 animate-slide-up delay-200">
              <p className="text-[10px] text-gray-400 uppercase">Quiz Set</p>
              <p className="font-semibold text-gray-800 mt-0.5">{setName}</p>
            </div>
          </div>

          <div className="space-y-2.5 animate-slide-up delay-300">
            <button onClick={onRetake} className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-500 transition active:scale-[0.98]">Take Another Quiz</button>
            <button onClick={onNewStudent} className="w-full bg-white border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition active:scale-[0.98]">New Student</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
