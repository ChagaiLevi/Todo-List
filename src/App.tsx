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

function App() {
  const [tasks, setTasks] = useState<TasksListProps[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [text, setText] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [prevTasks, setPrevTasks] = useState<TasksListProps[]>([]);
  const [timeOut, setTimeOut] = useState<any>(null);
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

    setTasks([...tasks, newTask]);
    setText('');
  }

  return (
    <div className="container">
      <Title />
      <AddTask addTask={addTask} setText={setText} text={text} />
      <ListTasks tasks={tasks} setTasks={setTasks} className={className} setClassName={setClassName} setprevTask={setPrevTasks} setTimeOut={setTimeOut} />
      <UndoToast setTasks={setTasks} className={className} setClassName={setClassName} prevTasks={prevTasks} timeOut={timeOut} />
    </div>
  )
}

export default App