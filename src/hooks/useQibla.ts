import { useState, useEffect, useRef } from "react";
import { calculateQiblaDirection, degreesToCardinal } from "../utils/qiblaCalculator";

export function useQibla(coordinates: { lat: number; lng: number } | null) {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isCompassSupported, setIsCompassSupported] = useState<boolean>(false);
  const hasReceivedData = useRef(false);

  const staticBearing = coordinates
    ? calculateQiblaDirection(coordinates.lat, coordinates.lng)
    : null;
    
  const staticCardinal = staticBearing !== null ? degreesToCardinal(staticBearing) : "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the API exists at all
    const apiExists = "DeviceOrientationEvent" in window;
    if (!apiExists) {
      setIsCompassSupported(false);
      return;
    }

    // Optimistically assume supported (mobile device). If no valid data arrives
    // within 3 seconds, mark as unsupported (desktop without sensors).
    setIsCompassSupported(true);

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Safari / iOS uses webkitCompassHeading
      const webkitHeading = (event as any).webkitCompassHeading;
      if (typeof webkitHeading === "number" && !isNaN(webkitHeading)) {
        hasReceivedData.current = true;
        setDeviceHeading(webkitHeading);
      } else if (typeof event.alpha === "number" && event.alpha !== null && !isNaN(event.alpha)) {
        hasReceivedData.current = true;
        // standard alpha goes counter-clockwise, compass is clockwise
        setDeviceHeading(360 - event.alpha);
      }
    };

    const isAbsoluteSupported = "ondeviceorientationabsolute" in window;
    const eventName = isAbsoluteSupported ? "deviceorientationabsolute" : "deviceorientation";

    window.addEventListener(eventName, handleOrientation as any);

    // Timeout: if no real data arrived in 3s, treat compass as unsupported (desktop)
    const supportTimeout = setTimeout(() => {
      if (!hasReceivedData.current) {
        setIsCompassSupported(false);
      }
    }, 3000);

    return () => {
      window.removeEventListener(eventName, handleOrientation as any);
      clearTimeout(supportTimeout);
    };
  }, []);

  const requestCompassPermission = async () => {
    const DeviceOrientation = DeviceOrientationEvent as any;
    if (
      typeof DeviceOrientation !== "undefined" &&
      typeof DeviceOrientation.requestPermission === "function"
    ) {
      try {
        const response = await DeviceOrientation.requestPermission();
        if (response === "granted") {
          setPermissionGranted(true);
          return true;
        } else {
          setPermissionGranted(false);
          return false;
        }
      } catch (e) {
        console.error("Compass permission request failed:", e);
        setPermissionGranted(false);
        return false;
      }
    } else {
      setPermissionGranted(true);
      return true;
    }
  };

  // Angle needed to point the compass arrow at Mecca: (staticBearing - deviceHeading)
  const relativeBearing =
    staticBearing !== null && deviceHeading !== null
      ? (staticBearing - deviceHeading + 360) % 360
      : staticBearing;

  return {
    staticBearing,
    staticCardinal,
    deviceHeading,
    relativeBearing,
    permissionGranted,
    requestCompassPermission,
    isCompassSupported,
  };
}
