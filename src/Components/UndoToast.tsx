import { type numberMessagesProps } from "../scripts/types.ts";
import { type UndoToastProps } from "../scripts/types.ts";

// Shows toast notifications and lets the user undo the last task action.
const UndoToast: React.FC<UndoToastProps> = ({ numberMessages, setNumberMessages, startExit }) => {
  return (
    <div id="notifications">
      {numberMessages.map((message: numberMessagesProps) => {
        const extra = message.didUndo ? "undoing" : "";
        return (
          <div
            key={message.id}
            data-message-id={message.id}
            className={`notification ${extra}`}
            style={message.style}
          >
            <p className="notify-text">{message.text}</p>
            <button className="undo-btn" disabled={message.isExiting} onClick={(evt) => {
              const el = (evt.currentTarget as HTMLElement).closest(".notification") as HTMLElement | null;
              if (message.isExiting || !message.prevTasks) return;

              if (message.timeOut) clearTimeout(message.timeOut);
              if (message.deleteTimeout) clearTimeout(message.deleteTimeout);

              setNumberMessages(prev =>
                prev.map(m =>
                  m.id === message.id ? { ...m, didUndo: true } : m
                )
              );
              startExit(message.id, el);
            }}>Undo</button>
          </div>
        )
      })}
    </div>
  )
}

export default UndoToast;
