"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ShieldAlert } from "lucide-react";

interface ScreenCaptureGuardProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
}

export function ScreenCaptureGuard({
  children,
  userEmail,
  userName,
}: ScreenCaptureGuardProps) {
  const [blocked, setBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [warningFlash, setWarningFlash] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sessionId, setSessionId] = useState("init");

  // Generate sessionId only on client to avoid hydration mismatch
  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(2, 10));
  }, []);

  const blockContent = useCallback((reason: string) => {
    setBlocked(true);
    setBlockReason(reason);
    // Log to server for audit trail
    try {
      fetch("/api/protection-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: reason,
          timestamp: new Date().toISOString(),
          sessionId,
        }),
      }).catch(() => {});
    } catch {}
  }, [sessionId]);

  const unblockContent = useCallback(() => {
    setBlocked(false);
    setBlockReason("");
  }, []);

  // Flash a warning overlay briefly
  const flashWarning = useCallback(() => {
    setWarningFlash(true);
    setTimeout(() => setWarningFlash(false), 1500);
  }, []);

  useEffect(() => {
    // ============================================
    // 1. DETECT SCREEN CAPTURE / RECORDING APIs
    // ============================================
    const detectScreenCapture = async () => {
      try {
        if (navigator.mediaDevices) {
          const originalGetDisplayMedia =
            navigator.mediaDevices.getDisplayMedia;
          if (originalGetDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia = async function (
              constraints
            ) {
              blockContent("Screen sharing detected");
              throw new DOMException(
                "Screen capture is disabled for this content",
                "NotAllowedError"
              );
            };
          }

          // Also override getUserMedia to catch virtual camera / audio capture
          const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
          navigator.mediaDevices.getUserMedia = async function (constraints) {
            // Allow normal camera/mic but block screen capture disguised as getUserMedia
            if (
              constraints &&
              typeof constraints === "object" &&
              "video" in constraints
            ) {
              const videoConstraint = (constraints as any).video;
              if (
                videoConstraint &&
                typeof videoConstraint === "object" &&
                (videoConstraint.mediaSource === "screen" ||
                  videoConstraint.mediaSource === "window" ||
                  videoConstraint.mediaSource === "monitor")
              ) {
                blockContent("Screen capture attempt detected");
                throw new DOMException(
                  "Screen capture is disabled",
                  "NotAllowedError"
                );
              }
            }
            return originalGetUserMedia.call(
              navigator.mediaDevices,
              constraints
            );
          };
        }
      } catch {
        // Silently handle
      }
    };

    detectScreenCapture();

    // ============================================
    // 2. DETECT MULTIPLE MONITORS / AIRPLAY / CASTING
    // ============================================
    const checkMultipleScreens = () => {
      if ("screen" in window) {
        const screenWidth = window.screen.width;
        const windowX = window.screenX || window.screenLeft;

        if (windowX > screenWidth || windowX < -100) {
          blockContent(
            "External display detected. Please use your primary screen to view this content."
          );
          return;
        }
      }

      // Experimental Screen Details API
      if ("getScreenDetails" in window) {
        (window as any)
          .getScreenDetails()
          .then((screenDetails: any) => {
            if (screenDetails.screens && screenDetails.screens.length > 1) {
              blockContent(
                "Multiple displays detected. Please disconnect external displays to view this content."
              );
            }

            screenDetails.addEventListener("screenschange", () => {
              if (screenDetails.screens.length > 1) {
                blockContent(
                  "External display connected. Please disconnect to continue."
                );
              } else {
                unblockContent();
              }
            });
          })
          .catch(() => {});
      }
    };

    checkMultipleScreens();

    // Re-check when window moves
    const moveInterval = setInterval(() => {
      const windowX = window.screenX || window.screenLeft;
      const screenWidth = window.screen.width;
      if (windowX > screenWidth || windowX < -100) {
        blockContent(
          "Content moved to external display. Please move it back."
        );
      }
    }, 2000);

    // ============================================
    // 3. VISIBILITY CHANGE (Tab switch, AirPlay, minimize)
    // ============================================
    const handleVisibilityChange = () => {
      const protectedEl = document.getElementById("protected-content");
      if (protectedEl) {
        if (document.hidden) {
          protectedEl.style.filter = "blur(40px) brightness(0.3)";
          protectedEl.style.transition = "filter 0.1s";
        } else {
          // Delay unblur slightly to catch screenshot-then-switch-back
          setTimeout(() => {
            if (!document.hidden) {
              protectedEl.style.filter = "none";
            }
          }, 500);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // ============================================
    // 4. WINDOW BLUR / FOCUS (catches screen recording overlays)
    // ============================================
    const handleWindowBlur = () => {
      const protectedEl = document.getElementById("protected-content");
      if (protectedEl) {
        protectedEl.style.filter = "blur(30px) brightness(0.3)";
        protectedEl.style.transition = "filter 0.1s";
      }
    };

    const handleWindowFocus = () => {
      const protectedEl = document.getElementById("protected-content");
      if (protectedEl) {
        setTimeout(() => {
          protectedEl.style.filter = "none";
        }, 300);
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    // ============================================
    // 5. PICTURE-IN-PICTURE DETECTION
    // ============================================
    const handlePiP = () => {
      blockContent("Picture-in-Picture is not allowed for this content.");
    };
    document.addEventListener("enterpictureinpicture", handlePiP);

    // Also disable PiP on all videos dynamically
    const disablePiPOnVideos = () => {
      document.querySelectorAll("video").forEach((video) => {
        video.disablePictureInPicture = true;
        video.setAttribute("disablepictureinpicture", "");
        video.setAttribute("disableremoteplayback", "");
        if (video.controlsList) {
          video.controlsList.add("nodownload");
          video.controlsList.add("noremoteplayback");
          video.controlsList.add("noplaybackrate");
        }
      });
    };

    disablePiPOnVideos();
    const pipObserver = new MutationObserver(disablePiPOnVideos);
    pipObserver.observe(document.body, { childList: true, subtree: true });

    // ============================================
    // 6. KEYBOARD SHORTCUT BLOCKING (comprehensive)
    // ============================================
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        e.stopImmediatePropagation();
        navigator.clipboard.writeText("").catch(() => {});
        // Also write empty image to clipboard
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          canvas.toBlob((blob) => {
            if (blob) {
              navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]).catch(() => {});
            }
          });
        } catch {}
        flashWarning();
        return;
      }

      // Block macOS screenshot shortcuts: Cmd+Shift+3/4/5/6
      if (
        e.metaKey &&
        e.shiftKey &&
        ["3", "4", "5", "6"].includes(e.key)
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        flashWarning();
        return;
      }

      // Block Snipping Tool: Win+Shift+S
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        e.stopImmediatePropagation();
        flashWarning();
        return;
      }

      // Block Cmd+Shift+S / Ctrl+Shift+S (save as / screenshot tools)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Block all dev tools shortcuts
      // Ctrl+Shift+I / Cmd+Option+I
      if (
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === "i")
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Ctrl+Shift+J / Cmd+Option+J (Console)
      if (
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === "j")
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Ctrl+Shift+C / Cmd+Option+C (Element inspector)
      if (
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === "c")
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // F12
      if (e.key === "F12") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Ctrl+U / Cmd+U (View source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Ctrl+S / Cmd+S (Save page)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && !e.shiftKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Ctrl+P / Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Ctrl+A / Cmd+A (Select all — prevent bulk copy)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Ctrl+C / Cmd+C (Copy — block on non-code areas)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        const selection = window.getSelection();
        const selectedNode = selection?.anchorNode?.parentElement;
        // Allow copy inside code blocks only
        if (
          selectedNode &&
          !selectedNode.closest("pre") &&
          !selectedNode.closest("code")
        ) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
      }

      // Block Ctrl+Shift+E (Network tab in some browsers)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "E") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Block Ctrl+Shift+M (Responsive design mode)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "M") {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });

    // ============================================
    // 7. CLIPBOARD HIJACKING — clear clipboard periodically
    // ============================================
    const clipboardInterval = setInterval(() => {
      try {
        // Only clear if document is focused to avoid annoying other apps
        if (document.hasFocus()) {
          // Check if there's a selection from a non-code area
          const selection = window.getSelection();
          if (selection && selection.toString().length > 50) {
            const selectedNode = selection.anchorNode?.parentElement;
            if (
              selectedNode &&
              !selectedNode.closest("pre") &&
              !selectedNode.closest("code")
            ) {
              selection.removeAllRanges();
            }
          }
        }
      } catch {}
    }, 3000);

    // ============================================
    // 8. CONTEXT MENU (Right-click) BLOCKING
    // ============================================
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu, {
      capture: true,
    });

    // ============================================
    // 9. DRAG PREVENTION (prevent dragging images/videos off page)
    // ============================================
    const handleDragStart = (e: Event) => {
      e.preventDefault();
    };
    document.addEventListener("dragstart", handleDragStart);

    // ============================================
    // 10. DEV TOOLS DETECTION (multiple methods)
    // ============================================

    // Method A: Window size discrepancy
    const devToolsCheck = setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      const protectedEl = document.getElementById("protected-content");
      if (widthThreshold || heightThreshold) {
        if (protectedEl) {
          protectedEl.style.filter = "blur(30px) brightness(0.2)";
        }
      } else if (protectedEl && !document.hidden && document.hasFocus()) {
        // Only unblur if no other block conditions are active
        const currentFilter = protectedEl.style.filter;
        if (currentFilter.includes("blur") && !blocked) {
          protectedEl.style.filter = "none";
        }
      }
    }, 500);

    // Method B: debugger detection via timing
    const debuggerCheck = setInterval(() => {
      const start = performance.now();
      // This debugger statement will cause a pause if dev tools are open
      // We detect it by checking if execution took too long
      try {
        (function () {}).constructor("debugger")();
      } catch {}
      const duration = performance.now() - start;
      if (duration > 100) {
        const protectedEl = document.getElementById("protected-content");
        if (protectedEl) {
          protectedEl.style.filter = "blur(30px) brightness(0.2)";
        }
      }
    }, 2000);

    // Method C: console.log detection
    const consoleDetect = () => {
      const element = new Image();
      Object.defineProperty(element, "id", {
        get: function () {
          const protectedEl = document.getElementById("protected-content");
          if (protectedEl) {
            protectedEl.style.filter = "blur(30px) brightness(0.2)";
          }
        },
      });
      // When dev tools are open, accessing console.log with the element triggers the getter
      // eslint-disable-next-line no-console
      console.log("%c", element as any);
    };
    const consoleCheckInterval = setInterval(consoleDetect, 3000);

    // ============================================
    // 11. IFRAME PROTECTION — prevent embedding in other sites
    // ============================================
    if (window.top !== window.self) {
      // We're inside an iframe — block content
      blockContent(
        "This content cannot be viewed in an embedded frame."
      );
    }

    // ============================================
    // 12. EXTENSION / AUTOMATION DETECTION
    // ============================================
    const detectAutomation = () => {
      // Check for common automation indicators
      const isAutomated =
        (navigator as any).webdriver ||
        (window as any).__selenium_unwrapped ||
        (window as any).__webdriver_evaluate ||
        (window as any).__driver_evaluate ||
        (window as any).__webdriver_unwrapped ||
        (window as any).__fxdriver_unwrapped ||
        (window as any)._phantom ||
        (window as any).__nightmare ||
        (window as any).callPhantom ||
        (window as any).domAutomation ||
        (window as any).domAutomationController;

      if (isAutomated) {
        blockContent(
          "Automated browser detected. This content cannot be accessed via automation tools."
        );
      }

      // Check for headless browser
      if (
        /HeadlessChrome/.test(navigator.userAgent) ||
        navigator.userAgent.includes("PhantomJS")
      ) {
        blockContent("Automated browser detected.");
      }

      // Check for missing browser features (headless indicators)
      if (!("chrome" in window) && /Chrome/.test(navigator.userAgent)) {
        // Possible headless Chrome
      }

      // Check for Puppeteer/Playwright
      if (
        navigator.languages === undefined ||
        (navigator.languages && navigator.languages.length === 0)
      ) {
        blockContent("Automated browser detected.");
      }
    };

    detectAutomation();

    // ============================================
    // 13. SCREEN RECORDING FRAME RATE DETECTION
    // ============================================
    // Screen recording software often causes frame rate drops
    let lastFrameTime = performance.now();
    let consistentSlowFrames = 0;

    const frameCheck = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      lastFrameTime = now;

      // Normal is ~16ms (60fps). Recording often drops to 30fps+ (~33ms)
      // We look for sustained slow frames, not just occasional ones
      if (delta > 50) {
        consistentSlowFrames++;
      } else {
        consistentSlowFrames = Math.max(0, consistentSlowFrames - 1);
      }

      // If we detect sustained slow frames, increase watermark visibility
      if (consistentSlowFrames > 30) {
        const watermark = document.getElementById("dynamic-watermark");
        if (watermark) {
          watermark.style.opacity = "0.08"; // Make watermark more visible
        }
      }

      requestAnimationFrame(frameCheck);
    };
    const frameId = requestAnimationFrame(frameCheck);

    // ============================================
    // 14. COPY/PASTE EVENT BLOCKING
    // ============================================
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      const selectedNode = selection?.anchorNode?.parentElement;

      // Allow copying from code blocks
      if (
        selectedNode &&
        (selectedNode.closest("pre") || selectedNode.closest("code"))
      ) {
        return; // Allow
      }

      // Block all other copying
      e.preventDefault();
      e.clipboardData?.setData(
        "text/plain",
        "This content is protected by BlokSchool."
      );
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    document.addEventListener("copy", handleCopy, { capture: true });
    document.addEventListener("cut", handleCut, { capture: true });

    // ============================================
    // 15. MUTATION OBSERVER — prevent DOM manipulation
    // ============================================
    const domProtection = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // If someone tries to remove the watermark
        if (mutation.type === "childList") {
          const watermark = document.getElementById("dynamic-watermark");
          if (!watermark) {
            // Watermark was removed — re-add it or block
            blockContent(
              "Content protection was tampered with."
            );
          }
        }

        // If someone tries to change the filter/blur on protected content
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          const target = mutation.target as HTMLElement;
          if (target.id === "dynamic-watermark") {
            // Someone is trying to hide the watermark
            target.style.display = "block";
            target.style.opacity = "1";
            target.style.visibility = "visible";
          }
        }
      }
    });

    const watermarkEl = document.getElementById("dynamic-watermark");
    if (watermarkEl?.parentElement) {
      domProtection.observe(watermarkEl.parentElement, {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ["style", "class"],
      });
    }

    // ============================================
    // 16. PRESENTATION API BLOCKING (Chromecast, AirPlay)
    // ============================================
    if ("presentation" in navigator) {
      try {
        Object.defineProperty(navigator, "presentation", {
          get: () => null,
          configurable: false,
        });
      } catch {}
    }

    // ============================================
    // 17. DISABLE SAVE AS / DOWNLOAD via beforeunload trick
    // ============================================
    const handleBeforeprint = () => {
      const protectedEl = document.getElementById("protected-content");
      if (protectedEl) {
        protectedEl.style.display = "none";
      }
    };

    const handleAfterprint = () => {
      const protectedEl = document.getElementById("protected-content");
      if (protectedEl) {
        protectedEl.style.display = "";
      }
    };

    window.addEventListener("beforeprint", handleBeforeprint);
    window.addEventListener("afterprint", handleAfterprint);

    // ============================================
    // 18. CANVAS FINGERPRINT — unique to this user session
    // ============================================
    // Add invisible canvas with user-specific fingerprint
    const addFingerprint = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 400;
      canvas.height = 20;
      ctx.font = "10px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillText(
        `${userEmail} | ${sessionId} | ${new Date().toISOString()}`,
        0,
        15
      );
    };
    addFingerprint();
    const fingerprintInterval = setInterval(addFingerprint, 10000);

    // ============================================
    // CLEANUP
    // ============================================
    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      document.removeEventListener("enterpictureinpicture", handlePiP);
      document.removeEventListener("keydown", handleKeyDown, {
        capture: true,
      });
      document.removeEventListener("contextmenu", handleContextMenu, {
        capture: true,
      });
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("copy", handleCopy, { capture: true });
      document.removeEventListener("cut", handleCut, { capture: true });
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("beforeprint", handleBeforeprint);
      window.removeEventListener("afterprint", handleAfterprint);
      clearInterval(moveInterval);
      clearInterval(devToolsCheck);
      clearInterval(debuggerCheck);
      clearInterval(consoleCheckInterval);
      clearInterval(clipboardInterval);
      clearInterval(fingerprintInterval);
      cancelAnimationFrame(frameId);
      pipObserver.disconnect();
      domProtection.disconnect();
    };
  }, [blocked, blockReason, blockContent, unblockContent, flashWarning, userEmail, sessionId]);

  if (blocked) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
        <div className="text-center space-y-4 max-w-md px-6">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold text-white">Content Protected</h2>
          <p className="text-gray-400">{blockReason}</p>
          <p className="text-sm text-gray-500">
            This content is protected by BlokSchool. Screen recording,
            screenshots, and screen sharing are not permitted.
          </p>
          <button
            onClick={unblockContent}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            I understand, continue viewing
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Warning flash overlay */}
      {warningFlash && (
        <div className="fixed inset-0 z-[9998] bg-black flex items-center justify-center animate-pulse">
          <div className="text-center space-y-2">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-red-400 font-bold text-lg">
              Screenshots are not allowed
            </p>
          </div>
        </div>
      )}

      {/* Dynamic watermark overlay — multiple layers for resilience */}
      <div
        id="dynamic-watermark"
        className="pointer-events-none fixed inset-0 z-[100] overflow-hidden select-none"
        aria-hidden="true"
        style={{
          mixBlendMode: "soft-light",
        }}
      >
        {/* Layer 1: Diagonal text pattern */}
        <div className="absolute inset-0 -rotate-45 scale-150 opacity-[0.035]">
          <div className="flex flex-wrap gap-32">
            {Array.from({ length: 50 }).map((_, i) => (
              <span
                key={`d-${i}`}
                className="text-white text-xs whitespace-nowrap font-mono"
              >
                {userEmail || "BlokSchool"} &bull; {sessionId}
              </span>
            ))}
          </div>
        </div>

        {/* Layer 2: Horizontal pattern (offset) */}
        <div className="absolute inset-0 rotate-12 scale-125 opacity-[0.025]">
          <div className="flex flex-wrap gap-44 mt-20">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={`h-${i}`}
                className="text-white text-[10px] whitespace-nowrap font-mono"
              >
                {userName || "Student"} &bull;{" "}
                {new Date().toISOString().split("T")[0]} &bull; {sessionId}
              </span>
            ))}
          </div>
        </div>

        {/* Layer 3: Center large watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
          <div className="text-white text-4xl font-bold rotate-[-30deg] whitespace-nowrap font-mono">
            {userEmail || "BlokSchool"} &bull; {sessionId}
          </div>
        </div>
      </div>

      {/* Hidden canvas fingerprint */}
      <canvas
        ref={canvasRef}
        className="fixed bottom-0 left-0 pointer-events-none z-[99]"
        style={{ opacity: 0.01, width: "1px", height: "1px" }}
      />

      {/* Protected content wrapper */}
      <div
        id="protected-content"
        className="transition-[filter] duration-200"
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        {children}
      </div>

      {/* CSS protection layers */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* === PRINT BLOCKING === */
            @media print {
              html, body {
                display: none !important;
                visibility: hidden !important;
              }
              body * {
                display: none !important;
                visibility: hidden !important;
              }
              body::before {
                content: "" !important;
                display: block !important;
                visibility: visible !important;
                background: black !important;
                position: fixed !important;
                inset: 0 !important;
                z-index: 999999 !important;
              }
            }

            /* === TEXT SELECTION === */
            #protected-content {
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              -khtml-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }

            /* Allow text selection ONLY in code blocks */
            #protected-content pre,
            #protected-content code,
            #protected-content .code-selectable {
              -webkit-user-select: text;
              -moz-user-select: text;
              -ms-user-select: text;
              user-select: text;
            }

            /* === IMAGE PROTECTION === */
            #protected-content img {
              -webkit-user-drag: none;
              -khtml-user-drag: none;
              -moz-user-drag: none;
              user-drag: none;
              pointer-events: none;
            }

            /* === VIDEO PROTECTION === */
            #protected-content video {
              -webkit-content-visibility: auto;
            }

            #protected-content video::-webkit-media-controls-download-button {
              display: none !important;
            }

            #protected-content video::-webkit-media-controls-overflow-button {
              display: none !important;
            }

            #protected-content video::-webkit-media-controls-cast-button {
              display: none !important;
            }

            #protected-content video::-webkit-media-controls-remote-playback-button {
              display: none !important;
            }

            /* === PREVENT ELEMENT EXTRACTION === */
            #protected-content * {
              -webkit-user-drag: none;
            }

            /* === WATERMARK PROTECTION === */
            #dynamic-watermark {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              pointer-events: none !important;
              position: fixed !important;
              z-index: 100 !important;
            }

            /* === DISABLE CURSOR COPY HINT === */
            #protected-content ::selection {
              background: transparent;
              color: inherit;
            }

            #protected-content ::-moz-selection {
              background: transparent;
              color: inherit;
            }

            /* Allow selection styling in code blocks */
            #protected-content pre ::selection,
            #protected-content code ::selection {
              background: rgba(139, 92, 246, 0.3);
              color: inherit;
            }
          `,
        }}
      />
    </>
  );
}
