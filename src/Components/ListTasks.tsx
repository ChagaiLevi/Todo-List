import { useRef, useCallback } from 'react';
import LineTasks from './LineTasks';
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

const SNAP_DURATION = 180;
const SCROLL_ZONE = 80;  // px from top/bottom edge where auto-scroll kicks in
const SCROLL_SPEED = 10;  // px per frame

const ListTasks: React.FC<ListTasksProps> = ({ tasks, setTasks, setClassName, setNumberMessages, startExit, message }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    item: HTMLElement;
    placeholder: HTMLElement;
    shiftX: number;
    shiftY: number;
    mouseY: number;       // latest clientY, kept in sync by onMouseMove
  } | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  // ── auto-scroll loop ───────────────────────────────────────────────────────
  const scrollLoop = useCallback(() => {
    const ds = dragState.current;
    if (!ds) return;

    const y = ds.mouseY;
    const vh = window.innerHeight;

    if (y < SCROLL_ZONE) {
      // near top → scroll up
      window.scrollBy(0, -SCROLL_SPEED * (1 - y / SCROLL_ZONE));
    } else if (y > vh - SCROLL_ZONE) {
      // near bottom → scroll down
      window.scrollBy(0, SCROLL_SPEED * ((y - (vh - SCROLL_ZONE)) / SCROLL_ZONE));
    }

    scrollRafRef.current = requestAnimationFrame(scrollLoop);
  }, []);

  const stopScroll = useCallback(() => {
    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }
  }, []);

  // ── placeholder positioning ────────────────────────────────────────────────
  const getDragAfterElement = (y: number): HTMLElement | null => {
    const list = listRef.current;
    if (!list) return null;
    const items = [...list.querySelectorAll<HTMLElement>('.todo-item:not(.dragging)')];
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

  // ── mouse handlers ─────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: MouseEvent) => {
    const ds = dragState.current;
    if (!ds) return;

    ds.mouseY = e.clientY;
    ds.item.style.left = `${e.clientX - ds.shiftX}px`;
    ds.item.style.top = `${e.clientY - ds.shiftY}px`;

    const list = listRef.current;
    if (!list) return;
    const after = getDragAfterElement(e.clientY);
    if (after == null) {
      list.appendChild(ds.placeholder);
    } else {
      list.insertBefore(ds.placeholder, after);
    }
  }, []);

  const onMouseUp = useCallback(() => {
    const ds = dragState.current;
    if (!ds) return;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    stopScroll();

    const targetRect = ds.placeholder.getBoundingClientRect();

    // Animate snap to placeholder position
    ds.item.style.transition = `left ${SNAP_DURATION}ms ease, top ${SNAP_DURATION}ms ease, transform ${SNAP_DURATION}ms ease, opacity ${SNAP_DURATION}ms ease`;
    ds.item.style.left = `${targetRect.left}px`;
    ds.item.style.top = `${targetRect.top}px`;
    ds.item.style.transform = 'scale(1)';
    ds.item.style.opacity = '1';

    setTimeout(() => {
      const ds = dragState.current;
      if (!ds) return;

      // Place item into its new DOM position (moves it back from body into the list)
      if (ds.placeholder.parentNode) {
        ds.placeholder.parentNode.insertBefore(ds.item, ds.placeholder);
      }

      ds.item.classList.remove('dragging');
      ds.item.style.cssText = '';
      ds.placeholder.parentNode?.removeChild(ds.placeholder);

      // Sync new order to React state
      const list = listRef.current;
      if (list) {
        const displayIds = [...list.querySelectorAll<HTMLElement>('[data-task-id]')]
          .map(el => el.dataset.taskId!);
        const storageIds = displayIds.slice().reverse(); // DOM is newest-first
        setTasks(prev => {
          const map = new Map(prev.map(t => [t.id, t]));
          return storageIds.map(id => map.get(id)!).filter(Boolean);
        });
      }

      dragState.current = null;
    }, SNAP_DURATION);
  }, [onMouseMove, stopScroll, setTasks]);

  const handleDragHandleMouseDown = useCallback((e: React.MouseEvent, itemEl: HTMLElement) => {
    e.preventDefault();

    const rect = itemEl.getBoundingClientRect();

    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.style.height = `${rect.height}px`;
    itemEl.parentNode!.insertBefore(placeholder, itemEl);

    itemEl.classList.add('dragging');
    itemEl.style.position = 'fixed';
    itemEl.style.left = `${rect.left}px`;
    itemEl.style.top = `${rect.top}px`;
    itemEl.style.width = `${rect.width}px`;
    itemEl.style.zIndex = '1000';
    itemEl.style.transition = 'none';

    // Attach to body so position:fixed is always relative to the viewport,
    // regardless of any ancestor's transform/scroll context.
    document.body.appendChild(itemEl);

    dragState.current = {
      item: itemEl,
      placeholder,
      shiftX: e.clientX - rect.left,
      shiftY: e.clientY - rect.top,
      mouseY: e.clientY,
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Start auto-scroll loop
    scrollRafRef.current = requestAnimationFrame(scrollLoop);
  }, [onMouseMove, onMouseUp, scrollLoop]);

  const displayedTasks = tasks.slice().reverse();

  return (
    <>
      <div ref={listRef} className="todo-list">
        {displayedTasks.map((task: TasksListProps) => (
          <LineTasks
            task={task}
            key={task.id}
            tasks={tasks}
            setTasks={setTasks}
            setClassName={setClassName}
            setNumberMessages={setNumberMessages}
            startExit={startExit}
            message={message}
            onDragHandleMouseDown={handleDragHandleMouseDown}
          />
        ))}
      </div>
      {tasks.length === 0 && (
        <p className="no-tasks">No Tasks</p>
      )}
    </>
  );
}

export default ListTasks;