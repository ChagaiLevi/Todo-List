import {
  type Dispatch,
  type MouseEvent as ReactMouseEvent,
  type SetStateAction,
} from "react";
import TaskItem from "./TaskItem";
import { useTaskDrag } from "../hooks/useTaskDrag";
import { type ShowUndoableToast, type Task, type ToastMessage } from "../types";

type TaskListProps = {
  tasks: Task[];
  allTasks: Task[];
  canDrag: boolean;
  search: string;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setToasts: Dispatch<SetStateAction<ToastMessage[]>>;
  showUndoableToast: ShowUndoableToast;
  onDetailsClick: (task: Task, event: ReactMouseEvent<HTMLButtonElement>) => void;
};

const TaskList = ({
  tasks,
  allTasks,
  canDrag,
  search,
  setTasks,
  setToasts,
  showUndoableToast,
  onDetailsClick,
}: TaskListProps) => {
  const { listRef, handleDragHandleMouseDown } = useTaskDrag(canDrag, setTasks);

  return (
    <>
      <div ref={listRef} className="todo-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            tasks={allTasks}
            setTasks={setTasks}
            setToasts={setToasts}
            showUndoableToast={showUndoableToast}
            onDragHandleMouseDown={handleDragHandleMouseDown}
            onDetailsClick={(event) => onDetailsClick(task, event)}
            canDrag={canDrag}
            search={search}
          />
        ))}
      </div>
      {tasks.length === 0 && <p className="no-tasks">No Tasks</p>}
    </>
  );
};

export default TaskList;
