import LineTasks from './LineTasks';
import { type TasksListProps } from '../App';

type ListTasksProps = {
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  className: string;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
}

const ListTasks: React.FC<ListTasksProps> = ({ tasks, setTasks, className, setClassName }) => {
  let index: number = 0.6; // For animation delay

  return (
    <div className="todo-list">
      {tasks.slice().reverse().map((task: TasksListProps) => {
        index += 0.2; // For animation delay
        return (
          <LineTasks task={task} key={task.id} index={index} tasks={tasks} setTasks={setTasks} className={className} setClassName={setClassName} />
        )
      })}
      {tasks.length === 0 && (
        <p className="no-tasks">No Tasks</p>
      )}
    </div>

  )
}

export default ListTasks