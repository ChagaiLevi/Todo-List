const taskInputC: HTMLInputElement = document.querySelector('.todo-input') as HTMLInputElement;
const addTaskBtnC: HTMLButtonElement = document.querySelector('.todo-add-button') as HTMLButtonElement;
const todoListC: HTMLUListElement = document.querySelector('.todo-list') as HTMLUListElement;
let todoList: any = [];
convertTask();
convertClass('todo-complete-button', comp);
convertClass('todo-delete-button', rem);

if (localStorage.getItem('todoList')) {
  todoList = JSON.parse(localStorage.getItem('todoList') as string);
}

addTaskBtnC.addEventListener('click', addTask);
taskInputC.addEventListener('keyup', (event) => {
  event.key === 'Enter' ? addTask() : null;
});

function addTask(): void {
  const text: string = taskInputC.value;

  if (text.trim() === '') {
    return;
  }

  taskInputC.value = '';
  todoList.unshift({ text, completed: false });

  convertTask();
  convertClass('todo-complete-button', comp);
  convertClass('todo-delete-button', rem);

  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function convertTask(): void {
  todoListC.innerHTML = '';

  todoList.forEach((task: { text: string, completed: boolean }, index: number) => {
    todoListC.innerHTML += `
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

function convertClass(clas: string, func: any): void {
  let classes: NodeListOf<HTMLLIElement> = document.querySelectorAll(`[class^="${clas}"]`) as NodeListOf<HTMLLIElement>;

  classes.forEach(className => {
    className.addEventListener('click', (event: Event) => func(event));
  });
}


function comp(event: any): void {
  let number = 0;
  let className: string = event.target.classList[0];

  const completedC: HTMLButtonElement = document.querySelector(`.${className}`) as HTMLButtonElement;

  for (let i = 0; i < className.length; i++) {
    if (!isNaN(parseInt(className[i]))) {
      number = Number(className[i]);
    }
  }

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

  localStorage.setItem('todoList', JSON.stringify(todoList));
}
function rem(event: any): void {
  let number = 0;
  let className: string = event.target.classList[0];

  for (let i = 0; i < className.length; i++) {
    if (!isNaN(parseInt(className[i]))) {
      number = Number(className[i]);
    }
  }
  /*const element: HTMLLIElement = document.querySelector(`.todo-item${number}`) as HTMLLIElement;
  element.remove();*/
  number === 0 ? todoList.splice(0, 1) : todoList.splice(number, number);

  convertTask();
  convertClass('todo-complete-button', comp);
  convertClass('todo-delete-button', rem);
  localStorage.setItem('todoList', JSON.stringify(todoList));
}