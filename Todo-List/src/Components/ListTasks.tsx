import LineTasks from './LineTasks';
import { type TasksListProps } from '../App';

const ListTasks: React.FC<{ tasks: TasksListProps[], setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>> }> = ({ tasks, setTasks }) => {
  let index: number = 0.6;

  return (
    <div className="todo-list">
      {tasks.slice().reverse().map((task: TasksListProps) => {
        index += 0.2;
        return (
          <LineTasks task={task} key={task.id} index={index} tasks={tasks} setTasks={setTasks} />
        )
      })}
    </div>

  )
}

export default ListTasks