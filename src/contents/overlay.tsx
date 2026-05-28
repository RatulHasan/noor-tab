import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import React, { useState, useEffect, useRef } from "react";
import ReminderOverlay from "../components/shared/ReminderOverlay";
import type { PrayerName } from "../types";
import { Storage } from "@plasmohq/storage";
import { ADHAN_AUDIO_OPTIONS } from "../data/adhanAudios";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
};

/**
 * Custom CSS injector for Shadow DOM.
 * Converts rems to px for consistency and maps `:root` rules to `:host(plasmo-csui)`.
 */
export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16;
  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)");
  
  const remRegex = /([\d.]+)rem/g;
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize;
    return `${pixelsValue}px`;
  });

  const styleElement = document.createElement("style");
  styleElement.textContent = updatedCssText;
  return styleElement;
};

const OverlayCSUI = () => {
  const [visible, setVisible] = useState(false);
  const [prayer, setPrayer] = useState<PrayerName | null>(null);
  const [minutes, setMinutes] = useState(15);
  const [overlayPosition, setOverlayPosition] = useState<"bottom" | "modal">("bottom");
  const [isOverlayAudioPlaying, setIsOverlayAudioPlaying] = useState(false);
  const [hasAdhanConfigured, setHasAdhanConfigured] = useState(false);
  const overlayAudioRef = useRef<HTMLAudioElement | null>(null);
  const storage = new Storage();

  // Load settings & Play configured Adhan sound if shown
  useEffect(() => {
    if (visible && prayer) {
      storage.get("noortab-user-settings").then((storedSettings: any) => {
        if (storedSettings?.overlayPosition) {
          setOverlayPosition(storedSettings.overlayPosition);
        }

        const adhanAudio = storedSettings?.adhanAudio || "none";
        setHasAdhanConfigured(adhanAudio !== "none");

        // Auto-play adhan for both reminders and prayer time
        if (adhanAudio !== "none") {
          const option = ADHAN_AUDIO_OPTIONS.find((o) => o.key === adhanAudio);
          if (option && option.url) {
            const audio = new Audio(option.url);
            overlayAudioRef.current = audio;
            setIsOverlayAudioPlaying(true);

            audio.play().catch((err) => {
              setIsOverlayAudioPlaying(false);
            });

            audio.onended = () => {
              setIsOverlayAudioPlaying(false);
            };
          }
        }
      });
    }

    return () => {
      if (overlayAudioRef.current) {
        overlayAudioRef.current.pause();
        overlayAudioRef.current = null;
        setIsOverlayAudioPlaying(false);
      }
    };
  }, [visible, prayer]);

  useEffect(() => {
    const handleMessage = (message: any, sender: any, sendResponse: any) => {
      if (message.type === "SHOW_PRAYER_OVERLAY") {
        setPrayer(message.prayer);
        setMinutes(message.minutes);
        setVisible(true);
        sendResponse({ received: true });
      }
      if (message.type === "STOP_ALL_ADHAN") {
        if (overlayAudioRef.current) {
          overlayAudioRef.current.pause();
          setIsOverlayAudioPlaying(false);
        }
      }
    };

    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage);
    }
    
    return () => {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.removeListener(handleMessage);
      }
    };
  }, []);

  if (!visible || !prayer) return null;

  const handleToggleAudio = () => {
    if (overlayAudioRef.current) {
      if (isOverlayAudioPlaying) {
        overlayAudioRef.current.pause();
        setIsOverlayAudioPlaying(false);
      } else {
        overlayAudioRef.current.play().catch(() => {});
        setIsOverlayAudioPlaying(true);
      }
    }
  };

  const handleAction = () => {
    setVisible(false);
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: "OPEN_NEW_TAB", prayer });
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    if (overlayAudioRef.current) {
      overlayAudioRef.current.pause();
      setIsOverlayAudioPlaying(false);
    }
  };

  const isModal = overlayPosition === "modal";

  const containerClasses = isModal
    ? "fixed inset-0 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm z-[2147483647] p-4"
    : "fixed bottom-6 right-6 z-[2147483647] animate-slide-in-right";

  return (
    <div
      className={containerClasses}
      // Prevent backdrop clicks from bubbling; only the Close button inside dismisses
      onClick={isModal ? (e) => e.stopPropagation() : undefined}
    >
      <ReminderOverlay
        prayerName={prayer}
        timeRemaining={`${minutes} minutes`}
        onDismiss={handleDismiss}
        onAction={handleAction}
        isModal={isModal}
        isAdhanPlaying={isOverlayAudioPlaying}
        onToggleAdhan={handleToggleAudio}
        showAdhanControls={hasAdhanConfigured}
      />
    </div>
  );
};

export default OverlayCSUI;
