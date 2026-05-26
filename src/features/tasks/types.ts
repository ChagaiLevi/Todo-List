import { type CSSProperties } from "react";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  isRestored?: boolean;
  createdAt: number;
  detailsDate: string;
  detailsTime: string;
};

export type SavedTask = Omit<Task, "createdAt" | "detailsDate" | "detailsTime"> & {
  createdAt?: number | string;
  detailsDate?: string;
  detailsTime?: string;
};

export type ToastMessage = {
  id: string;
  text: string;
  style: CSSProperties;
  timeOut: ReturnType<typeof setTimeout> | undefined;
  previousTasks: Task[];
  deleteTimeout?: ReturnType<typeof setTimeout>;
  didUndo?: boolean;
  isExiting?: boolean;
};

export type DetailsPopoverState = {
  isMounted: boolean;
  isVisible: boolean;
  left: number;
  top: number;
  detailsDate: string;
  detailsTime: string;
};

export type TaskSortOption = "customer" | "A-Z" | "Z-A" | "date" | "date-reverse";

export type ShowUndoableToast = (options: {
  action: () => void;
  previousTasks?: Task[];
  text?: string;
}) => string;
