import { type TasksListProps } from "../App";


const LineTasks: React.FC<{ task: TasksListProps, index: number, tasks: TasksListProps[], setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>, i: number }> = ({ task, index, tasks, setTasks, i }) => {
  const handleEdit = (id: any) => {


    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isEditing: true } : task
    ));
  };

  const handleSave = (id: any, newText: any) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText || task.text, isEditing: false } : task
    ));
  };

  const handleComplete = (id: any) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isDeleting: true } : task
    ));
    setTimeout(() => {
      setTasks(tasks.filter(task => task.id !== id));
    }, 500); // Match duration of fadeOut animation
  };

  return (
    <div className={`todo-item ${task.isDeleting ? 'deleting' : ''}`} key={task.id} style={{ /*animationDelay: `${0.8 + i * 0.2}s`,*/ animation: `slideIn 0.8s ease-out ${index}s forwards; }` }}>
      {task.isEditing ? (
        <input
          type="text"
          className="task-input"
          value={task.text}
          onChange={(e) => setTasks(tasks.map(t =>
            t.id === task.id ? { ...t, text: e.target.value } : t
          ))}
          onBlur={() => handleSave(task.id, task.text)}
          onKeyDown={(e) => {
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
        <button className="delete-btn" onClick={() => /*setTasks(tasks.filter((item: TasksListProps) => item.id !== task.id))*/ handleDelete(task.id)}>✖</button>
      </div>
    </div>
  )
}

export default LineTasks