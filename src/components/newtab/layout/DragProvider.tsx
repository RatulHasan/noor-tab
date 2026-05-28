import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import type { PanelItem, PanelLayout } from '~types';

interface DragProviderProps {
  children: React.ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  panels: PanelLayout;
}

export function DragProvider({ children, onDragEnd, onDragOver, panels }: DragProviderProps) {
  const [activeItem, setActiveItem] = useState<PanelItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findItemById = (id: string): PanelItem | null => {
    for (const panel of Object.values(panels)) {
      const item = panel.find(i => i.id === id);
      if (item) return item;
    }
    return null;
  };

  const getItemLabel = (item: PanelItem): string => {
    if (item.type === 'fixed') {
      const id = item.id.replace('fixed-', '');
      // Special cases
      if (id === 'prayerTimes') return 'Prayer Times';
      if (id === 'islamicCal') return 'Islamic Calendar';
      return id.charAt(0).toUpperCase() + id.slice(1);
    }
    if (item.type === 'widget' && item.widgetId) {
      // Split camelCase and capitalize
      return item.widgetId
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
    }
    if (item.type === 'hub' && item.hubTabId) {
      return item.hubTabId.charAt(0).toUpperCase() + item.hubTabId.slice(1);
    }
    return 'Item';
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[restrictToWindowEdges]}
      onDragStart={(e) => {
        const item = findItemById(e.active.id as string);
        setActiveItem(item);
      }}
      onDragOver={onDragOver}
      onDragEnd={(e) => {
        setActiveItem(null);
        onDragEnd(e);
      }}
    >
      {children}

      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'ease-out',
      }}>
        {activeItem && (
          <DragGhost item={activeItem} label={getItemLabel(activeItem)} />
        )}
      </DragOverlay>
    </DndContext>
  );
}

function DragGhost({ item, label }: { item: PanelItem; label: string }) {
  return (
    <div className="
      opacity-80 shadow-lg rotate-1 scale-105
      bg-white dark:bg-stone-900
      rounded-xl border border-emerald-200
      p-4 cursor-grabbing
      transition-transform duration-150
      z-[9999]
    ">
      <div className="text-sm font-medium text-stone-700 dark:text-stone-300">
        {label}
      </div>
    </div>
  );
}
