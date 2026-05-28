import React from "react";
import type { PanelItem } from "~types";
import { cn } from "~utils/cn";
import { DroppablePanel } from "./DroppablePanel";
import { SortableWidget } from "./SortableWidget";

interface CenterPanelProps {
  items: PanelItem[];
  isDragMode: boolean;
  renderPanelItem: (item: PanelItem) => React.ReactNode;
}

export default function CenterPanel({ 
  items, 
  isDragMode, 
  renderPanelItem 
}: CenterPanelProps) {
  const visibleItems = items
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="flex-1 min-w-[400px] flex flex-col gap-6 overflow-y-auto no-scrollbar h-full">
      <DroppablePanel panelId="center" items={visibleItems}>
        {visibleItems.map(item => (
          <SortableWidget key={item.id} item={item} isDragMode={isDragMode}>
            {renderPanelItem(item)}
          </SortableWidget>
        ))}
      </DroppablePanel>
    </main>
  );
}
