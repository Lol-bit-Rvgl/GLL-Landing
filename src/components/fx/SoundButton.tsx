"use client";

import { useCallback, useState } from "react";

interface SoundButtonProps {
  soundSrc?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SoundButton({
  soundSrc = "/sounds/click.mp3",
  children,
  className,
  onClick,
}: SoundButtonProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    try {
      if (!audio) {
        const a = new Audio(soundSrc);
        a.volume = 0.3;
        a.playbackRate = 1.1;
        setAudio(a);
        a.play().catch(() => {});
        return;
      }
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {
      // .mp3 not found yet — silent fail
    }
  }, [audio, soundSrc]);

  return (
    <button
      onMouseEnter={play}
      onClick={() => {
        play();
        onClick?.();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
