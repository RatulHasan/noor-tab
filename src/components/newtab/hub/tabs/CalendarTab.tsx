import React, { useState, useMemo } from "react";
import { getHijriDateParts, hijriToGregorian, getHijriDateString } from "~utils/hijriConverter";
import { ISLAMIC_EVENTS } from "~data/islamicEvents";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "~utils/cn";

export default function CalendarTab() {
  const todayParts = useMemo(() => getHijriDateParts(new Date()), []);
  const [viewDate, setViewDate] = useState({ month: todayParts.month, year: todayParts.year });

  const { days, monthName, year } = useMemo(() => {
    const firstDayGreg = hijriToGregorian(viewDate.year, viewDate.month, 1);
    const startDayOfWeek = firstDayGreg.getDay(); // 0 = Sunday

    const calendarDays = [];
    
    // Add empty slots for days before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Hijri months are 29 or 30 days. We check day by day.
    for (let d = 1; d <= 30; d++) {
      const greg = hijriToGregorian(viewDate.year, viewDate.month, d);
      const hParts = getHijriDateParts(greg);
      
      // If we crossed into next month, stop
      if (hParts.month !== viewDate.month) break;
      
      calendarDays.push({
        day: d,
        gregorian: greg,
        events: ISLAMIC_EVENTS.filter(e => e.hijriDate.month === viewDate.month && e.hijriDate.day === d)
      });
    }

    return {
      days: calendarDays,
      monthName: todayParts.month === viewDate.month && todayParts.year === viewDate.year 
        ? todayParts.monthName 
        : getHijriDateParts(firstDayGreg).monthName,
      year: viewDate.year
    };
  }, [viewDate]);

  const handlePrevMonth = () => {
    setViewDate(prev => {
      let newMonth = prev.month - 1;
      let newYear = prev.year;
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      return { month: newMonth, year: newYear };
    });
  };

  const handleNextMonth = () => {
    setViewDate(prev => {
      let newMonth = prev.month + 1;
      let newYear = prev.year;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
      return { month: newMonth, year: newYear };
    });
  };

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    return ISLAMIC_EVENTS.map(event => {
        // Simple approximation for upcoming events list
        let eventDate = hijriToGregorian(viewDate.year, event.hijriDate.month, event.hijriDate.day);
        if (eventDate < today) {
             eventDate = hijriToGregorian(viewDate.year + 1, event.hijriDate.month, event.hijriDate.day);
        }
        return { ...event, date: eventDate };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);
  }, [viewDate.year]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
            Islamic Calendar
          </h2>
          <p className="text-stone-500 dark:text-stone-400">
            {monthName} {year} AH
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-stone-600" />
          </button>
          <button onClick={() => setViewDate({ month: todayParts.month, year: todayParts.year })} className="px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg hover:bg-emerald-100 transition-colors">
            Today
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-stone-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-7 gap-px bg-stone-200 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-stone-50 dark:bg-stone-900 py-3 text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
            {days.map((day, i) => {
              const isToday = day && day.gregorian.toDateString() === new Date().toDateString();
              const hasEvents = day && day.events.length > 0;
              
              return (
                <div 
                  key={i} 
                  className={cn(
                    "min-h-[80px] bg-white dark:bg-stone-950 p-2 relative group transition-colors",
                    day ? "hover:bg-stone-50 dark:hover:bg-stone-900/50" : "bg-stone-50/50 dark:bg-stone-900/20"
                  )}
                >
                  {day && (
                    <>
                      <span className={cn(
                        "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                        isToday ? "bg-emerald-700 text-white" : "text-stone-700 dark:text-stone-300 group-hover:text-emerald-600"
                      )}>
                        {day.day}
                      </span>
                      <span className="absolute top-2 right-2 text-[9px] text-stone-400 font-medium">
                        {day.gregorian.getDate()}
                      </span>
                      {hasEvents && (
                        <div className="mt-1 space-y-1">
                          {day.events.map((e, idx) => (
                            <div key={idx} className="text-[9px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800 truncate" title={e.name}>
                              {e.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {upcomingEvents.map((event, i) => {
                const diffMs = event.date.getTime() - new Date().setHours(0,0,0,0);
                const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={i} className="flex gap-3 group">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-stone-50 dark:bg-stone-800 flex flex-col items-center justify-center border border-stone-100 dark:border-stone-700 group-hover:border-emerald-200 transition-colors">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">{event.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-sm font-black text-stone-700 dark:text-stone-200 leading-none">{event.date.getDate()}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-800 dark:text-stone-100">{event.name}</h4>
                      <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                        {diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
