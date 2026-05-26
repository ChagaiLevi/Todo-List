import { type Dispatch, type SetStateAction } from "react";
import { type ToastMessage } from "../types";

type UndoToastProps = {
  toasts: ToastMessage[];
  setToasts: Dispatch<SetStateAction<ToastMessage[]>>;
  startExit: (toastId: string, element: HTMLElement | null) => void;
};

const UndoToast = ({ toasts, setToasts, startExit }: UndoToastProps) => {
  return (
    <div id="notifications">
      {toasts.map((toast) => {
        const extraClassName = toast.didUndo ? "undoing" : "";
        return (
          <div
            key={toast.id}
            data-message-id={toast.id}
            className={`notification ${extraClassName}`}
            style={toast.style}
          >
            <p className="notify-text">{toast.text}</p>
            <button
              type="button"
              className="undo-btn"
              disabled={toast.isExiting}
              onClick={(event) => {
                const element = event.currentTarget.closest(".notification") as HTMLElement | null;
                if (toast.isExiting) return;

                if (toast.timeOut) clearTimeout(toast.timeOut);
                if (toast.deleteTimeout) clearTimeout(toast.deleteTimeout);

                setToasts((prev) =>
                  prev.map((toastItem) => (
                    toastItem.id === toast.id ? { ...toastItem, didUndo: true } : toastItem
                  ))
                );
                startExit(toast.id, element);
              }}
            >
              Undo
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default UndoToast;
