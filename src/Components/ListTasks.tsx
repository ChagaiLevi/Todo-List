import { useRef, useCallback } from "react";
import LineTasks from "./LineTasks";
import { type TasksListProps } from "../App";
import { type numberMessagesProps } from "../App";

type ListTasksProps = {
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  setNumberMessages: React.Dispatch<React.SetStateAction<numberMessagesProps[]>>;
  message: (action: () => void, id: string, prevTasksOverride?: TasksListProps[]) => string;
  onDetailsClick: (task: TasksListProps, event: React.MouseEvent<HTMLButtonElement>) => void;
};

const SNAP_DURATION = 180;
const SCROLL_ZONE = 80;
const SCROLL_SPEED = 10;

// Renders the task list and manages drag-and-drop reordering behavior.
const ListTasks: React.FC<ListTasksProps> = ({
  tasks,
  setTasks,
  setNumberMessages,
  message,
  onDetailsClick,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    item: HTMLElement;
    placeholder: HTMLElement;
    shiftX: number;
    shiftY: number;
    mouseY: number;
  } | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  // Auto-scrolls the page while a dragged item is near the top or bottom of the viewport.
  const scrollLoop = useCallback(() => {
    const dragData = dragState.current;
    if (!dragData) return;

    const y = dragData.mouseY;
    const viewportHeight = window.innerHeight;

    if (y < SCROLL_ZONE) {
      window.scrollBy(0, -SCROLL_SPEED * (1 - y / SCROLL_ZONE));
    } else if (y > viewportHeight - SCROLL_ZONE) {
      window.scrollBy(0, SCROLL_SPEED * ((y - (viewportHeight - SCROLL_ZONE)) / SCROLL_ZONE));
    }

    scrollRafRef.current = requestAnimationFrame(scrollLoop);
  }, []);

  // Stops the auto-scroll loop after dragging finishes.
  const stopScroll = useCallback(() => {
    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }
  }, []);

  // Finds the task element the dragged item should be inserted before.
  const getDragAfterElement = (y: number): HTMLElement | null => {
    const list = listRef.current;
    if (!list) return null;

    const items = [...list.querySelectorAll<HTMLElement>(".todo-item:not(.dragging)")];
    return items.reduce<{ offset: number; element: HTMLElement | null }>(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: null }
    ).element;
  };

  // Moves the dragged task with the mouse and repositions the placeholder in the list.
  const onMouseMove = useCallback((event: MouseEvent) => {
    const dragData = dragState.current;
    if (!dragData) return;

    dragData.mouseY = event.clientY;
    dragData.item.style.left = `${event.clientX - dragData.shiftX}px`;
    dragData.item.style.top = `${event.clientY - dragData.shiftY}px`;

    const list = listRef.current;
    if (!list) return;

    const after = getDragAfterElement(event.clientY);
    if (after == null) {
      list.appendChild(dragData.placeholder);
    } else {
      list.insertBefore(dragData.placeholder, after);
    }
  }, []);

  // Finishes a drag, snaps the item into place, and saves the new task order in state.
  const onMouseUp = useCallback(() => {
    const dragData = dragState.current;
    if (!dragData) return;

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    stopScroll();

    const targetRect = dragData.placeholder.getBoundingClientRect();

    dragData.item.style.transition = `left ${SNAP_DURATION}ms ease, top ${SNAP_DURATION}ms ease, transform ${SNAP_DURATION}ms ease, opacity ${SNAP_DURATION}ms ease`;
    dragData.item.style.left = `${targetRect.left}px`;
    dragData.item.style.top = `${targetRect.top}px`;
    dragData.item.style.transform = "scale(1)";
    dragData.item.style.opacity = "1";

    setTimeout(() => {
      const currentDragData = dragState.current;
      if (!currentDragData) return;

      if (currentDragData.placeholder.parentNode) {
        currentDragData.placeholder.parentNode.insertBefore(
          currentDragData.item,
          currentDragData.placeholder
        );
      }

      currentDragData.item.classList.remove("dragging");
      currentDragData.item.style.cssText = "";
      currentDragData.placeholder.parentNode?.removeChild(currentDragData.placeholder);

      const list = listRef.current;
      if (list) {
        const displayIds = [...list.querySelectorAll<HTMLElement>("[data-task-id]")]
          .map((element) => element.dataset.taskId!);
        const storageIds = displayIds.slice().reverse();

        setTasks((prev) => {
          const map = new Map(prev.map((task) => [task.id, task]));
          return storageIds.map((id) => map.get(id)!).filter(Boolean);
        });
      }

      dragState.current = null;
    }, SNAP_DURATION);
  }, [onMouseMove, stopScroll, setTasks]);

  // Starts dragging when the handle is pressed and prepares the floating task element.
  const handleDragHandleMouseDown = useCallback(
    (event: React.MouseEvent, itemEl: HTMLElement) => {
      event.preventDefault();

      const rect = itemEl.getBoundingClientRect();

      const placeholder = document.createElement("div");
      placeholder.classList.add("placeholder");
      placeholder.style.height = `${rect.height}px`;
      itemEl.parentNode!.insertBefore(placeholder, itemEl);

      itemEl.classList.add("dragging");
      itemEl.style.position = "fixed";
      itemEl.style.left = `${rect.left}px`;
      itemEl.style.top = `${rect.top}px`;
      itemEl.style.width = `${rect.width}px`;
      itemEl.style.zIndex = "1000";
      itemEl.style.transition = "none";

      document.body.appendChild(itemEl);

      dragState.current = {
        item: itemEl,
        placeholder,
        shiftX: event.clientX - rect.left,
        shiftY: event.clientY - rect.top,
        mouseY: event.clientY,
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      scrollRafRef.current = requestAnimationFrame(scrollLoop);
    },
    [onMouseMove, onMouseUp, scrollLoop]
  );

  const displayedTasks = tasks.slice().reverse();

  return (
    <>
      <div ref={listRef} className="todo-list">
        {displayedTasks.map((task) => (
          <LineTasks
            task={task}
            key={task.id}
            tasks={tasks}
            setTasks={setTasks}
            setNumberMessages={setNumberMessages}
            message={message}
            onDragHandleMouseDown={handleDragHandleMouseDown}
            onDetailsClick={(event) => onDetailsClick(task, event)}
          />
        ))}
      </div>
      {tasks.length === 0 && <p className="no-tasks">No Tasks</p>}
    </>
  );
};

export default ListTasks;
