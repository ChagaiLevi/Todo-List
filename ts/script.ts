// Select HTML elements
const newTaskInput: HTMLInputElement = document.querySelector('.todo-input') as HTMLInputElement;
const addTaskButton: HTMLButtonElement = document.querySelector('.todo-add-button') as HTMLButtonElement;
const todoListContainer: HTMLUListElement = document.querySelector('.todo-list') as HTMLUListElement;

// Define the structure of a task item
type Item = { text: string, completed: boolean };
type todoList = Item[];

// Initialize the task list
let todoList: todoList = [];

// Render existing tasks and set event listeners
convertTask();
addEventListenersToButtons('todo-complete-button', markAsCompleted);
addEventListenersToButtons('todo-delete-button', removeTask);

// Load tasks from local storage if available
localStorage.getItem('todoList') ? todoList = JSON.parse(localStorage.getItem('todoList') as string) : null;

// Add event listeners for adding tasks
addTaskButton.addEventListener('click', addTask);
newTaskInput.addEventListener('keyup', (event) => {
  event.key === 'Enter' ? addTask() : null;
});

// Add a new task to the list
function addTask(): void {
  const text: string = newTaskInput.value;

  // Prevent adding empty tasks
  if (text.trim() === '') {
    return;
  }

  newTaskInput.value = '';
  todoList.push({ text, completed: false });

  // Update the task list and event listeners
  convertTask();
  addEventListenersToButtons('todo-complete-button', markAsCompleted);
  addEventListenersToButtons('todo-delete-button', removeTask);

  // Save updated task list to local storage
  localStorage.getItem('todoList') ? localStorage.setItem('todoList', JSON.stringify(todoList)) : null;
}

// Render tasks in the list
function convertTask(): void {
  todoListContainer.innerHTML = '';

  todoList.forEach((task: Item, index: number) => {
    todoListContainer.innerHTML +=
      `<li class="todo-item${index}">
        <span class="todo-item-text">${task.text}</span>
        <div class="todo-item-buttons">
          <button class="todo-complete-button${index} ${task.completed === true ? 'completed' : ''}">✔</button>
          <button class="todo-delete-button${index}">✖</button>
        </div>
      </li>`;
  });
}

// Add event listeners to dynamically created buttons
function addEventListenersToButtons(clas: string, func: any): void {
  let classes: NodeListOf<HTMLLIElement> = document.querySelectorAll(`[class^="${clas}"]`) as NodeListOf<HTMLLIElement>;

  classes.forEach(className => {
    className.addEventListener('click', (event: Event) => func(event));
  });
}

// Mark a task as completed or uncompleted
function markAsCompleted(event: any): void {
  let className: string = event.target.classList[0];

  const completedC: HTMLButtonElement = document.querySelector(`.${className}`) as HTMLButtonElement;

  const match: any = className.match(/\d+/);
  const number = parseInt(match[0], 10);

  let completed: boolean = todoList[number].completed;

  if (!completed) {
    completedC.classList.add('completed');
    todoList[number].completed = true;
    completed = true;
  }
  else {
    completedC.classList.remove('completed');
    todoList[number].completed = false;
    completed = false;
  }

  // Update local storage
  localStorage.getItem('todoList') ? localStorage.setItem('todoList', JSON.stringify(todoList)) : null;
}

// Remove a task from the list
function removeTask(event: any): void {
  let className: string = event.target.classList[0];
  let number = 0;

  // Extract the index from the class name
  for (let i = 0; i < className.length; i++) {
    if (!isNaN(parseInt(className[i]))) {
      number = Number(className[i]);
    }
  }

  // Remove the task from the array
  number === 0 ? todoList.splice(0, 1) : todoList.splice(number, number);

  // Update the task list and event listeners
  convertTask();
  addEventListenersToButtons('todo-complete-button', markAsCompleted);
  addEventListenersToButtons('todo-delete-button', removeTask);

  // Save updated task list to local storage
  localStorage.getItem('todoList') ? localStorage.setItem('todoList', JSON.stringify(todoList)) : null;
}