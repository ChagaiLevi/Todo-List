import Title from "./Components/Title"
import AddTask from "./Components/AddTask"
import ListTasks from "./Components/ListTasks"
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type TasksListProps = {
  id: string;
  text: string;
  completed: boolean;
  isEditing: boolean;
}

function App() {
  const [tasks, setTasks] = useState<TasksListProps[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [text, setText] = useState<string>('');
  const prevTasks = useRef(tasks);

  //useEffect(() => { }, []);
  useEffect(() => {
    if (prevTasks.current !== tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    prevTasks.current = tasks;
  }, [tasks]);

  const addTask: () => void = () => {
    if (text.trim() === '') return;

    const newTask: TasksListProps = {
      id: uuidv4(),
      text,
      completed: false,
      isEditing: false
    };

    setTasks([...tasks, newTask]);
    setText('');
  }

  return (
    <div className="container">
      <Title />
      <AddTask addTask={addTask} setText={setText} text={text} />
      <ListTasks tasks={tasks} setTasks={setTasks} />
    </div>
  )
}

export default App