import { useRef } from "react";
import { type TasksListProps } from "../App";
import { type numberMessagesProps } from "../App";

type LineTasksProps = {
  task: TasksListProps;
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  setNumberMessages: React.Dispatch<React.SetStateAction<numberMessagesProps[]>>;
  startExit: (messageId: string, e: any) => void;
  message: (action: () => void, id: string, prevTasksOverride?: TasksListProps[]) => string;
  onDragHandleMouseDown: (e: React.MouseEvent, itemEl: HTMLElement) => void;
};

const LineTasks: React.FC<LineTasksProps> = ({
  task, tasks, setTasks, setClassName, setNumberMessages, startExit, message,
  onDragHandleMouseDown,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const oldTaskText = useRef<string>('');
  const prevTasksRef = useRef<TasksListProps[]>([]);

  setClassName; setNumberMessages; startExit; // suppress unused lint warnings

  const handleEdit = (id: string) => {
    oldTaskText.current = task.text;
    prevTasksRef.current = tasks.map(t => ({ ...t }));
    setTasks(tasks.map(t => t.id === id ? { ...t, isEditing: true } : t));
  };

  const handleSave = (id: string, newText: string) => {
    const prevTrim = (oldTaskText.current || '').trim();
    const newTrim = (newText || '').trim();
    const added = newTrim.length > prevTrim.length;

    const edit = () => {
      setTasks(tasks.map(t =>
        t.id === id
          ? { ...t, text: newText || t.text, isEditing: false, completed: t.completed && added ? false : t.completed }
          : t
      ));
    };

    if (newTrim === prevTrim) {
      edit();
      oldTaskText.current = newText || '';
      return;
    }

    message(edit, id, prevTasksRef.current);
    oldTaskText.current = newText || '';
  };

  const handleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, isEditing: false } : t));
    oldTaskText.current = task.text;
  };

  const handleDelete = (id: string) => {
    const snapshot = tasks.map(t => ({ ...t }));

    setTasks(prev => prev.map(t => t.id === id ? { ...t, isDeleting: true } : t));

    const performDelete = () => setTasks(prev => prev.filter(t => t.id !== id));

    const msgId = message(performDelete, id, snapshot);

    setNumberMessages(prevArr =>
      prevArr.map(m => m.id === msgId ? { ...m, text: 'Task deleted' } : m)
    );

    const deleteTimeout = setTimeout(performDelete, 500);
    setNumberMessages(prevArr =>
      prevArr.map(m => m.id === msgId ? { ...m, deleteTimeout } : m)
    );
  };

  const animationStyle: React.CSSProperties = task.isDeleting ? { opacity: 0 } : {};
  const restoredClass = task.isRestored ? 'restored' : '';

  return (
    <div
      ref={itemRef}
      className={`todo-item ${task.isDeleting ? 'deleting' : ''} ${restoredClass}`}
      data-task-id={task.id}
      style={animationStyle}
    >
      {/* Drag handle — mirrors prototype exactly */}
      <button
        type="button"
        className="drag-handle"
        aria-label="Drag to reorder"
        onMouseDown={e => {
          if (itemRef.current) onDragHandleMouseDown(e, itemRef.current);
        }}
      >
        <span className="stripe" />
        <span className="stripe" />
        <span className="stripe" />
      </button>

      {task.isEditing ? (
        <input
          type="text"
          className="task-input"
          value={task.text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTasks(tasks.map(t => t.id === task.id ? { ...t, text: e.target.value } : t))
          }
          onBlur={() => handleSave(task.id, task.text)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') handleSave(task.id, task.text);
          }}
          autoFocus
        />
      ) : (
        <p className={`task-text ${task.completed ? 'completed' : ''}`}>{task.text}</p>
      )}

      <div className="actions">
        <button className="edit-btn" onClick={() => handleEdit(task.id)}>✎</button>
        <button className="complete-btn" onClick={() => handleComplete(task.id)}>✔</button>
        <button className="delete-btn" onClick={() => handleDelete(task.id)}>✖</button>
      </div>
    </div>
  );
}

export default LineTasks;