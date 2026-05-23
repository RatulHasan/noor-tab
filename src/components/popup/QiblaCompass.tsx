import React from "react";
import { useQibla } from "../../hooks/useQibla";
import { Compass, RotateCw } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * @param {Object} props
 * @param {{ lat: number, lng: number } | null} props.coordinates - User's coordinates.
 * @param {string | null} props.cityName - User's detected city name.
 */
interface QiblaCompassProps {
  coordinates: { lat: number; lng: number } | null;
  cityName: string | null;
}

export default function QiblaCompass({
  coordinates,
  cityName,
}: QiblaCompassProps) {
  const {
    staticBearing,
    staticCardinal,
    deviceHeading,
    relativeBearing,
    permissionGranted,
    requestCompassPermission,
    isCompassSupported,
  } = useQibla(coordinates);

  if (!coordinates) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Compass className="h-12 w-12 text-stone-300 dark:text-stone-700 animate-pulse" />
        <h3 className="mt-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
          Location Required
        </h3>
        <p className="mt-1 max-w-xs text-xs text-stone-500 dark:text-stone-400">
          Please enable location detection in settings to compute the Qibla direction.
        </p>
      </div>
    );
  }

  const isLive = deviceHeading !== null;
  // Rotation degrees for the compass dial
  // In live mode, we rotate the dial by -deviceHeading so that North points to the device's North,
  // and we point the needle at staticBearing (Kaaba bearing).
  // Alternatively, in static mode, we rotate the needle by staticBearing and North stays on top.
  const needleRotation = isLive ? relativeBearing ?? 0 : staticBearing ?? 0;

  return (
    <div className="flex flex-col items-center p-4">
      {/* Title / Description */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
          Qibla Direction
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {cityName ? `${cityName} • ` : ""}
          <span className="font-mono text-[10px]">
            {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
          </span>
        </p>
      </div>

      {/* Compass Container */}
      <div className="relative mt-8 flex h-48 w-48 items-center justify-center rounded-full bg-stone-50/50 shadow-inner border border-stone-200/50 dark:bg-stone-900/30 dark:border-stone-800/50">
        {/* Outer Ring Indicators */}
        <div className="absolute inset-2 rounded-full border border-dashed border-stone-200 dark:border-stone-800/80" />

        {/* Dial Card with Direction Letters */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
          style={{
            transform: isLive ? `rotate(${-deviceHeading}deg)` : "rotate(0deg)",
          }}
        >
          <span className="absolute top-2.5 text-xs font-black text-stone-700 dark:text-stone-300">N</span>
          <span className="absolute right-2.5 text-xs font-bold text-stone-400 dark:text-stone-600">E</span>
          <span className="absolute bottom-2.5 text-xs font-bold text-stone-400 dark:text-stone-600">S</span>
          <span className="absolute left-2.5 text-xs font-bold text-stone-400 dark:text-stone-600">W</span>
        </div>

        {/* Kaaba Direction Marker on Dial (always at staticBearing degrees) */}
        {staticBearing !== null && (
          <div
            className="absolute inset-0 flex justify-center transition-transform duration-700 ease-out"
            style={{
              transform: isLive
                ? `rotate(${-deviceHeading + staticBearing}deg)`
                : `rotate(${staticBearing}deg)`,
            }}
          >
            <div className="absolute top-0 -mt-2.5 flex flex-col items-center">
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">🕋</span>
            </div>
          </div>
        )}

        {/* Rotating Compass Needle */}
        <div
          className="relative z-10 h-32 w-32 compass-needle"
          style={{ transform: `rotate(${needleRotation}deg)` }}
        >
          {/* Elegant needle SVG */}
          <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
            {/* North pointing needle (Emerald) */}
            <path
              d="M 50 10 L 44 50 L 50 45 Z"
              fill="currentColor"
              className="text-emerald-700 dark:text-emerald-500 drop-shadow-[0_2px_4px_rgba(16,185,129,0.2)]"
            />
            {/* South pointing needle (Stone) */}
            <path
              d="M 50 90 L 44 50 L 50 45 Z"
              fill="currentColor"
              className="text-stone-300 dark:text-stone-700"
            />
            {/* Center Pivot */}
            <circle cx="50" cy="50" r="5" fill="#1b4332" stroke="#fff" strokeWidth="1.5" className="dark:fill-emerald-400" />
          </svg>
        </div>
      </div>

      {/* Heading Text */}
      <div className="mt-8 text-center">
        <span className="text-3xl font-extrabold text-stone-800 dark:text-stone-100 font-mono tracking-wide">
          {staticBearing !== null ? `${Math.round(staticBearing)}°` : "--"}
        </span>
        <span className="ml-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
          {staticCardinal}
        </span>
        <p className="text-[10px] text-stone-400 dark:text-stone-500 uppercase mt-0.5 tracking-wider font-semibold">
          Kaaba Angle from North
        </p>
      </div>

      {/* Permission request / live state indicator */}
      {isCompassSupported && (
        <div className="mt-5">
          {!isLive ? (
            <button
              onClick={requestCompassPermission}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/50 px-3 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 focus:outline-none dark:border-emerald-500/10 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
            >
              <RotateCw className="h-3 w-3" />
              Enable Live Compass
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Orientation Active
            </span>
          )}
        </div>
      )}
    </div>
  );
}
