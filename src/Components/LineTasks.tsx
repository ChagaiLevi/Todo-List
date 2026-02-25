import { useRef } from "react";
import { type TasksListProps } from "../App";
import { type numberMessagesProps } from "../App";

type LineTasksProps = {
  task: TasksListProps;
  index: number;
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  setNumberMessages: React.Dispatch<React.SetStateAction<numberMessagesProps[]>>;
  startExit: (messageId: string, e: any) => void;
  message: (action: () => void, id: string, prevTasksOverride?: TasksListProps[]) => void;
};

const LineTasks: React.FC<LineTasksProps> = ({ task, index, tasks, setTasks, setClassName, setNumberMessages, startExit, message }) => {
  const oldTaskText = useRef<string>('');
  const prevTasksRef = useRef<TasksListProps[]>([]);

  setClassName; setNumberMessages; startExit; // to avoid "declared but not used" lint errors

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

    // if nothing actually changed, just persist the non‑editing state
    if (newTrim === prevTrim) {
      edit();
      oldTaskText.current = newText || '';
      return;               // do not create a message
    }

    // otherwise include the pre‑edit snapshot for undo
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
    // setTasks(tasks.map(task =>
    //   task.id === id ? { ...task, isDeleting: true } : task
    // ));

    const deleted: () => void = () => {
      setTasks(prev => prev.filter(task => task.id !== id));
    };

    message(deleted, id);

    setTimeout(() => {
      setTasks(prev => prev.filter(task => task.id !== id));
    }, 500);
  };

  const animationDelay = `${index * 0.1}s`;
  const animationStyle: React.CSSProperties = task.isDeleting
    ? { animation: `fadeOut 0.5s ease-out forwards` }
    : { animation: `slideIn 0.8s ease-out ${animationDelay} forwards` };

  return (
    <div
      className={`todo-item ${task.isDeleting ? 'deleting' : ''}`}
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