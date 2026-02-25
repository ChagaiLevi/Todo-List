import LineTasks from './LineTasks';
import { type TasksListProps } from '../App';
import { type numberMessagesProps } from '../App';

type ListTasksProps = {
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  setNumberMessages: React.Dispatch<React.SetStateAction<numberMessagesProps[]>>;
  startExit: (messageId: string, e: any) => void;
  message: (action: () => void, id: string) => void;
}

const ListTasks: React.FC<ListTasksProps> = ({ tasks, setTasks, setClassName, setNumberMessages, startExit, message }) => {
  let index: number = 0.6; // For animation delay

  return (
    <div className="todo-list">
      {tasks.slice().reverse().map((task: TasksListProps) => {
        index += 0.2; // For animation delay
        return (
          <LineTasks task={task} key={task.id} index={index} tasks={tasks} setTasks={setTasks} setClassName={setClassName} setNumberMessages={setNumberMessages} startExit={startExit} message={message} />
        )
      })}

      {tasks.length === 0 && (
        <p className="no-tasks">No Tasks</p>
      )}
    </div>
  )
}

export default ListTasks