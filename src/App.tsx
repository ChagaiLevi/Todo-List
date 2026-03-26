import Title from "./Components/Title";
import AddTask from "./Components/AddTask";
import Filters from "./Components/Filters";
import ListTasks from "./Components/ListTasks";
import UndoToast from "./Components/UndoToast";
import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export type TasksListProps = {
  id: string;
  text: string;
  completed: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  isRestored?: boolean;
  createdAt: number;
  detailsDate: string;
  detailsTime: string;
};

export type numberMessagesProps = {
  id: string;
  text: string;
  style: React.CSSProperties;
  timeOut: ReturnType<typeof setTimeout> | undefined;
  prevTasks: TasksListProps[];
  deleteTimeout?: ReturnType<typeof setTimeout>;
  didUndo?: boolean;
  isExiting?: boolean;
};

type SavedTaskProps = Omit<TasksListProps, "createdAt" | "detailsDate" | "detailsTime"> & {
  createdAt?: number | string;
  detailsDate?: string;
  detailsTime?: string;
};

type DetailsPopupStateProps = {
  isMounted: boolean;
  isVisible: boolean;
  left: number;
  top: number;
  detailsDate: string;
  detailsTime: string;
};

// Builds the date/time metadata that gets saved with each task.
const createTaskDetails = (date = new Date()) => ({
  createdAt: date.getTime(),
  detailsDate: new Intl.DateTimeFormat("en-GB").format(date),
  detailsTime: new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date),
});

