import React from "react";
import type { WidgetId, WidgetConfig } from "~types";

interface BottomWidgetRowProps {
  widgets: WidgetConfig[];
  renderWidget: (id: WidgetId) => React.ReactNode;
}

export default function BottomWidgetRow({ widgets, renderWidget }: BottomWidgetRowProps) {
  if (widgets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {widgets.map(w => (
        <React.Fragment key={w.id}>
          {renderWidget(w.id)}
        </React.Fragment>
      ))}
    </div>
  );
}
