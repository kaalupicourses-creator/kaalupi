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
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#2D5016]">Tandai Selesai</h4>
        <span className="text-xs font-semibold text-[#F5A62A]">{percentage}% tercapai</span>
      </div>
      <p className="mb-3 text-xs text-[#444444]">
        {completedModules.length} dari {totalModules} modul selesai
      </p>

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
                  ? "border-[#7AB648]/30 bg-[#E8F5E9] text-[#2D5016]"
                  : "border-[#F0E8D8] bg-[#FEFBF5] text-[#444444] hover:border-[#F5A62A] hover:bg-white"
              }`}
            >
              {isCompleted ? (
                <svg className="h-5 w-5 flex-shrink-0 text-[#7AB648]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-[#F0E8D8]" />
              )}
              <span className="flex-1 font-medium">Modul {i + 1}</span>
              {isLoading && (
                <svg className="h-4 w-4 animate-spin text-[#F5A62A]" viewBox="0 0 24 24" fill="none">
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
