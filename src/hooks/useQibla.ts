import { useState, useEffect } from "react";
import { calculateQiblaDirection, degreesToCardinal } from "../utils/qiblaCalculator";

export function useQibla(coordinates: { lat: number; lng: number } | null) {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const staticBearing = coordinates
    ? calculateQiblaDirection(coordinates.lat, coordinates.lng)
    : null;
    
  const staticCardinal = staticBearing !== null ? degreesToCardinal(staticBearing) : "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Safari / iOS uses webkitCompassHeading
      const webkitHeading = (event as any).webkitCompassHeading;
      if (typeof webkitHeading === "number") {
        setDeviceHeading(webkitHeading);
      } else if (event.alpha !== null) {
        // standard alpha goes counter-clockwise, compass is clockwise
        setDeviceHeading(360 - event.alpha);
      }
    };

    const isAbsoluteSupported = "ondeviceorientationabsolute" in window;
    const eventName = isAbsoluteSupported ? "deviceorientationabsolute" : "deviceorientation";

    window.addEventListener(eventName, handleOrientation as any);

    return () => {
      window.removeEventListener(eventName, handleOrientation as any);
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

  const isCompassSupported =
    typeof window !== "undefined" && "DeviceOrientationEvent" in window;

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
