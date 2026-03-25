import { useRef } from "react";
import { type TasksListProps } from "../App";
import { type numberMessagesProps } from "../App";

type LineTasksProps = {
  task: TasksListProps;
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  setNumberMessages: React.Dispatch<React.SetStateAction<numberMessagesProps[]>>;
  message: (action: () => void, id: string, prevTasksOverride?: TasksListProps[]) => string;
  onDragHandleMouseDown: (event: React.MouseEvent, itemEl: HTMLElement) => void;
  onDetailsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

// Displays one task row and handles editing, completing, deleting, and drag interactions for it.
const LineTasks: React.FC<LineTasksProps> = ({
  task,
  tasks,
  setTasks,
  setNumberMessages,
  message,
  onDragHandleMouseDown,
  onDetailsClick,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const oldTaskText = useRef<string>("");
  const prevTasksRef = useRef<TasksListProps[]>([]);

  // Switches this task into edit mode and remembers its previous text/state for undo.
  const handleEdit = (id: string) => {
    oldTaskText.current = task.text;
    prevTasksRef.current = tasks.map((taskItem) => ({ ...taskItem }));
    setTasks(tasks.map((taskItem) => (taskItem.id === id ? { ...taskItem, isEditing: true } : taskItem)));
  };

  // Saves edited text, and creates an undo toast only when the text actually changed.
  const handleSave = (id: string, newText: string) => {
    const prevTrim = (oldTaskText.current || "").trim();
    const newTrim = (newText || "").trim();
    const added = newTrim.length > prevTrim.length;

    const edit = () => {
      setTasks(
        tasks.map((taskItem) =>
          taskItem.id === id
            ? {
              ...taskItem,
              text: newText || taskItem.text,
              isEditing: false,
              completed: taskItem.completed && added ? false : taskItem.completed,
            }
            : taskItem
        )
      );
    };

    if (newTrim === prevTrim) {
      edit();
      oldTaskText.current = newText || "";
      return;
    }

    message(edit, id, prevTasksRef.current);
    oldTaskText.current = newText || "";
  };

  // Toggles whether this task is marked complete.
  const handleComplete = (id: string) => {
    setTasks(
      tasks.map((taskItem) =>
        taskItem.id === id ? { ...taskItem, completed: !taskItem.completed, isEditing: false } : taskItem
      )
    );
    oldTaskText.current = task.text;
  };

  // Starts the delete animation, removes the task, and wires up Undo support.
  const handleDelete = (id: string) => {
    const snapshot = tasks.map((taskItem) => ({ ...taskItem }));

    setTasks((prev) => prev.map((taskItem) => (taskItem.id === id ? { ...taskItem, isDeleting: true } : taskItem)));

    const performDelete = () => setTasks((prev) => prev.filter((taskItem) => taskItem.id !== id));

    const msgId = message(performDelete, id, snapshot);

    setNumberMessages((prevArr) =>
      prevArr.map((messageItem) => (messageItem.id === msgId ? { ...messageItem, text: "Task deleted" } : messageItem))
    );

    const deleteTimeout = setTimeout(performDelete, 500);
    setNumberMessages((prevArr) =>
      prevArr.map((messageItem) =>
        messageItem.id === msgId ? { ...messageItem, deleteTimeout } : messageItem
      )
    );
  };

  const animationStyle: React.CSSProperties = task.isDeleting ? { opacity: 0 } : {};
  const restoredClass = task.isRestored ? "restored" : "";

  return (
    <div
      ref={itemRef}
      className={`todo-item ${task.isDeleting ? "deleting" : ""} ${restoredClass}`}
      data-task-id={task.id}
      style={animationStyle}
    >
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

      {task.isEditing ? (
        <input
          type="text"
          className="task-input"
          value={task.text}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setTasks(
              tasks.map((taskItem) =>
                taskItem.id === task.id ? { ...taskItem, text: event.target.value } : taskItem
              )
            )
          }
          onBlur={() => handleSave(task.id, task.text)}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") handleSave(task.id, task.text);
          }}
          autoFocus
        />
      ) : (
        <p className={`task-text ${task.completed ? "completed" : ""}`}>{task.text}</p>
      )}

      <div className="actions">
        <button className="edit-btn" onClick={() => handleEdit(task.id)}>✎</button>
        <button className="complete-btn" onClick={() => handleComplete(task.id)}>✓</button>
        <button className="details-btn" onClick={onDetailsClick}>!</button>
        <button className="delete-btn" onClick={() => handleDelete(task.id)}>✕</button>
      </div>
    </div>
  );
};

export default LineTasks;
