import {
  type Dispatch,
  type MutableRefObject,
  type RefObject,
  type SetStateAction,
} from "react";
import { type DetailsPopoverState } from "../types";

type TaskDetailsPopoverProps = {
  detailsPopover: DetailsPopoverState;
  detailsPopoverRef: RefObject<HTMLDivElement | null>;
  transitionInProgressRef: MutableRefObject<boolean>;
  setDetailsPopover: Dispatch<SetStateAction<DetailsPopoverState>>;
};

const TaskDetailsPopover = ({
  detailsPopover,
  detailsPopoverRef,
  transitionInProgressRef,
  setDetailsPopover,
}: TaskDetailsPopoverProps) => {
  if (!detailsPopover.isMounted) return null;

  return (
    <div
      ref={detailsPopoverRef}
      className={`task-details-popover ${detailsPopover.isVisible ? "show" : ""}`}
      style={{ left: `${detailsPopover.left}px`, top: `${detailsPopover.top}px` }}
      onTransitionEnd={(event) => {
        if (event.propertyName !== "opacity") return;

        if (detailsPopover.isVisible) {
          transitionInProgressRef.current = false;
          return;
        }

        setDetailsPopover((prev) => ({ ...prev, isMounted: false }));
        transitionInProgressRef.current = false;
      }}
    >
      Details:
      <br />
      {detailsPopover.detailsDate}
      <br />
      {detailsPopover.detailsTime}
    </div>
  );
};

export default TaskDetailsPopover;
