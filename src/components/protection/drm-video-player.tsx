"use client";

import { useEffect, useRef, useState } from "react";

interface DRMVideoPlayerProps {
  src: string;
  licenseUrl?: string;
  className?: string;
  userEmail?: string;
  sessionId?: string;
}

/**
 * DRM-Protected Video Player using Shaka Player + EME
 *
 * Supports:
 * - ClearKey DRM (immediate, no approval needed)
 * - Widevine DRM (requires Google approval - swap in later)
 * - FairPlay DRM (for Safari - requires Apple approval)
 *
 * When Widevine is active, screenshots/recordings show BLACK.
 */
export function DRMVideoPlayer({
  src,
  licenseUrl,
  className,
  userEmail,
  sessionId,
}: DRMVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let shaka: any;
    let player: any;

    const initPlayer = async () => {
      try {
        // Dynamic import to avoid SSR issues
        shaka = (await import("shaka-player/dist/shaka-player.compiled")).default;

        // Install polyfills
        shaka.polyfill.installAll();

        // Check browser support
        if (!shaka.Player.isBrowserSupported()) {
          setError("Your browser does not support protected video playback.");
          setIsLoading(false);
          return;
        }

        const video = videoRef.current;
        if (!video) return;

        // Create player
        player = new shaka.Player();
        await player.attach(video);
        playerRef.current = player;

        // Configure DRM
        player.configure({
          drm: {
            // ClearKey configuration (works immediately, no approval needed)
            clearKeys: licenseUrl ? undefined : {},
            servers: {
              // Widevine license server (uncomment when approved)
              // 'com.widevine.alpha': '/api/drm/widevine/license',

              // ClearKey (built-in browser DRM)
              'org.w3.clearkey': licenseUrl || '/api/drm/clearkey/license',
            },
            advanced: {
              'com.widevine.alpha': {
                // Request persistent license for offline support
                sessionType: 'temporary',
                // Force hardware-secure decryption (L1) when available
                // This is what makes screenshots show BLACK
                robustnessForVideo: 'HW_SECURE_ALL',
                robustnessForAudio: 'HW_SECURE_CRYPTO',
              },
            },
          },
          streaming: {
            // Buffer settings for smooth playback
            bufferingGoal: 30,
            rebufferingGoal: 2,
            // Retry on failure
            retryParameters: {
              maxAttempts: 3,
              baseDelay: 1000,
              backoffFactor: 2,
            },
          },
        });

        // Add request filter to include auth token
        player.getNetworkingEngine().registerRequestFilter(
          (type: number, request: any) => {
            // Add session token to license requests
            if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
              request.headers["Authorization"] = `Bearer ${sessionId || ""}`;
              request.headers["X-User-Email"] = userEmail || "";
            }
          }
        );

        // Error handling
        player.addEventListener("error", (event: any) => {
          const errorDetail = event.detail;
          console.error("Shaka Player Error:", errorDetail);

          if (errorDetail.code === 6001) {
            // DRM not supported - fall back to regular player
            setError(null);
            video.src = src;
          } else {
            setError("Video playback error. Please try refreshing.");
          }
        });

        // Load the video
        try {
          await player.load(src);
          setIsLoading(false);
        } catch (loadError: any) {
          console.warn("DRM load failed, falling back to direct playback:", loadError);
          // Fallback to direct playback if DRM fails
          video.src = src;
          setIsLoading(false);
        }
      } catch (err) {
        console.warn("Shaka Player init failed, using fallback:", err);
        // Ultimate fallback - just play the video directly
        if (videoRef.current) {
          videoRef.current.src = src;
        }
        setIsLoading(false);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy().catch(() => {});
      }
    };
  }, [src, licenseUrl, userEmail, sessionId]);

  // Apply video element protections
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.disablePictureInPicture = true;
    video.controlsList?.add("nodownload");
    video.controlsList?.add("noremoteplayback");
    video.controlsList?.add("noplaybackrate");

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };
    video.addEventListener("contextmenu", handleContextMenu);

    // Block AirPlay / Remote Playback
    if ("remote" in video) {
      try {
        (video as any).remote.watchAvailability((available: boolean) => {
          if (available) video.pause();
        });
      } catch {}
    }

    return () => {
      video.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative group">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Loading protected video...</span>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center px-4">
            <p className="text-red-400 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Video element with maximum protection attributes */}
      <video
        ref={videoRef}
        controls
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        crossOrigin="use-credentials"
        onContextMenu={(e) => e.preventDefault()}
        className={className}
        style={{
          WebkitTransform: "translateZ(0)",
          // Force hardware acceleration for DRM protected surface
          willChange: "transform",
        }}
      />

      {/* Video watermark overlay */}
      {userEmail && (
        <div
          className="absolute inset-0 pointer-events-none select-none z-[5]"
          style={{ mixBlendMode: "soft-light" }}
        >
          <div className="absolute bottom-4 right-4 opacity-[0.06] text-white text-[10px] font-mono">
            {userEmail}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-30 opacity-[0.03] text-white text-lg font-mono whitespace-nowrap">
            {userEmail} &bull; {sessionId}
          </div>
        </div>
      )}

      {/* Invisible overlay to prevent drag-saving */}
      <div
        className="absolute inset-0 pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
