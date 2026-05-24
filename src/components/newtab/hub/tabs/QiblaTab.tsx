import React from "react";
import { useQibla } from "~hooks/useQibla";
import { useSettings } from "~hooks/useSettings";
import { calculateDistanceToKaaba } from "~utils/qiblaCalculator";
import { MapPin, Navigation, Info } from "lucide-react";
import { cn } from "~utils/cn";

export default function QiblaTab() {
  const [settings] = useSettings();
  const coords = settings?.coordinates;
  const { 
    staticBearing, 
    staticCardinal, 
    deviceHeading, 
    relativeBearing, 
    requestCompassPermission,
    isCompassSupported 
  } = useQibla(coords);

  const distance = coords ? calculateDistanceToKaaba(coords.lat, coords.lng) : 0;
  const needleRotation = deviceHeading !== null ? relativeBearing ?? 0 : staticBearing ?? 0;

  return (
    <div className="p-8 flex flex-col items-center max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center justify-center gap-2">
          Qibla Direction
        </h2>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          {settings?.cityName || "Current Location"} • {staticCardinal} ({staticBearing}°)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
        {/* Compass View */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            {/* SVG Compass */}
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
              {/* Outer Ring */}
              <circle cx="150" cy="150" r="120" fill="none" stroke="#064e3b" strokeWidth="2" strokeDasharray="4 4" className="opacity-30" />
              <circle cx="150" cy="150" r="135" fill="none" stroke="#064e3b" strokeWidth="1" className="opacity-10" />

              {/* Cardinal Labels */}
              <g className="font-bold text-[14px]" fill="#d97706">
                <text x="150" y="40" textAnchor="middle">N</text>
                <text x="260" y="155" textAnchor="middle">E</text>
                <text x="150" y="270" textAnchor="middle">S</text>
                <text x="40" y="155" textAnchor="middle">W</text>
              </g>

              {/* Compass Rose / 8-point star */}
              <g transform="translate(150, 150)" className="opacity-20">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                  <path
                    key={deg}
                    d="M 0 -100 L 10 0 L -10 0 Z"
                    fill="#064e3b"
                    transform={`rotate(${deg})`}
                  />
                ))}
              </g>

              {/* Rotating Dial (if deviceHeading available) */}
              <g transform={`rotate(${deviceHeading !== null ? -deviceHeading : 0}, 150, 150)`} className="transition-transform duration-700 ease-out">
                {/* Degree markings could go here */}
              </g>

              {/* Needle */}
              <g transform={`rotate(${needleRotation}, 150, 150)`} className="transition-transform duration-700 ease-out">
                {/* Gold Tip (Mecca) */}
                <path d="M 150 50 L 135 150 L 165 150 Z" fill="#d97706" />
                {/* Silver Bottom */}
                <path d="M 150 250 L 165 150 L 135 150 Z" fill="#d6d3d1" />
                {/* Needle shadow/detail */}
                <path d="M 150 50 L 150 150 L 165 150 Z" fill="black" opacity="0.05" />
              </g>

              {/* Center Circle */}
              <circle cx="150" cy="150" r="28" fill="#065f46" />
              {/* Kaaba Icon (simplified cubic shape) */}
              <g transform="translate(138, 138) scale(0.5)" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                <rect x="8" y="9" width="8" height="2" fill="gold" opacity="0.8" />
              </g>
            </svg>
            
            {/* Live Indicator */}
            {deviceHeading !== null && (
              <div className="absolute top-0 right-0">
                 <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex flex-col items-center">
            <span className="text-4xl font-mono font-black text-stone-800 dark:text-stone-100">
              {Math.round(staticBearing || 0)}°
            </span>
            <span className="text-sm font-bold text-emerald-700 uppercase tracking-widest mt-1">
              {staticCardinal}
            </span>
          </div>
        </div>

        {/* Info/Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              Distance to Makkah
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-stone-800 dark:text-stone-100">
                {distance.toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </span>
              <span className="text-stone-500">km</span>
            </div>
            <button 
              onClick={() => window.open('https://maps.google.com/?q=21.4225,39.8262', '_blank')}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-sm font-semibold"
            >
              <MapPin className="w-4 h-4" />
              View on Google Maps
            </button>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              How to use
            </h3>
            <ul className="text-xs text-emerald-800/70 dark:text-emerald-400/70 space-y-2 list-disc pl-4">
              <li>Place your device flat on a level surface.</li>
              <li>Ensure you are away from large metal objects or electronic devices.</li>
              <li>The gold needle tip points towards the Kaaba in Makkah.</li>
              {isCompassSupported && deviceHeading === null && (
                <li className="font-bold text-emerald-700 dark:text-emerald-300">
                  <button onClick={requestCompassPermission} className="underline">Enable live compass</button> for real-time rotation.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
