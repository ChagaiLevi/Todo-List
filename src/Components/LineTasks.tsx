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
};

const LineTasks: React.FC<LineTasksProps> = ({ task, index, tasks, setTasks, setClassName, setNumberMessages, startExit }) => {
  const oldTaskText = useRef<string>('');
  const prevTasksRef = useRef<TasksListProps[]>([]);

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

    let newMessage: numberMessagesProps = {
      id: task.id,
      text: 'Task edited',
      style: { opacity: 0, transform: 'translateY(-100px)', display: 'flex' },
      timeOut: undefined,
      prevTasks: prevTasksRef.current
    };

    setNumberMessages(prev => [...prev, newMessage]);

    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, text: newText || t.text, isEditing: false, completed: (t.completed && added) ? false : t.completed }
        : t
    ));

    requestAnimationFrame(() => {
      setNumberMessages(prev => prev.map(m =>
        m.id === newMessage.id ? { ...m, style: { ...m.style, opacity: 1, transform: 'translateY(0) scale(1)' } } : m
      ));
    });

    setNumberMessages(prev => prev.map(m =>
      m.id === newMessage.id ? {
        ...m,
        timeOut: setTimeout(() => {
          const el = document.querySelector(`[data-message-id="${newMessage.id}"]`) as HTMLElement | null;
          startExit(newMessage.id, el);
        }, 5000)
      } : m
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
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isDeleting: true } : task
    ));

    let newMessage: numberMessagesProps = {
      id: task.id,
      text: 'Task deleted',
      style: { opacity: 0, transform: 'translateY(-100px)', display: 'flex' },
      timeOut: undefined,
      prevTasks: tasks.map(t => ({ ...t }))
    };

    setNumberMessages(prev => [...prev, newMessage]);

    requestAnimationFrame(() => {
      setNumberMessages(prev => prev.map(m =>
        m.id === newMessage.id ? { ...m, style: { ...m.style, opacity: 1, transform: 'translateY(0) scale(1)' } } : m
      ));
    });

    setClassName('entering');

    setNumberMessages(prev => prev.map(m =>
      m.id === newMessage.id ? {
        ...m,
        timeOut: setTimeout(() => {
          const el = document.querySelector(`[data-message-id="${newMessage.id}"]`) as HTMLElement | null;
          startExit(newMessage.id, el);
        }, 5000)
      } : m
    ));

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