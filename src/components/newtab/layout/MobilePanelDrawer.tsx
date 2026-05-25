import React from 'react';
import { X } from 'lucide-react';
import { cn } from '~utils/cn';

interface MobilePanelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side: 'left' | 'right';
}

export function MobilePanelDrawer({
  isOpen,
  onClose,
  title,
  children,
  side
}: MobilePanelDrawerProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[150] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 w-[300px] max-w-[85vw] bg-stone-50 dark:bg-stone-950 z-[160] shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          side === 'left' ? "left-0" : "right-0",
          isOpen ? "translate-x-0" : side === 'left' ? "-translate-x-full" : "translate-x-full"
        )}
      >
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <h2 className="text-sm font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
          {children}
        </div>
      </aside>
    </>
  );
}
