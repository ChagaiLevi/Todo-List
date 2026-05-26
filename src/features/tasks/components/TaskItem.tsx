import {
  type Dispatch,
  type MouseEvent as ReactMouseEvent,
  type SetStateAction,
  useRef,
} from "react";
import { renderHighlightedTaskText } from "../lib/taskSearch";
import { normalizeTaskText } from "../lib/taskText";
import { type ShowUndoableToast, type Task, type ToastMessage } from "../types";

type TaskItemProps = {
  task: Task;
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setToasts: Dispatch<SetStateAction<ToastMessage[]>>;
  showUndoableToast: ShowUndoableToast;
  onDragHandleMouseDown: (event: ReactMouseEvent, itemEl: HTMLElement) => void;
  onDetailsClick: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  canDrag: boolean;
  search: string;
};

const TaskItem = ({
  task,
  tasks,
  setTasks,
  setToasts,
  showUndoableToast,
  onDragHandleMouseDown,
  onDetailsClick,
  canDrag,
  search,
}: TaskItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const oldTaskText = useRef("");
  const previousTasksRef = useRef<Task[]>([]);
  const taskText = normalizeTaskText(task.text);

  const renderTaskText = () => {
    if (!search.trim()) return taskText;
    return renderHighlightedTaskText(taskText, search, task.id);
  };

  const handleEdit = (id: string) => {
    oldTaskText.current = taskText;
    previousTasksRef.current = tasks.map((taskItem) => ({ ...taskItem }));
    setTasks(tasks.map((taskItem) => (
      taskItem.id === id ? { ...taskItem, isEditing: true } : taskItem
    )));
  };

  const handleSave = (id: string, newText: string) => {
    const previousTrimmedText = oldTaskText.current.trim();
    const nextTrimmedText = newText.trim();
    const addedCharacters = nextTrimmedText.length > previousTrimmedText.length;

    const editTask = () => {
      setTasks(
        tasks.map((taskItem) =>
          taskItem.id === id
            ? {
              ...taskItem,
              text: newText || taskItem.text,
              isEditing: false,
              completed: taskItem.completed && addedCharacters ? false : taskItem.completed,
            }
            : taskItem
        )
      );
    };

    if (nextTrimmedText === previousTrimmedText) {
      editTask();
      oldTaskText.current = newText;
      return;
    }

    showUndoableToast({
      action: editTask,
      previousTasks: previousTasksRef.current,
      text: "Task edited",
    });
    oldTaskText.current = newText;
  };

  const handleComplete = (id: string) => {
    setTasks(
      tasks.map((taskItem) =>
        taskItem.id === id
          ? { ...taskItem, completed: !taskItem.completed, isEditing: false }
          : taskItem
      )
    );
    oldTaskText.current = taskText;
  };

  const handleDelete = (id: string) => {
    const snapshot = tasks.map((taskItem) => ({ ...taskItem }));

    setTasks((prev) => prev.map((taskItem) => (
      taskItem.id === id ? { ...taskItem, isDeleting: true } : taskItem
    )));

    const performDelete = () => setTasks((prev) => prev.filter((taskItem) => taskItem.id !== id));
    const toastId = showUndoableToast({
      action: performDelete,
      previousTasks: snapshot,
      text: "Task deleted",
    });

    const deleteTimeout = setTimeout(performDelete, 500);
    setToasts((prev) =>
      prev.map((toast) => (
        toast.id === toastId ? { ...toast, deleteTimeout } : toast
      ))
    );
  };

  return (
    <div
      ref={itemRef}
      className={`todo-item ${task.isDeleting ? "deleting" : ""} ${task.isRestored ? "restored" : ""}`}
      data-task-id={task.id}
      style={task.isDeleting ? { opacity: 0 } : undefined}
    >
      {canDrag && (
        <button
          type="button"
          className="drag-handle"
          aria-label="Drag to reorder"
          onMouseDown={(event) => {
            if (itemRef.current) onDragHandleMouseDown(event, itemRef.current);
          }}
        >
          <span className="stripe" />
          <span className="stripe" />
          <span className="stripe" />
        </button>
      )}

      {task.isEditing ? (
        <input
          type="text"
          className="task-input"
          value={taskText}
          onChange={(event) =>
            setTasks(
              tasks.map((taskItem) => (
                taskItem.id === task.id
                  ? { ...taskItem, text: event.target.value }
                  : taskItem
              ))
            )
          }
          onBlur={() => handleSave(task.id, taskText)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSave(task.id, taskText);
          }}
          autoFocus
        />
      ) : (
        <p className={`task-text ${task.completed ? "completed" : ""}`}>{renderTaskText()}</p>
      )}

      <div className="actions">
        <button type="button" className="edit-btn" onClick={() => handleEdit(task.id)}>
          ✎
        </button>
        <button type="button" className="complete-btn" onClick={() => handleComplete(task.id)}>
          ✓
        </button>
        <button type="button" className="details-btn" onClick={onDetailsClick}>
          !
        </button>
        <button type="button" className="delete-btn" onClick={() => handleDelete(task.id)}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