const parseLegacyTaskDate = (detailsDate?: string, detailsTime?: string) => {
  if (!detailsDate) return null;

  const [day, month, year] = detailsDate.split("/").map(Number);
  const [hour = 0, minute = 0] = detailsTime?.split(":").map(Number) ?? [];

  if (!day || !month || !year) return null;

  const parsedDate = new Date(year, month - 1, day, hour, minute);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getSavedTaskDate = (task: SavedTaskProps) => {
  if (typeof task.createdAt === "number" && Number.isFinite(task.createdAt)) {
    return new Date(task.createdAt);
  }

  if (typeof task.createdAt === "string") {
    const timestamp = Number(task.createdAt);
    if (Number.isFinite(timestamp)) {
      return new Date(timestamp);
    }

    const parsedDate = new Date(task.createdAt);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return parseLegacyTaskDate(task.detailsDate, task.detailsTime) ?? new Date();
};

const TOAST_LIFETIME_MS = 5000;
const TOAST_EXIT_DURATION_MS = 300;

// Coordinates the full todo app: task state, undo toasts, and the details popup.
function App() {
  const [tasks, setTasks] = useState<TasksListProps[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (!savedTasks) return [];

    const parsedTasks: SavedTaskProps[] = JSON.parse(savedTasks);

    return parsedTasks.map((task) => {
      const normalizedDate = getSavedTaskDate(task);
      const normalizedDetails = createTaskDetails(normalizedDate);

      return {
        ...task,
        ...normalizedDetails,
      };
    });
  });
  const [text, setText] = useState<string>('');
  const [numberMessages, setNumberMessages] = useState<numberMessagesProps[]>([]);
  const [detailsPopup, setDetailsPopup] = useState<DetailsPopupStateProps>({
    isMounted: false,
    isVisible: false,
    left: 0,
    top: 0,
    detailsDate: "",
    detailsTime: "",
  });
  const [sorting, setSorting] = useState<string>('customer');
  const prevTasksRef = useRef(tasks);
  const numberMessagesRef = useRef(numberMessages);
  const exitingMessageIdsRef = useRef<Set<string>>(new Set());
  const detailsPopupRef = useRef<HTMLDivElement>(null);
  const activeDetailsTaskIdRef = useRef<string | null>(null);
  const transitionInProgressRef = useRef(false);

  // Saves tasks to localStorage whenever the list changes.
  useEffect(() => {
    if (prevTasksRef.current !== tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    prevTasksRef.current = tasks;
  }, [tasks]);

  // Keeps a ref in sync so timeout callbacks can read the latest toast list.
  useEffect(() => {
    numberMessagesRef.current = numberMessages;
  }, [numberMessages]);

  // Clears any pending toast timers when the app unmounts.
  useEffect(() => {
    return () => {
      numberMessagesRef.current.forEach((messageItem) => {
        if (messageItem.timeOut) clearTimeout(messageItem.timeOut);
        if (messageItem.deleteTimeout) clearTimeout(messageItem.deleteTimeout);
      });
    };
  }, []);

  // Creates a new task, adds it to the list, and shows a matching toast.
  const addTask = () => {
    if (!text.trim()) return;

    const newTask: TasksListProps = {
      id: uuidv4(),
      text,
      completed: false,
      isEditing: false,
      isDeleting: false,
      isRestored: false,
      ...createTaskDetails(),
    };

    const add = () => {
      setTasks([...tasks, newTask]);
    };

    const msgId = message(add, newTask.id);
    setNumberMessages((prevArr) =>
      prevArr.map((messageItem) =>
        messageItem.id === msgId ? { ...messageItem, text: 'Task added' } : messageItem
      )
    );

    setText('');
  };

  // Runs a task action and creates an undoable toast that remembers the previous task list.
  const message = (
    action: () => void,
    _taskId: string,
    prevTasksOverride?: TasksListProps[]
  ) => {
    const rawPrev: TasksListProps[] = prevTasksOverride ?? prevTasksRef.current;
    const prev = rawPrev.map((task) => ({ ...task }));

    const msgId = uuidv4();
    const autoCloseTimeout = setTimeout(() => {
      const element = document.querySelector(`[data-message-id='${msgId}']`) as HTMLElement | null;
      startExit(msgId, element);
    }, TOAST_LIFETIME_MS);

    const newMessage: numberMessagesProps = {
      id: msgId,
      text: 'Task edited',
      style: { opacity: 0, transform: 'translateY(-100px)', display: 'flex' },
      timeOut: autoCloseTimeout,
      prevTasks: prev,
    };

    setNumberMessages((prevArr) => [...prevArr, newMessage]);

    action();

    requestAnimationFrame(() => {
      setNumberMessages((prevArr) =>
        prevArr.map((messageItem) =>
          messageItem.id === msgId
            ? {
              ...messageItem,
              style: { ...messageItem.style, opacity: 1, transform: 'translateY(0) scale(1)' },
            }
            : messageItem
        )
      );
    });

    return msgId;
  };

  // Animates a toast out, removes it, and restores tasks if the user clicked Undo.
  const startExit = (messageId: string, element: HTMLElement | null) => {
    const messageItem = numberMessagesRef.current.find((item) => item.id === messageId);
    if (!messageItem || messageItem.isExiting || exitingMessageIdsRef.current.has(messageId)) return;

    exitingMessageIdsRef.current.add(messageId);

    if (messageItem.timeOut) clearTimeout(messageItem.timeOut);
    if (messageItem.deleteTimeout) clearTimeout(messageItem.deleteTimeout);

    const measuredHeight = element?.offsetHeight ?? 0;

    setNumberMessages((prev) =>
      prev.map((messageItem) =>
        messageItem.id === messageId
          ? {
            ...messageItem,
            isExiting: true,
            style: {
              ...messageItem.style,
              overflow: 'hidden',
              maxHeight: measuredHeight ? `${measuredHeight}px` : '120px',
            },
          }
          : messageItem
      )
    );

    requestAnimationFrame(() => {
      setNumberMessages((prev) =>
        prev.map((messageItem) =>
          messageItem.id === messageId
            ? {
              ...messageItem,
              style: {
                ...messageItem.style,
                opacity: 0,
                maxHeight: '0px',
                padding: '0px',
                margin: '0px',
                transform: 'translateX(-100px) scale(0.8)',
              },
            }
            : messageItem
        )
      );
    });

    setTimeout(() => {
      const exitingMessage = numberMessagesRef.current.find((item) => item.id === messageId);

      if (exitingMessage?.didUndo && exitingMessage.prevTasks) {
        const restoredTasks = exitingMessage.prevTasks.map((task) => ({ ...task, isRestored: true }));
        setTasks(restoredTasks);
        setTimeout(() => {
          setTasks((prev) => prev.map((task) => ({ ...task, isRestored: false })));
        }, 400);
      }

      setNumberMessages((prev) => prev.filter((messageItem) => messageItem.id !== messageId));
      exitingMessageIdsRef.current.delete(messageId);
    }, TOAST_EXIT_DURATION_MS);
  };

  // Starts closing the details popup and resets which task is currently active.
  const hideDetailsPopup = useCallback(() => {
    if (!detailsPopup.isVisible) return;

    transitionInProgressRef.current = true;
    activeDetailsTaskIdRef.current = null;
    setDetailsPopup((prev) => ({ ...prev, isVisible: false }));
  }, [detailsPopup.isVisible]);

  // Opens the details popup near the clicked task button and fills it with that task's metadata.
  const handleDetailsClick = (task: TasksListProps, event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;

    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation?.();

    if (detailsPopup.isVisible && activeDetailsTaskIdRef.current === task.id) {
      hideDetailsPopup();
      return;
    }

    transitionInProgressRef.current = true;
    activeDetailsTaskIdRef.current = task.id;

    setDetailsPopup((prev) => ({
      ...prev,
      isMounted: true,
      isVisible: prev.isMounted ? prev.isVisible : false,
      detailsDate: task.detailsDate,
      detailsTime: task.detailsTime,
    }));

    requestAnimationFrame(() => {
      const popupElement = detailsPopupRef.current;
      const buttonRect = button.getBoundingClientRect();
      const itemRect = button.closest('.todo-item')?.getBoundingClientRect();

      if (!popupElement || !itemRect) {
        transitionInProgressRef.current = false;
        return;
      }

      const popupRect = popupElement.getBoundingClientRect();

      let left = buttonRect.left + buttonRect.width / 2 - popupRect.width / 2;
      let top = itemRect.top - popupRect.height - 10;

      if (left < 10) left = 10;
      if (left + popupRect.width > window.innerWidth - 10) {
        left = window.innerWidth - popupRect.width - 10;
      }
      if (top < 10) top = 10;

      setDetailsPopup((prev) => ({
        ...prev,
        isMounted: true,
        isVisible: true,
        left,
        top,
        detailsDate: task.detailsDate,
        detailsTime: task.detailsTime,
      }));
    });
  };

  // Closes the details popup when the user clicks anywhere outside it.
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        detailsPopup.isVisible &&
        !detailsPopupRef.current?.contains(target) &&
        !Array.from(document.querySelectorAll('.details-btn')).some((button) => button.contains(target))
      ) {
        hideDetailsPopup();
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [detailsPopup.isVisible, hideDetailsPopup]);


  console.log(tasks);
  return (
    <>
      <div className="container">
        <Title />
        <AddTask addTask={addTask} setText={setText} text={text} />
        <Filters setSorting={setSorting} sorting={sorting} />
        <ListTasks
          tasks={tasks}
          setTasks={setTasks}
          setNumberMessages={setNumberMessages}
          message={message}
          onDetailsClick={handleDetailsClick}
          sorting={sorting}
        />
        {detailsPopup.isMounted && (
          <div
            ref={detailsPopupRef}
            id="details-popup"
            className={detailsPopup.isVisible ? "show" : ""}
            style={{
              display: "block",
              position: "fixed",
              zIndex: 2000,
              left: `${detailsPopup.left}px`,
              top: `${detailsPopup.top}px`,
              background: "rgba(5, 5, 5, 0.95)",
              backdropFilter: "blur(20px)",
              padding: "12px 18px",
              borderRadius: "10px",
              color: "#00e7ff",
              boxShadow: "0 0 25px rgba(0, 231, 255, 0.6)",
              border: "1px solid rgba(0, 231, 255, 0.2)",
              fontSize: "0.95rem",
              textAlign: "center",
              lineHeight: 1.35,
              minWidth: "135px",
              boxSizing: "border-box",
            }}
            onTransitionEnd={(event) => {
              if (event.propertyName !== "opacity") return;

              if (detailsPopup.isVisible) {
                transitionInProgressRef.current = false;
                return;
              }

              setDetailsPopup((prev) => ({ ...prev, isMounted: false }));
              transitionInProgressRef.current = false;
            }}
          >
            Details:
            <br />
            {detailsPopup.detailsDate}
            <br />
            {detailsPopup.detailsTime}
          </div>
        )}
      </div>
      <UndoToast
        numberMessages={numberMessages}
        setNumberMessages={setNumberMessages}
        startExit={startExit}
      />
    </>
  );
}

export default App;
