"use client";

import { useState, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number) => void;
}

export function VideoPlayer({ src, title, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const pct = Math.round((current / duration) * 100);
      setProgress(pct);
      onProgress?.(pct);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-950/50 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <span className="text-xs text-slate-400">{progress}% selesai</span>
      </div>

      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full"
          controls
          onTimeUpdate={handleTimeUpdate}
        />
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <p className="text-sm text-slate-400">Video akan segera tersedia</p>
            </div>
          </div>
        )}
      </div>

      {src && (
        <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
          <button
            onClick={() => skip(-10)}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
          >
            -10s
          </button>
          <button
            onClick={() => skip(10)}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
          >
            +10s
          </button>
          <div className="flex-1">
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
