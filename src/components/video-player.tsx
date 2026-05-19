"use client";

import { useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number) => void;
}

/**
 * Convert various YouTube URL formats to a clean embed URL.
 * Supports:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 * Returns null if URL is not a YouTube link.
 */
function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let id: string | null = null;

    if (host === "youtu.be") {
      id = u.pathname.slice(1).split("/")[0];
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") {
        id = u.searchParams.get("v");
      } else if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/")[2];
      } else if (u.pathname.startsWith("/shorts/")) {
        id = u.pathname.split("/")[2];
      } else if (u.pathname.startsWith("/v/")) {
        id = u.pathname.split("/")[2];
      }
    }

    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0`;
  } catch {
    return null;
  }
}

function toVimeoEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("vimeo.com")) return null;
    const id = u.pathname.split("/").filter(Boolean).pop();
    if (!id) return null;
    return `https://player.vimeo.com/video/${id}`;
  } catch {
    return null;
  }
}

export function VideoPlayer({ src, title, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  const youtubeEmbed = src ? toYouTubeEmbed(src) : null;
  const vimeoEmbed = src ? toVimeoEmbed(src) : null;
  const embedUrl = youtubeEmbed ?? vimeoEmbed;

  const handleTimeUpdate = () => {
    if (videoRef.current && embedUrl == null) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (!duration || !Number.isFinite(duration)) return;
      const pct = Math.round((current / duration) * 100);
      setProgress(pct);
      onProgress?.(pct);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current && embedUrl == null) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[#F0E8D8] bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F0E8D8] px-4 py-3">
        <h3 className="text-sm font-bold text-[#2D5016]">{title}</h3>
        {embedUrl == null && src && (
          <span className="text-xs font-semibold text-[#F5A62A]">{progress}% selesai</span>
        )}
        {embedUrl != null && (
          <span className="text-xs font-semibold text-[#F5A62A]">
            {youtubeEmbed ? "YouTube" : "Vimeo"}
          </span>
        )}
      </div>

      <div className="relative aspect-video bg-[#1A2E0A]">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : src ? (
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full"
            controls
            onTimeUpdate={handleTimeUpdate}
          />
        ) : (
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

      {/* Native-video skip controls only useful for MP4/WebM */}
      {!embedUrl && src && (
        <div className="flex items-center gap-2 border-t border-[#F0E8D8] bg-[#FEFBF5] px-4 py-3">
          <button
            type="button"
            onClick={() => skip(-10)}
            className="rounded-lg border border-[#F0E8D8] bg-white px-3 py-1.5 text-xs font-semibold text-[#2D5016] transition hover:border-[#F5A62A] hover:bg-[#FFF3D6]"
          >
            -10s
          </button>
          <button
            type="button"
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
