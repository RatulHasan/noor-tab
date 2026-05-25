import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { PanelId, PanelItem } from '~types';
import { cn } from '~utils/cn';

interface DroppablePanelProps {
  panelId: PanelId;
  items: PanelItem[];
  children: React.ReactNode;
  className?: string;
}

export function DroppablePanel({
  panelId, items, children, className
}: DroppablePanelProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `panel-${panelId}` });

  return (
    <SortableContext
      items={items.map(i => i.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-3 min-h-[100px] transition-colors duration-150',
          isOver && 'bg-emerald-50/50 dark:bg-emerald-950/10 rounded-xl ring-2 ring-emerald-500/20 ring-dashed',
          className
        )}
      >
        {children}

        {/* Drop target indicator when panel is empty or being hovered */}
        {isOver && items.filter(i => !i.locked).length === 0 && (
          <div className="
            border-2 border-dashed border-emerald-300
            rounded-xl h-24 flex items-center justify-center
            text-emerald-400 text-sm font-medium animate-pulse
          ">
            Drop here
          </div>
        )}
      </div>
    </SortableContext>
  );
}
