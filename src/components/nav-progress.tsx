"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Loading bar tipis di atas layar. Muncul begitu user klik link internal,
 * naik pelan sampai ~90%, lalu selesai (100%) pas halaman baru kebuka.
 * Tanpa library — cuma intercept klik <a> + deteksi ganti pathname.
 */
export function NavProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const first = useRef(true);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function start() {
    clearTimers();
    setVisible(true);
    let w = 8;
    setWidth(w);
    const tick = () => {
      w = w + (90 - w) * 0.12;
      setWidth(w);
      if (w < 89) timers.current.push(setTimeout(tick, 220));
    };
    timers.current.push(setTimeout(tick, 120));
    // safety: kalau ga selesai-selesai (misal ganti query aja), tetep kelar
    timers.current.push(setTimeout(finish, 8000));
  }

  function finish() {
    clearTimers();
    setWidth(100);
    timers.current.push(setTimeout(() => setVisible(false), 250));
    timers.current.push(setTimeout(() => setWidth(0), 550));
  }

  // Mulai pas klik link internal
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // link ke halaman yang sama persis — ga usah loading
      if (url.pathname + url.search === window.location.pathname + window.location.search) return;
      start();
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Selesai pas pathname berubah (halaman baru udah render)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => () => clearTimers(), []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 9999, pointerEvents: "none" }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: "linear-gradient(90deg, #F5A62A, #7AB648)",
          boxShadow: "0 0 8px rgba(245,166,42,0.6)",
          transition: "width 0.2s ease-out",
        }}
      />
    </div>
  );
}
