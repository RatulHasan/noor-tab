import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Lock } from 'lucide-react';
import type { PanelItem } from '~types';
import { cn } from '~utils/cn';

interface SortableWidgetProps {
  item: PanelItem;
  children: React.ReactNode;
  isDragMode: boolean; // only show handle when customizer is open
}

export function SortableWidget({ item, children, isDragMode }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: item.locked || !isDragMode, // locked items or when not in drag mode cannot be sorted
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms ease-out',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group transition-all duration-200',
        isDragging && 'opacity-30 scale-95 z-0',
        item.locked && 'cursor-default',
        isDragMode && 'ring-1 ring-stone-200 dark:ring-stone-800 rounded-xl'
      )}
      {...attributes}
    >
      {/* Drag handle — only visible in drag mode, hidden for locked items */}
      {isDragMode && !item.locked && (
        <button
          className="
            absolute -left-3 top-1/2 -translate-y-1/2 z-20
            opacity-0 group-hover:opacity-100
            transition-all duration-150
            cursor-grab active:cursor-grabbing
            p-1.5 rounded-lg
            bg-white dark:bg-stone-800
            shadow-md border border-stone-200 dark:border-stone-700
            text-stone-400 hover:text-emerald-600 hover:scale-110
          "
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      )}

      {/* Lock icon for locked items in drag mode */}
      {isDragMode && item.locked && (
        <div className="
          absolute top-2 right-2 z-10
          p-1.5 rounded-lg
          bg-stone-50/80 dark:bg-stone-900/80
          text-stone-400 backdrop-blur-sm
        " title="Locked item">
          <Lock size={12} />
        </div>
      )}

      {children}
    </div>
  );
}
