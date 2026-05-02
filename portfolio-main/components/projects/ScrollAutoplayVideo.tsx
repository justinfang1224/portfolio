"use client";

import { useEffect, useRef } from "react";

type ScrollAutoplayVideoProps = {
  className?: string;
  label: string;
  src: string;
};

export function ScrollAutoplayVideo({ className, label, src }: ScrollAutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play();
          return;
        }

        video.pause();
      },
      { threshold: 0.45 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <video
      aria-label={label}
      className={className}
      loop
      muted
      playsInline
      preload="metadata"
      ref={videoRef}
      src={src}
    />
  );
}
