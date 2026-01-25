import { type TasksListProps } from "../App";

type UndoToastProps = {
  className: string;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  prevTasks: TasksListProps[];
  timeOut: any;
}

const UndoToast: React.FC<UndoToastProps> = ({ className, setClassName, setTasks, prevTasks, timeOut }) => {
  const style: React.CSSProperties = {
    display: className ? 'flex' : 'none'
  };

  return (
    <div
      id="notification"
      className={`notification ${className}`}
      style={style}
      onAnimationEnd={(e: React.AnimationEvent<HTMLDivElement>) => {
        if (e.animationName === 'exitAd') {
          setClassName('');
        }
      }}
    >
      <p className="notify-text">Task deleted</p>
      <button id="undo-btn" onClick={() => {
        if (!prevTasks) return;
        setTasks(prevTasks);
        clearTimeout(timeOut);
        setClassName('exiting');
      }} >Undo</button>
    </div>
  )
}

export default UndoToast;