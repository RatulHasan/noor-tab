import React from "react";
import type { PanelItem } from "~types";
import { DroppablePanel } from "./DroppablePanel";
import { SortableWidget } from "./SortableWidget";

interface BottomWidgetRowProps {
  items: PanelItem[];
  isDragMode: boolean;
  renderPanelItem: (item: PanelItem) => React.ReactNode;
}

export default function BottomWidgetRow({ items, isDragMode, renderPanelItem }: BottomWidgetRowProps) {
  const visibleItems = items
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order);

  if (visibleItems.length === 0 && !isDragMode) return null;

  return (
    <DroppablePanel 
      panelId="bottom" 
      items={visibleItems}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
    >
      {visibleItems.map(item => (
        <SortableWidget key={item.id} item={item} isDragMode={isDragMode}>
          {renderPanelItem(item)}
        </SortableWidget>
      ))}
    </DroppablePanel>
  );
}
