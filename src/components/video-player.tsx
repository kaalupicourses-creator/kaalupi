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
    <div className="w-full rounded-2xl border border-[#F0E8D8] bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F0E8D8] px-4 py-3">
        <h3 className="text-sm font-bold text-[#2D5016]">{title}</h3>
        <span className="text-xs font-semibold text-[#F5A62A]">{progress}% selesai</span>
      </div>

      <div className="relative aspect-video bg-[#1A2E0A]">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full"
          controls
          onTimeUpdate={handleTimeUpdate}
        />
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2D5016]">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <p className="text-sm text-white/70">Video akan segera tersedia</p>
            </div>
          </div>
        )}
      </div>

      {src && (
        <div className="flex items-center gap-2 border-t border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3">
          <button
            onClick={() => skip(-10)}
            className="rounded-lg border border-[#F0E8D8] bg-white px-3 py-1.5 text-xs font-semibold text-[#2D5016] transition hover:border-[#F5A62A] hover:bg-[#FFF3D6]"
          >
            -10s
          </button>
          <button
            onClick={() => skip(10)}
            className="rounded-lg border border-[#F0E8D8] bg-white px-3 py-1.5 text-xs font-semibold text-[#2D5016] transition hover:border-[#F5A62A] hover:bg-[#FFF3D6]"
          >
            +10s
          </button>
          <div className="flex-1">
            <div className="h-2 w-full rounded-full bg-[#F0E8D8]">
              <div
                className="h-2 rounded-full bg-[#F5A62A] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
