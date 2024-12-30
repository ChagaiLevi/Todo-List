"use strict";
const taskInputC = document.querySelector('.todo-input');
const addTaskBtnC = document.querySelector('.todo-add-button');
const todoListC = document.querySelector('.todo-list');
let todoList = [];
if (localStorage.getItem('todoList')) {
    todoList = JSON.parse(localStorage.getItem('todoList'));
}
/*let todoList: any = [
  { text: 'Task 1', completed: false },
  { text: 'Task 2', completed: true },
  { text: 'Task 3', completed: false }
];*/
addTaskBtnC.addEventListener('click', addTask);
taskInputC.addEventListener('keyup', (event) => {
    event.key === 'Enter' ? addTask() : null;
});
function addTask() {
    const text = taskInputC.value;
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
function convertTask() {
    todoListC.innerHTML = '';
    todoList.forEach((task, index) => {
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
convertTask();
function convertClass(clas, func) {
    let classes = document.querySelectorAll(`[class^="${clas}"]`);
    classes.forEach(className => {
        className.addEventListener('click', (event) => func(event));
    });
}
function comp(event) {
    let number = 0;
    let className = event.target.classList[0];
    const completedC = document.querySelector(`.${className}`);
    for (let i = 0; i < className.length; i++) {
        if (!isNaN(parseInt(className[i]))) {
            number = Number(className[i]);
        }
    }
    let completed = todoList[number].completed;
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
function rem(event) {
    let number = 0;
    let className = event.target.classList[0];
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
    console.log(todoList[number]);
    console.log(number);
    console.log(todoList);
    //todoList.splice(number, 1);
}
// const todoElements: any = convertClass('todo-item', null, true);
// todoElements.forEach((el: HTMLLIElement) => {});
convertClass('todo-complete-button', comp);
convertClass('todo-delete-button', rem);
