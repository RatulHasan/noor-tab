import { useCallback } from 'react';
import { useStorage } from '@plasmohq/storage/hook';
import { arrayMove } from '@dnd-kit/sortable';
import type { LayoutState, PanelId } from '../types';
import { defaultLayoutState } from '../data/defaultSettings';

export function useLayoutState() {
  const [layoutState, setLayoutState] = useStorage<LayoutState>(
    'noorTabLayoutState',
    (storedVal) => {
        if (!storedVal) return defaultLayoutState;
        return {
            ...defaultLayoutState,
            ...storedVal,
            panels: {
                ...defaultLayoutState.panels,
                ...(storedVal.panels || {}),
            }
        };
    }
  );

  // Move item within same panel (reorder)
  const reorderWithinPanel = useCallback((
    panel: PanelId,
    activeId: string,
    overId: string
  ) => {
    setLayoutState(prev => {
      if (!prev) return prev;
      const items = [...prev.panels[panel]];
      const activeIndex = items.findIndex(i => i.id === activeId);
      const overIndex = items.findIndex(i => i.id === overId);
      if (activeIndex === -1 || overIndex === -1) return prev;

      const reordered = arrayMove(items, activeIndex, overIndex)
        .map((item, index) => ({ ...item, order: index }));

      return {
        ...prev,
        lastModified: new Date().toISOString(),
        panels: { ...prev.panels, [panel]: reordered },
      };
    });
  }, [setLayoutState]);

  // Move item between panels
  const moveBetweenPanels = useCallback((
    activeId: string,
    sourcePanel: PanelId,
    targetPanel: PanelId,
    overIndex: number
  ) => {
    setLayoutState(prev => {
      if (!prev) return prev;
      // Prevent moving locked items
      const item = prev.panels[sourcePanel].find(i => i.id === activeId);
      if (!item || item.locked) return prev;

      // Prevent moving fixed items between panels
      if (item.type === 'fixed') return prev;

      const sourceItems = prev.panels[sourcePanel]
        .filter(i => i.id !== activeId)
        .map((i, idx) => ({ ...i, order: idx }));

      const targetItems = [...prev.panels[targetPanel]];
      const updatedItem = { ...item, panel: targetPanel };
      targetItems.splice(overIndex, 0, updatedItem);
      const reorderedTarget = targetItems.map((i, idx) => ({ ...i, order: idx }));

      return {
        ...prev,
        lastModified: new Date().toISOString(),
        panels: {
          ...prev.panels,
          [sourcePanel]: sourceItems,
          [targetPanel]: reorderedTarget,
        },
      };
    });
  }, [setLayoutState]);

  // Toggle widget visibility
  const toggleVisibility = useCallback((itemId: string, panel: PanelId) => {
    setLayoutState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        lastModified: new Date().toISOString(),
        panels: {
          ...prev.panels,
          [panel]: prev.panels[panel].map(item =>
            item.id === itemId ? { ...item, visible: !item.visible } : item
          ),
        },
      };
    });
  }, [setLayoutState]);

  // Reset to defaults
  const resetLayout = useCallback(() => {
    setLayoutState({
      ...defaultLayoutState,
      lastModified: new Date().toISOString(),
    });
  }, [setLayoutState]);

  return {
    layoutState: layoutState || defaultLayoutState,
    reorderWithinPanel,
    moveBetweenPanels,
    toggleVisibility,
    resetLayout,
    isLoading: layoutState === undefined
  };
}
