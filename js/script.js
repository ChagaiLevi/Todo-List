"use strict";
// All the classes:
const taskInputC = document.querySelector('.todo-input');
const addTaskBtnC = document.querySelector('.todo-add-button');
const todoListC = document.querySelector('.todo-list');
let todoList = [];
// Function to convert the class name based on the index:
convertTask();
convertClass('todo-complete-button', comp);
convertClass('todo-delete-button', rem);
// Get the todoList from the localStorage:
if (localStorage.getItem('todoList')) {
    todoList = JSON.parse(localStorage.getItem('todoList'));
}
// Add event listeners:
addTaskBtnC.addEventListener('click', addTask);
taskInputC.addEventListener('keyup', (event) => {
    event.key === 'Enter' ? addTask() : null;
});
// Functions:
function addTask() {
    // Get the value of the input:
    const text = taskInputC.value;
    // Check if the input is empty:
    if (text.trim() === '') {
        return;
    }
    // Add the task to the todoList:
    taskInputC.value = '';
    todoList.unshift({ text, completed: false });
    // Convert the task and update the class names:
    convertTask();
    convertClass('todo-complete-button', comp);
    convertClass('todo-delete-button', rem);
    // Save the todoList to the localStorage:
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
function convertTask() {
    // Clear the todoListClass:
    todoListC.innerHTML = '';
    // Convert the todoList array to the HTML:
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
function convertClass(clas, func) {
    // Get all the classes that start with the given class name:
    let classes = document.querySelectorAll(`[class^="${clas}"]`);
    // Add an event listener to each class
    classes.forEach(className => {
        className.addEventListener('click', (event) => func(event));
    });
}
function comp(event) {
    // fing the class name from the event:
    let className = event.target.classList[0];
    // find the index of the class name in the todoList array:
    let number = 0;
    const completedC = document.querySelector(`.${className}`);
    for (let i = 0; i < className.length; i++) {
        if (!isNaN(parseInt(className[i]))) {
            number = Number(className[i]);
        }
    }
    let completed = todoList[number].completed;
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
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
function rem(event) {
    // find the class name from the event:
    let className = event.target.classList[0];
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
    convertClass('todo-complete-button', comp);
    convertClass('todo-delete-button', rem);
    // save the todoList to the localStorage:
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
// The End
//# sourceMappingURL=script.js.map