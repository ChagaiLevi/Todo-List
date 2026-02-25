import { type TasksListProps } from "../App";
import { type numberMessagesProps } from "../App";

type UndoToastProps = {
  className: string;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  numberMessages: numberMessagesProps[];
  setNumberMessages: React.Dispatch<React.SetStateAction<numberMessagesProps[]>>;
  startExit: (messageId: string, e: any) => void;
}

const UndoToast: React.FC<UndoToastProps> = ({ className, setClassName, setTasks, numberMessages, setNumberMessages, startExit }) => {
  return (
    <div id="notifications">
      {numberMessages.map((message: numberMessagesProps) => {
        return (
          <div
            key={message.id}
            data-message-id={message.id}
            className={`notification ${className}`}
            style={message.style}
            onAnimationEnd={(e: React.AnimationEvent<HTMLDivElement>) => {
              if ((e as any).animationName === 'exitAd') {
                setClassName('');
              }
            }}
            onTransitionEnd={(e) => {
              if ((e as any).propertyName === 'max-height' && message.style?.maxHeight === '0px') {
                setNumberMessages(messages => messages.filter(m => m.id !== message.id));
              }
            }}
          >
            <p className="notify-text">{message.text}</p>
            <button className="undo-btn" onClick={(evt) => {
              const el = (evt.currentTarget as HTMLElement).closest('.notification') as HTMLElement | null;
              if (!message.prevTasks) return;
              setTasks(message.prevTasks);
              if (message.timeOut) clearTimeout(message.timeOut);
              startExit(message.id, el);
              setClassName('exiting');
            }}>Undo</button>
          </div>
        )
      })}
    </div>
  )
}

export default UndoToast;