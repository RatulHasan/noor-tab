import React from "react";
import { useQibla } from "~hooks/useQibla";
import { useSettings } from "~hooks/useSettings";
import { calculateDistanceToKaaba } from "~utils/qiblaCalculator";
import { MapPin, Navigation, Compass } from "lucide-react";
import type { WidgetId, WidgetConfig } from "~types";
import { cn } from "~utils/cn";

interface RightPanelProps {
  widgets: WidgetConfig[];
  renderWidget: (id: WidgetId) => React.ReactNode;
}

export default function RightPanel({ widgets, renderWidget }: RightPanelProps) {
  const [settings] = useSettings();
  const coords = settings?.coordinates;
  const { 
    staticBearing, 
    staticCardinal, 
    deviceHeading, 
    relativeBearing 
  } = useQibla(coords);

  const distance = coords ? calculateDistanceToKaaba(coords.lat, coords.lng) : 0;
  const needleRotation = deviceHeading !== null ? relativeBearing ?? 0 : staticBearing ?? 0;

  return (
    <aside className="w-[280px] flex flex-col gap-4 overflow-y-auto no-scrollbar h-full">
      {/* Qibla Direction Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col shrink-0">
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20">
           <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-stone-800 dark:text-stone-100 uppercase tracking-widest text-xs">Qibla Direction</h3>
              <Compass className="w-4 h-4 text-emerald-600" />
           </div>
           <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
             {settings.cityName || "Current Location"}
           </p>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Outer Ring */}
              <circle cx="150" cy="150" r="120" fill="none" stroke="#064e3b" strokeWidth="2" strokeDasharray="4 4" className="opacity-20" />
              
              {/* Cardinal Labels */}
              <g className="font-bold text-[18px]" fill="#d97706">
                <text x="150" y="35" textAnchor="middle">N</text>
                <text x="265" y="155" textAnchor="middle">E</text>
                <text x="150" y="275" textAnchor="middle">S</text>
                <text x="35" y="155" textAnchor="middle">W</text>
              </g>

              {/* Compass Rose */}
              <g transform="translate(150, 150)" className="opacity-10">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                  <path
                    key={deg}
                    d="M 0 -100 L 10 0 L -10 0 Z"
                    fill="#064e3b"
                    transform={`rotate(${deg})`}
                  />
                ))}
              </g>

              {/* Needle */}
              <g transform={`rotate(${needleRotation}, 150, 150)`} className="transition-transform duration-700 ease-out">
                <path d="M 150 50 L 135 150 L 165 150 Z" fill="#d97706" />
                <path d="M 150 250 L 165 150 L 135 150 Z" fill="#d6d3d1" />
              </g>

              {/* Center Circle */}
              <circle cx="150" cy="150" r="28" fill="#065f46" />
              {/* Kaaba Icon */}
              <g transform="translate(138, 138) scale(0.5)" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </g>
            </svg>
          </div>

          <div className="mt-4 text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-mono font-black text-stone-800 dark:text-stone-100">{Math.round(staticBearing || 0)}°</span>
              <span className="text-sm font-bold text-emerald-700">{staticCardinal}</span>
            </div>
            <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">
              {distance.toLocaleString(undefined, { maximumFractionDigits: 1 })} km to Kaaba
            </p>
          </div>
        </div>

        <button 
          onClick={() => window.open('https://maps.google.com/?q=21.4225,39.8262', '_blank')}
          className="m-4 mt-0 py-2.5 bg-stone-50 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
        >
          <Navigation className="w-3 h-3" />
          View on Map
        </button>
      </div>

      {/* Additional Widgets */}
      {widgets.map(w => (
        <React.Fragment key={w.id}>
          {renderWidget(w.id)}
        </React.Fragment>
      ))}
    </aside>
  );
}
