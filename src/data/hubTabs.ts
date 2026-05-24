import { BookOpen, BookMarked, HandHeart, Compass, CalendarDays, Calculator } from "lucide-react";
import { lazy, type ReactNode, type FC } from "react";

export interface HubTab {
  id: string;
  label: string;
  icon: any; // LucideIcon or custom component
  component: React.LazyExoticComponent<FC<any>>;
  enabled: boolean;
  requiresApi: boolean;
  apiSource?: string;
}

export const defaultHubTabs: HubTab[] = [
  {
    id: 'quran',
    label: 'Quran',
    icon: BookOpen,
    component: lazy(() => import("../components/newtab/hub/tabs/QuranTab")),
    enabled: true,
    requiresApi: true,
    apiSource: 'Al-Quran Cloud',
  },
  {
    id: 'hadith',
    label: 'Hadith',
    icon: BookMarked,
    component: lazy(() => import("../components/newtab/hub/tabs/HadithTab")),
    enabled: true,
    requiresApi: true,
    apiSource: 'HadithAPI',
  },
  {
    id: 'dua',
    label: 'Duas',
    icon: HandHeart,
    component: lazy(() => import("../components/newtab/hub/tabs/DuaTab")),
    enabled: true,
    requiresApi: false,  // uses existing local data
  },
  {
    id: 'qibla',
    label: 'Qibla',
    icon: Compass,
    component: lazy(() => import("../components/newtab/hub/tabs/QiblaTab")),
    enabled: true,
    requiresApi: false,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: CalendarDays,
    component: lazy(() => import("../components/newtab/hub/tabs/CalendarTab")),
    enabled: true,
    requiresApi: false,
  },
  {
    id: 'zakat',
    label: 'Zakat',
    icon: Calculator,
    component: lazy(() => import("../components/newtab/hub/tabs/ZakatTab")),
    enabled: true,
    requiresApi: false,
  },
];
