"use client";

import { useEffect, useRef } from "react";

interface ProtectedVideoProps {
  src: string;
  className?: string;
}

export function ProtectedVideo({ src, className }: ProtectedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Prevent Picture-in-Picture
    video.disablePictureInPicture = true;

    // Prevent download via context menu
    video.controlsList?.add("nodownload");
    video.controlsList?.add("noremoteplayback");
    video.controlsList?.add("noplaybackrate");

    // Prevent right-click on video
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };
    video.addEventListener("contextmenu", handleContextMenu);

    // Detect and block AirPlay / Remote Playback
    if ("remote" in video) {
      const remote = (video as any).remote;
      remote?.watchAvailability((available: boolean) => {
        if (available) {
          video.pause();
        }
      }).catch(() => {});
    }

    // Block casting / Presentation API
    if ("presentation" in navigator) {
      // Prevent presentation display
      try {
        (navigator as any).presentation.defaultRequest = null;
      } catch {}
    }

    return () => {
      video.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        src={src}
        controls
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        onContextMenu={(e) => e.preventDefault()}
        className={className}
        style={{
          // Attempt to prevent screen capture of video element
          WebkitTransform: "translateZ(0)",
        }}
      />
      {/* Invisible overlay to prevent drag-saving */}
      <div
        className="absolute inset-0 pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
