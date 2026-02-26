import LineTasks from './LineTasks';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { type TasksListProps } from '../App';
import { type numberMessagesProps } from '../App';

type ListTasksProps = {
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  setClassName: React.Dispatch<React.SetStateAction<string>>;
  setNumberMessages: React.Dispatch<React.SetStateAction<numberMessagesProps[]>>;
  startExit: (messageId: string, e: any) => void;
  message: (action: () => void, id: string, prevTasksOverride?: TasksListProps[]) => string;
}

const ListTasks: React.FC<ListTasksProps> = ({ tasks, setTasks, setClassName, setNumberMessages, startExit, message }) => {
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 200, easing: 'ease-out' });

  return (
    <>
      <div ref={parent} className="todo-list">
        {tasks.slice().reverse().map((task: TasksListProps) => (
          <LineTasks
            task={task}
            key={task.id}
            tasks={tasks}
            setTasks={setTasks}
            setClassName={setClassName}
            setNumberMessages={setNumberMessages}
            startExit={startExit}
            message={message}
          />
        ))}
      </div>
      {tasks.length === 0 && (
        <p className="no-tasks">No Tasks</p>
      )}
    </>
  );
}

export default ListTasks