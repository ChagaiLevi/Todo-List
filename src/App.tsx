import Title from "./Components/Title"
import AddTask from "./Components/AddTask"
import ListTasks from "./Components/ListTasks"
import UndoToast from "./Components/UndoToast";
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type TasksListProps = {
  id: string;
  text: string;
  completed: boolean;
  isEditing: boolean;
  isDeleting: boolean;
}

export type numberMessagesProps = {
  id: string;
  text: string;
  style: React.CSSProperties;
  timeOut: any;
  prevTasks: TasksListProps[];
}

function App() {
  const [tasks, setTasks] = useState<TasksListProps[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [text, setText] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [numberMessages, setNumberMessages] = useState<numberMessagesProps[]>([]);
  const prevTasksRef = useRef(tasks);

  useEffect(() => {
    if (prevTasksRef.current !== tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    prevTasksRef.current = tasks;
  }, [tasks]);

  const addTask: () => void = () => {
    if (!text.trim()) return;

    const newTask: TasksListProps = {
      id: uuidv4(),
      text,
      completed: false,
      isEditing: false,
      isDeleting: false
    };

    const add: () => void = () => {
      setTasks([...tasks, newTask]);
    };

    message(add, newTask.id);

    setText('');
  }

  const message: (
    action: () => void,
    taskId: string,
    prevTasksOverride?: TasksListProps[]
  ) => void = (action, prevTasksOverride) => {
    const prev: any = prevTasksOverride ?? prevTasksRef.current;

    const msgId = uuidv4();

    const newMessage: numberMessagesProps = {
      id: msgId,
      text: 'Task edited',
      style: { opacity: 0, transform: 'translateY(-100px)', display: 'flex' },
      timeOut: undefined,
      prevTasks: prev,
    };

    setNumberMessages(prevArr => [...prevArr, newMessage]);

    action();

    requestAnimationFrame(() => {
      setNumberMessages(prevArr =>
        prevArr.map(m =>
          m.id === msgId
            ? { ...m, style: { ...m.style, opacity: 1, transform: 'translateY(0) scale(1)' } }
            : m
        )
      );
    });

    setNumberMessages(prevArr =>
      prevArr.map(m =>
        m.id === msgId
          ? {
            ...m,
            timeOut: setTimeout(() => {
              const el = document.querySelector(
                `[data-message-id="${msgId}"]`
              ) as HTMLElement | null;
              startExit(msgId, el);
            }, 5000)
          }
          : m
      )
    );
  }

  const startExit = (messageId: string, el: any) => {
    if (!el) return;

    setNumberMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, style: { ...m.style, maxHeight: `${el.offsetHeight}px` } } : m
    ));
    requestAnimationFrame(() => {
      setNumberMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, style: { ...m.style, maxHeight: '0px', padding: '0px', margin: '0px', transform: 'translateX(-100px) scale(0.8)' } } : m
      ));
    });
  };

  return (
    <div className="container">
      <Title />
      <AddTask addTask={addTask} setText={setText} text={text} />
      <ListTasks tasks={tasks} setTasks={setTasks} setClassName={setClassName} setNumberMessages={setNumberMessages} startExit={startExit} message={message} />
      <UndoToast setTasks={setTasks} className={className} setClassName={setClassName} numberMessages={numberMessages} setNumberMessages={setNumberMessages} startExit={startExit} />
    </div>
  )
}

export default App