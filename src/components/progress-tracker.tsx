"use client";

import { useState } from "react";

interface ProgressTrackerProps {
  userEmail: string;
  courseSlug: string;
  totalModules: number;
  completedModules: number[];
  onModuleComplete: (moduleIndex: number) => void;
}

export function ProgressTracker({
  totalModules,
  completedModules,
  onModuleComplete,
}: Omit<ProgressTrackerProps, "userEmail" | "courseSlug">) {
  const [completing, setCompleting] = useState<number | null>(null);

  const percentage = Math.round((completedModules.length / totalModules) * 100);

  async function handleToggle(moduleIndex: number) {
    setCompleting(moduleIndex);
    try {
      await onModuleComplete(moduleIndex);
    } finally {
      setCompleting(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Progress Belajar</h3>
          <span className="text-sm font-medium text-amber-300">{percentage}%</span>
        </div>
        <div className="mt-3 h-2.5 w-full rounded-full bg-white/10">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {completedModules.length} dari {totalModules} modul selesai
        </p>
      </div>

      <div className="space-y-2">
        {Array.from({ length: totalModules }, (_, i) => {
          const isCompleted = completedModules.includes(i);
          const isLoading = completing === i;

          return (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              disabled={isLoading}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition disabled:opacity-50 ${
                isCompleted
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              {isCompleted ? (
                <svg className="h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-slate-500" />
              )}
              <span className="flex-1">Modul {i + 1}</span>
              {isLoading && (
                <svg className="h-4 w-4 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
