// All the classes:
const newTaskInput: HTMLInputElement = document.querySelector('.todo-input') as HTMLInputElement;
const addTaskButton: HTMLButtonElement = document.querySelector('.todo-add-button') as HTMLButtonElement;
const todoListContainer: HTMLUListElement = document.querySelector('.todo-list') as HTMLUListElement;

// The types for the todoList array:
type Item = { text: string, completed: boolean };
type todoList = Item[];

let todoList: todoList = [];

// Function to convert the class name based on the index:
convertTask();
addEventListenersToButtons('todo-complete-button', markAsCompleted);
addEventListenersToButtons('todo-delete-button', removeTask);

// Get the todoList from the localStorage:
localStorage.getItem('todoList') ? todoList = JSON.parse(localStorage.getItem('todoList') as string) : null;

// Add event listeners:
addTaskButton.addEventListener('click', addTask);
newTaskInput.addEventListener('keyup', (event) => {
  event.key === 'Enter' ? addTask() : null;
});

// Functions:
function addTask(): void {
  // Get the value of the input:

  const text: string = newTaskInput.value;

  // Check if the input is empty:
  if (text.trim() === '') {
    return;
  }

  // Add the task to the todoList:
  newTaskInput.value = '';
  todoList.push({ text, completed: false });

  // Convert the task and update the class names:
  convertTask();
  addEventListenersToButtons('todo-complete-button', markAsCompleted);
  addEventListenersToButtons('todo-delete-button', removeTask);
  // Save the todoList to the localStorage:
  localStorage.getItem('todoList') ? localStorage.setItem('todoList', JSON.stringify(todoList)) : null;
}

function convertTask(): void {
  // Clear the todoListClass:
  todoListContainer.innerHTML = '';

  // Convert the todoList array to the HTML:
  todoList.forEach((task: Item, index: number) => {
    todoListContainer.innerHTML += `
      <li class="todo-item${index}">
        <span class="todo-item-text">${task.text}</span>
        <div class="todo-item-buttons">
          <button class="todo-complete-button${index} ${task.completed === true ? 'completed' : ''}">✔</button>
          <button class="todo-delete-button${index}">✖</button>
        </div>
      </li>
    `;
  });
}

function addEventListenersToButtons(clas: string, func: any): void {
  // Get all the classes that start with the given class name:
  let classes: NodeListOf<HTMLLIElement> = document.querySelectorAll(`[class^="${clas}"]`) as NodeListOf<HTMLLIElement>;

  // Add an event listener to each class
  classes.forEach(className => {
    className.addEventListener('click', (event: Event) => func(event));
  });
}


function markAsCompleted(event: any): void {
  // fing the class name from the event:
  let className: string = event.target.classList[0];

  const completedC: HTMLButtonElement = document.querySelector(`.${className}`) as HTMLButtonElement;

  const match: any = className.match(/\d+/);
  const number = parseInt(match[0], 10);

  let completed: boolean = todoList[number].completed;

  // if the task is not completed, add the completed class to the button and set the completed property to true:
  if (!completed) {
    completedC.classList.add('completed');
    todoList[number].completed = true;
    completed = true;
  }
  // if the task is completed, remove the completed class from the button and set the completed property to false:
  else {
    completedC.classList.remove('completed');
    todoList[number].completed = false;
    completed = false;
  }
  // save the todoList to the localStorage:
  localStorage.getItem('todoList') ? localStorage.setItem('todoList', JSON.stringify(todoList)) : null;
}
function removeTask(event: any): void {
  // find the class name from the event:
  let className: string = event.target.classList[0];
  // find the index of the class name in the todoList array:
  let number = 0;

  for (let i = 0; i < className.length; i++) {
    if (!isNaN(parseInt(className[i]))) {
      number = Number(className[i]);
    }
  }

  // remove the task from the todoList array:
  // if the number is 0, remove the first element from the array:
  // if the number is not 0, remove the element at the index of the number:
  number === 0 ? todoList.splice(0, 1) : todoList.splice(number, number);

  // convert the task and update the class names:
  convertTask();
  addEventListenersToButtons('todo-complete-button', markAsCompleted);
  addEventListenersToButtons('todo-delete-button', removeTask);

  // save the todoList to the localStorage:
  localStorage.getItem('todoList') ? localStorage.setItem('todoList', JSON.stringify(todoList)) : null;
}