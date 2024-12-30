const taskInputC: HTMLInputElement = document.querySelector('.todo-input') as HTMLInputElement;
const addTaskBtnC: HTMLButtonElement = document.querySelector('.todo-add-button') as HTMLButtonElement;
const todoListC: HTMLUListElement = document.querySelector('.todo-list') as HTMLUListElement;
let todoList = [
  { text: 'Task 1', completed: false },
  { text: 'Task 2', completed: true },
  { text: 'Task 3', completed: false }
];

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
}

function convertTask(): void {
  todoListC.innerHTML = '';
  todoList.forEach((task: { text: string, completed: boolean }, index: number) => {
    todoListC.innerHTML += `
      <li class="todo-item${index}">
        <span class="todo-item-text">${task.text}</span>
        <div class="todo-item-buttons">
          <button class="todo-complete-button${index}">✔</button>
          <button class="todo-delete-button${index}">✖</button>
        </div>
      </li>
    `;
  });
}

convertTask();

function convertClass(clas: string, func: any): void {
  func;
  let classesTest: NodeListOf<HTMLLIElement> = document.querySelectorAll(`[class^="${clas}"]`) as NodeListOf<HTMLLIElement>;
  const classes = Array.from(classesTest).map(el => el.className).filter(className => new RegExp(`^${clas}\\d+$`).test(className));

  classes.forEach(className => {
    const cl: HTMLLIElement = document.querySelector(`.${className}`) as HTMLLIElement;
    cl.addEventListener('click', (event: Event) => func(event));
  });
}

let completed = false;
function comp(event: any): void {
  let number = 0;
  let className: string = event.target.classList[0];
  const completedC: HTMLButtonElement = document.querySelector(`.${className}`) as HTMLButtonElement;

  for (let i = 0; i < className.length; i++) {
    if (!isNaN(parseInt(className[i]))) {
      number = Number(className[i]);
    }
  }
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
  convertClass('todo-delete-button', rem);

  console.log(todoList[number]);
  console.log(number);

  console.log(todoList)

  //todoList.splice(number, 1);
}

// const todoElements: any = convertClass('todo-item', null, true);
// todoElements.forEach((el: HTMLLIElement) => {});
convertClass('todo-complete-button', comp);
convertClass('todo-delete-button', rem);