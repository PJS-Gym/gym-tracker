"use client";

import { useEffect, useRef, useState } from "react";

const CLIPS_PER_SCREEN = 4;
// How long before a clip ends the next one starts fading in over it.
const CROSSFADE_S = 0.8;

// Stronger and taller than --scrim-bottom: these screens carry more than a title, and text must
// stay on at least .60 of black.
const SCRIM = "linear-gradient(to top,rgba(0,0,0,.95) 0%,rgba(0,0,0,.75) 55%,rgba(0,0,0,0) 85%)";

// For a band of video that only carries large type.
const EVEN_SCRIM = "rgba(0,0,0,.5)";

function prefersStill() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData === true;
}

const wrap = (index: number) => (index + CLIPS_PER_SCREEN) % CLIPS_PER_SCREEN;

/**
 * Silent clips behind a whole screen, each fading into the next. Only the previous, current and
 * next clip exist at a time, so a visitor loads them one by one. Reduced motion or data saver
 * shows the first frame instead.
 */
export function MediaBackdrop({ clip, scrim = "text" }: { clip: "welcome" | "tutorial"; scrim?: "text" | "even" }) {
  const [still] = useState(prefersStill);
  const [current, setCurrent] = useState(0);
  const [hasPlayedOne, setHasPlayedOne] = useState(false);
  const videos = useRef(new Map<number, HTMLVideoElement>());

  useEffect(() => {
    if (!still) videos.current.get(current)?.play().catch(() => {});
  }, [current, still]);

  const next = wrap(current + 1);
  const previous = hasPlayedOne ? wrap(current - 1) : null;

  function advanceIfReady() {
    if ((videos.current.get(next)?.readyState ?? 0) < HTMLMediaElement.HAVE_FUTURE_DATA) return false;
    setHasPlayedOne(true);
    setCurrent(next);
    return true;
  }

  function handleEnded(video: HTMLVideoElement) {
    // A slow connection has not got the next clip yet: keep this one going.
    if (!advanceIfReady()) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  const mounted = still ? [0] : [previous, current, next].filter((index) => index !== null);

  return (
    <div aria-hidden="true" style={{ background: "var(--media-placeholder)" }} className="absolute inset-0 -z-10 overflow-hidden">
      {mounted.map((index) => (
        <video
          key={index}
          ref={(element) => {
            if (element) videos.current.set(index, element);
            else videos.current.delete(index);
          }}
          src={`/videos/${clip}-${index + 1}.mp4`}
          poster={index === 0 ? `/videos/${clip}-1.jpg` : undefined}
          muted
          playsInline
          preload={still ? "none" : "auto"}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            if (index === current && video.duration - video.currentTime < CROSSFADE_S) advanceIfReady();
          }}
          onEnded={(event) => {
            if (index === current) handleEnded(event.currentTarget);
          }}
          style={{
            // The incoming clip fades in on top; the outgoing one stays solid beneath it.
            opacity: index === next && !still ? 0 : 1,
            zIndex: index === current ? 1 : 0,
            transition: index === current ? `opacity ${CROSSFADE_S}s var(--ease-standard)` : undefined,
          }}
          className="absolute inset-0 size-full object-cover"
        />
      ))}
      <div style={{ background: scrim === "text" ? SCRIM : EVEN_SCRIM, zIndex: 2 }} className="absolute inset-0" />
    </div>
  );
}
