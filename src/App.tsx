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
  prevTasks?: TasksListProps[];   // <-- add this
}

function App() {
  const [tasks, setTasks] = useState<TasksListProps[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [text, setText] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [prevTasks, setPrevTasks] = useState<TasksListProps[]>([]);
  const [timeOut, setTimeOut] = useState<any>(null);
  const [messageText, setMessageText] = useState<string>('');
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

    // clone before starting delete animation so undo restores the real previous state
    setPrevTasks(tasks.map(t => ({ ...t })));
    // setTasks(tasks.map(task =>
    //   task.id === id ? { ...task, isDeleting: true } : task
    // ));

    setPrevTasks(tasks.map(t => ({ ...t })));
    setTasks([...tasks, newTask]);

    let newMessage: numberMessagesProps = {
      id: newTask.id,
      text: 'Task added',
      style: { opacity: 0, transform: 'translateY(-100px)', display: 'flex' },
      timeOut: undefined,
      prevTasks: tasks.map(t => ({ ...t }))
    };

    // append the message using functional update
    setNumberMessages(prev => [...prev, newMessage]);

    // animate in via state update (no direct mutation)
    requestAnimationFrame(() => {
      setNumberMessages(prev => prev.map(m =>
        m.id === newMessage.id ? { ...m, style: { ...m.style, opacity: 1, transform: 'translateY(0) scale(1)' } } : m
      ));
    });

    setMessageText('Task deleted');
    setClassName('entering');

    // set timeout for automatic exit — store timeout id on the message via functional update
    setNumberMessages(prev => prev.map(m =>
      m.id === newMessage.id ? {
        ...m,
        timeOut: setTimeout(() => {
          const el = document.querySelector(`[data-message-id="${newMessage.id}"]`) as HTMLElement | null;
          startExit(newMessage.id, el);
        }, 5000)
      } : m
    ));

    setText('');
  }

  useEffect(() => { console.log(prevTasks); }, [prevTasks]);

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
      <ListTasks tasks={tasks} setTasks={setTasks} setClassName={setClassName} setprevTask={setPrevTasks} setTimeOut={setTimeOut} setMessageText={setMessageText} numberMessages={numberMessages} setNumberMessages={setNumberMessages} startExit={startExit} />
      <UndoToast setTasks={setTasks} className={className} setClassName={setClassName} prevTasks={prevTasks} timeOut={timeOut} messageText={messageText} numberMessages={numberMessages} setNumberMessages={setNumberMessages} startExit={startExit} />
    </div>
  )
}

export default App