import { useRef } from "react";
import { type TasksListProps } from "../App";

type LineTasksProps = {
  task: TasksListProps;
  index: number;
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  setprevTask: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  setTimeOut: React.Dispatch<React.SetStateAction<any>>;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
}

const LineTasks: React.FC<LineTasksProps> = ({ task, index, tasks, setTasks, setClassName, setprevTask, setTimeOut, setMessageText }) => {
  const oldTaskText = useRef<string>('');
  const handleEdit: (id: string) => void = (id) => {
    oldTaskText.current = task.text;

    // snapshot a shallow clone of tasks (clone objects so later mutations don't modify the snapshot)
    setprevTask(tasks.map(t => ({ ...t })));

    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isEditing: true } : task
    ));
  };

  const handleSave: (id: string, newText: string) => void = (id, newText) => {
    const prev: string = oldTaskText.current || '';
    const prevTrim: string = prev.trim();
    const newTrim: string = (newText || '').trim();
    const added: boolean = newTrim.length > prevTrim.length;

    // snapshot already done in handleEdit, don't overwrite it here
    if (prevTrim !== newTrim) {
      setMessageText('Task edited');
      setClassName('entering');
      setTimeOut(setTimeout(() => {
        setClassName('exiting');
      }, 5000));
    }

    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, text: newText || t.text, isEditing: false, completed: (t.completed && added) ? false : t.completed }
        : t
    ));

    oldTaskText.current = newText || '';
  };

  const handleComplete: (id: string) => void = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed, isEditing: false } : t
    ));

    oldTaskText.current = task.text;
  };

  const handleDelete: (id: string) => void = (id) => {
    // clone before starting delete animation so undo restores the real previous state
    setprevTask(tasks.map(t => ({ ...t })));
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isDeleting: true } : task
    ));

    setMessageText('Task deleted');
    setClassName('entering');
    setTimeOut(setTimeout(() => {
      setClassName('exiting');
    }, 5000));

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