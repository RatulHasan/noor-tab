import React from "react";
import type { PanelItem } from "~types";
import { cn } from "~utils/cn";
import { DroppablePanel } from "./DroppablePanel";
import { SortableWidget } from "./SortableWidget";

interface LeftPanelProps {
  items: PanelItem[];
  isDragMode: boolean;
  renderPanelItem: (item: PanelItem) => React.ReactNode;
  collapsed?: boolean;
  hidden?: boolean;
}

export default function LeftPanel({ 
  items, 
  isDragMode, 
  renderPanelItem,
  collapsed,
  hidden 
}: LeftPanelProps) {
  if (hidden) return null;

  const visibleItems = items
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <aside className={cn(
        "flex flex-col gap-3 transition-all duration-300 no-scrollbar overflow-y-auto h-full",
        collapsed ? "w-20" : "w-[280px]"
    )}>
      <DroppablePanel panelId="left" items={visibleItems}>
        {visibleItems.map(item => (
          <SortableWidget key={item.id} item={item} isDragMode={isDragMode}>
            {renderPanelItem(item)}
          </SortableWidget>
        ))}
      </DroppablePanel>
    </aside>
  );
}
