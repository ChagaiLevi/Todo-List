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
};

const LineTasks: React.FC<LineTasksProps> = ({ task, tasks, setTasks, setClassName, setNumberMessages, startExit, message }) => {
  const oldTaskText = useRef<string>('');
  const prevTasksRef = useRef<TasksListProps[]>([]);

  setClassName; setNumberMessages; startExit; // avoid unused lint issues

  const handleEdit: (id: string) => void = (id) => {
    oldTaskText.current = task.text;
    prevTasksRef.current = tasks.map(t => ({ ...t }));
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isEditing: true } : task
    ));
  };

  const handleSave: (id: string, newText: string) => void = (id, newText) => {
    const prev: string = oldTaskText.current || '';
    const prevTrim: string = prev.trim();
    const newTrim: string = (newText || '').trim();
    const added: boolean = newTrim.length > prevTrim.length;

    const edit: () => void = () => {
      setTasks(tasks.map(t =>
        t.id === id
          ? {
            ...t,
            text: newText || t.text,
            isEditing: false,
            completed: (t.completed && added) ? false : t.completed
          }
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

  const handleComplete: (id: string) => void = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed, isEditing: false } : t
    ));

    oldTaskText.current = task.text;
  };

  const handleDelete: (id: string) => void = (id) => {
    // take snapshot for undo
    const snapshot = tasks.map(t => ({ ...t }));

    // flag item as deleting so it fades before removal
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, isDeleting: true } : task
      )
    );

    const performDelete = () => {
      setTasks(prev => prev.filter(task => task.id !== id));
    };

    // message returns the id so we can later attach deleteTimeout
    const msgId = message(performDelete, id, snapshot);

    // update text for delete notification
    setNumberMessages(prevArr =>
      prevArr.map(m =>
        m.id === msgId ? { ...m, text: 'Task deleted' } : m
      )
    );

    const deleteTimeout = setTimeout(performDelete, 500);
    setNumberMessages(prevArr =>
      prevArr.map(m =>
        m.id === msgId ? { ...m, deleteTimeout } : m
      )
    );
  };

  const animationStyle: React.CSSProperties = task.isDeleting
    ? { opacity: 0 }
    : {};

  const restoredClass = task.isRestored ? 'restored' : '';

  return (
    <div
      className={`todo-item ${task.isDeleting ? 'deleting' : ''} ${restoredClass}`}
      key={task.id}
      style={animationStyle}
    >
      {task.isEditing ? (
        <input
          type="text"
          className="task-input"
          value={task.text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTasks(tasks.map(taskObject =>
            taskObject.id === task.id ? { ...taskObject, text: e.target.value } : taskObject
          ))}
          onBlur={() => handleSave(task.id, task.text)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              handleSave(task.id, task.text);
            }
          }}
          autoFocus
        />
      )
        : (
          <p className={`task-text ${task.completed ? 'completed' : ''}`}>{task.text}</p>
        )}
      <div className="actions">
        <button className="edit-btn" onClick={() => handleEdit(task.id)}>✎</button>
        <button className="complete-btn" onClick={() => handleComplete(task.id)}>✔</button>
        <button className="delete-btn" onClick={() => handleDelete(task.id)}>✖</button>
      </div>
    </div>
  )
}

export default LineTasks