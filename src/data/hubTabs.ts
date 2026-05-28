import { BookOpen, HandHeart, Compass, CalendarDays, Calculator, CheckCircle2 } from "lucide-react";
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
    id: 'quranHadith',
    label: 'Quran & Hadith',
    icon: BookOpen,
    component: lazy(() => import("../components/newtab/hub/tabs/QuranHadithTab")),
    enabled: true,
    requiresApi: true,
    apiSource: 'Multiple',
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
    id: 'salah',
    label: 'How To Pray Salah',
    icon: CheckCircle2,
    component: lazy(() => import("../components/newtab/hub/tabs/SalahTab")),
    enabled: true,
    requiresApi: false,
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
