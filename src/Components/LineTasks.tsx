import { type TasksListProps } from "../App";

// TODO: Add message to move buttons and get cancel option

type LineTasksProps = {
  task: TasksListProps;
  index: number;
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
}

const LineTasks: React.FC<LineTasksProps> = ({ task, index, tasks, setTasks }) => {
  const handleEdit: (id: string) => void = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isEditing: true } : task
    ));
  };

  // ? Why we need newText param? Can we remove it? and just use in funtion in app.tsx?
  const handleSave: (id: string, newText: string) => void = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText || task.text, isEditing: false } : task
    ));

  };

  const handleComplete: (id: string, forSure?: boolean) => void = (id, forSure = true) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: forSure ? !task.completed : forSure } : task
    ));
  };

  const handleDelete: (id: string) => void = (id) => {
    setTasks(tasks.map(task =>
      // ? Why we need to set isDeleting true here? Can we just filter directly?
      task.id === id ? { ...task, isDeleting: true } : task
    ));
    setTimeout(() => {
      setTasks(tasks.filter(task => task.id !== id));
    }, 500);
  };

  return (
    <div
      className={`todo-item ${task.isDeleting ? 'deleting' : ''}`}
      key={task.id}
      style={{ animation: `slideIn 0.8s ease-out ${index}s forwards; }` }}
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
              // TODO: Need to fix toggling complete on enter keypress
              // handleComplete(task.id, false);
            }
          }}
          autoFocus
        />
      )
        :/* if not */ (
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