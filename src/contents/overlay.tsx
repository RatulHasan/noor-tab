import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import React, { useState, useEffect } from "react";
import ReminderOverlay from "../components/shared/ReminderOverlay";
import type { PrayerName } from "../types";

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

  useEffect(() => {
    const handleMessage = (message: any, sender: any, sendResponse: any) => {
      if (message.type === "SHOW_PRAYER_OVERLAY") {
        setPrayer(message.prayer);
        setMinutes(message.minutes);
        setVisible(true);
        sendResponse({ received: true });
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

  const handleAction = () => {
    setVisible(false);
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: "OPEN_NEW_TAB", prayer });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2147483647] animate-slide-in-right">
      <ReminderOverlay
        prayerName={prayer}
        timeRemaining={`${minutes} minutes`}
        onDismiss={() => setVisible(false)}
        onAction={handleAction}
        autoDismissMs={30000}
      />
    </div>
  );
};

export default OverlayCSUI;
