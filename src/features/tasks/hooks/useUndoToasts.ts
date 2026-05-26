import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { type ShowUndoableToast, type Task, type ToastMessage } from "../types";

const TOAST_LIFETIME_MS = 5000;
const TOAST_EXIT_DURATION_MS = 300;

export const useUndoToasts = (
  setTasks: Dispatch<SetStateAction<Task[]>>
) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastsRef = useRef(toasts);
  const exitingToastIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  useEffect(() => {
    return () => {
      toastsRef.current.forEach((toast) => {
        if (toast.timeOut) clearTimeout(toast.timeOut);
        if (toast.deleteTimeout) clearTimeout(toast.deleteTimeout);
      });
    };
  }, []);

  const startExit = (toastId: string, element: HTMLElement | null) => {
    const toast = toastsRef.current.find((item) => item.id === toastId);
    if (!toast || toast.isExiting || exitingToastIdsRef.current.has(toastId)) return;

    exitingToastIdsRef.current.add(toastId);

    if (toast.timeOut) clearTimeout(toast.timeOut);
    if (toast.deleteTimeout) clearTimeout(toast.deleteTimeout);

    const measuredHeight = element?.offsetHeight ?? 0;

    setToasts((prev) =>
      prev.map((toastItem) =>
        toastItem.id === toastId
          ? {
              ...toastItem,
              isExiting: true,
              style: {
                ...toastItem.style,
                overflow: "hidden",
                maxHeight: measuredHeight ? `${measuredHeight}px` : "120px",
              },
            }
          : toastItem
      )
    );

    requestAnimationFrame(() => {
      setToasts((prev) =>
        prev.map((toastItem) =>
          toastItem.id === toastId
            ? {
                ...toastItem,
                style: {
                  ...toastItem.style,
                  opacity: 0,
                  maxHeight: "0px",
                  padding: "0px",
                  margin: "0px",
                  transform: "translateX(-100px) scale(0.8)",
                },
              }
            : toastItem
        )
      );
    });

    setTimeout(() => {
      const exitingToast = toastsRef.current.find((item) => item.id === toastId);

      if (exitingToast?.didUndo) {
        const restoredTasks = exitingToast.previousTasks.map((task) => ({
          ...task,
          isRestored: true,
        }));
        setTasks(restoredTasks);
        setTimeout(() => {
          setTasks((prev) => prev.map((task) => ({ ...task, isRestored: false })));
        }, 400);
      }

      setToasts((prev) => prev.filter((toastItem) => toastItem.id !== toastId));
      exitingToastIdsRef.current.delete(toastId);
    }, TOAST_EXIT_DURATION_MS);
  };

  const showUndoableToast: ShowUndoableToast = ({ action, previousTasks, text = "Task edited" }) => {
    const snapshot = (previousTasks ?? []).map((task) => ({ ...task }));
    const toastId = uuidv4();
    const autoCloseTimeout = setTimeout(() => {
      const element = document.querySelector(`[data-message-id='${toastId}']`) as HTMLElement | null;
      startExit(toastId, element);
    }, TOAST_LIFETIME_MS);

    const newToast: ToastMessage = {
      id: toastId,
      text,
      style: { opacity: 0, transform: "translateY(-100px)", display: "flex" },
      timeOut: autoCloseTimeout,
      previousTasks: snapshot,
    };

    setToasts((prev) => [...prev, newToast]);
    action();

    requestAnimationFrame(() => {
      setToasts((prev) =>
        prev.map((toastItem) =>
          toastItem.id === toastId
            ? {
                ...toastItem,
                style: {
                  ...toastItem.style,
                  opacity: 1,
                  transform: "translateY(0) scale(1)",
                },
              }
            : toastItem
        )
      );
    });

    return toastId;
  };

  return {
    toasts,
    setToasts,
    showUndoableToast,
    startExit,
  };
};
