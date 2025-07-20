import Title from "./Components/Title"
import AddTask from "./Components/AddTask"
import ListTasks from "./Components/ListTasks"
import { useState, useEffect } from 'react';

export type TasksListProps = {
  id: string;
  text: string;
  completed: boolean;
  isEditing: boolean;
}

function App() {
  const [tasks, setTasks] = useState<TasksListProps[]>([
    { id: '1', text: 'Sample Task 1', completed: false, isEditing: false },
    { id: '2', text: 'Sample Task 2', completed: true, isEditing: false },
    { id: '3', text: 'Sample Task 3', completed: false, isEditing: false }
  ]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));

    /*const editButtons: NodeListOf<HTMLParagraphElement> = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const item: any = button.closest('.todo-item');
        const taskText = item.querySelector('.task-text');
        const currentText = taskText.textContent;

        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-input';
        input.value = currentText;

        // Replace p with input
        taskText.replaceWith(input);
        input.focus();

        // Function to save and revert to p
        const saveTask = () => {
          const newText = input.value.trim();
          const newP = document.createElement('p');
          newP.className = 'task-text';
          newP.textContent = newText || currentText; // Use original text if empty
          input.replaceWith(newP);
        };

        // Save on blur
        input.addEventListener('blur', saveTask);

        // Save on Enter key
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            saveTask();
          }
        });
      });
    });*/
  }, [tasks]);

  //document.addEventListener('DOMContentLoaded', () => {

  //});




  return (
    <div className="container">
      <Title />
      <AddTask />
      <ListTasks tasks={tasks} setTasks={setTasks} />
    </div>
  )
}

export default App