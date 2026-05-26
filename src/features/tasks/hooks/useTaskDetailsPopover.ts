import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { type DetailsPopoverState, type Task } from "../types";

const initialPopoverState: DetailsPopoverState = {
  isMounted: false,
  isVisible: false,
  left: 0,
  top: 0,
  detailsDate: "",
  detailsTime: "",
};

export const useTaskDetailsPopover = () => {
  const [detailsPopover, setDetailsPopover] = useState<DetailsPopoverState>(initialPopoverState);
  const detailsPopoverRef = useRef<HTMLDivElement>(null);
  const activeTaskIdRef = useRef<string | null>(null);
  const transitionInProgressRef = useRef(false);

  const hideDetailsPopover = useCallback(() => {
    if (!detailsPopover.isVisible) return;

    transitionInProgressRef.current = true;
    activeTaskIdRef.current = null;
    setDetailsPopover((prev) => ({ ...prev, isVisible: false }));
  }, [detailsPopover.isVisible]);

  const handleDetailsClick = useCallback((
    task: Task,
    event: ReactMouseEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;

    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation?.();

    if (detailsPopover.isVisible && activeTaskIdRef.current === task.id) {
      hideDetailsPopover();
      return;
    }

    transitionInProgressRef.current = true;
    activeTaskIdRef.current = task.id;

    setDetailsPopover((prev) => ({
      ...prev,
      isMounted: true,
      isVisible: prev.isMounted ? prev.isVisible : false,
      detailsDate: task.detailsDate,
      detailsTime: task.detailsTime,
    }));

    requestAnimationFrame(() => {
      const popoverElement = detailsPopoverRef.current;
      const buttonRect = button.getBoundingClientRect();
      const itemRect = button.closest(".todo-item")?.getBoundingClientRect();

      if (!popoverElement || !itemRect) {
        transitionInProgressRef.current = false;
        return;
      }

      const popoverRect = popoverElement.getBoundingClientRect();

      let left = buttonRect.left + buttonRect.width / 2 - popoverRect.width / 2;
      let top = itemRect.top - popoverRect.height - 10;

      if (left < 10) left = 10;
      if (left + popoverRect.width > window.innerWidth - 10) {
        left = window.innerWidth - popoverRect.width - 10;
      }
      if (top < 10) top = 10;

      setDetailsPopover((prev) => ({
        ...prev,
        isMounted: true,
        isVisible: true,
        left,
        top,
        detailsDate: task.detailsDate,
        detailsTime: task.detailsTime,
      }));
    });
  }, [detailsPopover.isVisible, hideDetailsPopover]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        detailsPopover.isVisible &&
        !detailsPopoverRef.current?.contains(target) &&
        !Array.from(document.querySelectorAll(".details-btn")).some((button) => button.contains(target))
      ) {
        hideDetailsPopover();
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [detailsPopover.isVisible, hideDetailsPopover]);

  return {
    detailsPopover,
    detailsPopoverRef,
    transitionInProgressRef,
    setDetailsPopover,
    hideDetailsPopover,
    handleDetailsClick,
  };
};
