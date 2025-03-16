"use strict";
// Select HTML elements
const newTaskInput = document.querySelector('#new-task');
const addTaskButton = document.querySelector('#add-btn');
const todoListContainer = document.querySelector('.todo-list');
// Initialize the task list
let todoList = [];
// Load tasks from local storage if available
localStorage.getItem('todoList') ? todoList = JSON.parse(localStorage.getItem('todoList')) : null;
// Render existing tasks and set event listeners
convertTask();
addEventListenersToButtons('complete-btn', markAsCompleted);
addEventListenersToButtons('delete-btn', removeTask);
editTask();
// Add event listeners for adding tasks
addTaskButton.addEventListener('click', addTask);
newTaskInput.addEventListener('keyup', (event) => {
    event.key === 'Enter' ? addTask() : null;
});
// Add a new task to the list
function addTask() {
    const text = newTaskInput.value;
    // Prevent adding empty tasks
    if (text.trim() === '') {
        return;
    }
    newTaskInput.value = '';
    todoList.push({ text, completed: false });
    // Update the task list and event listeners
    convertTask();
    addEventListenersToButtons('complete-btn', markAsCompleted);
    addEventListenersToButtons('delete-btn', removeTask);
    editTask();
    // Save updated task list to local storage
    localStorage.getItem('todoList') ? localStorage.setItem('todoList', JSON.stringify(todoList)) : null;
}
// Render tasks in the list
function convertTask() {
    if (todoList.length === 0) {
        todoListContainer.innerHTML = `<div class="no-task">No tasks found!</div>`;
        return;
    }
    todoListContainer.innerHTML = '';
    todoList.forEach((task, index) => {
        todoListContainer.innerHTML += `
      <div class="todo-item${index}">
        <p class="task-text">${task.text}</p>
        <div class="actions">
          <button class="edit-btn${index}">✎</button>
          <button class="complete-btn${index} ${task.completed === true ? 'completed' : ''}">✔</button>
          <button class="delete-btn${index}">✖</button>
        </div>
      </div>
      `;
    });
}
// Add event listeners to dynamically created buttons
function addEventListenersToButtons(clas, func) {
    let classes = document.querySelectorAll(`[class^="${clas}"]`);
    classes.forEach(className => {
        className.addEventListener('click', (event) => func(event));
    });
}
// Mark a task as completed or uncompleted
function markAsCompleted(event) {
    let className = event.target.classList[0];
    const completedC = document.querySelector(`.${className}`);
    const match = className.match(/\d+/);
    const number = parseInt(match[0], 10);
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
    // Update local storage
    localStorage.getItem('todoList') ? localStorage.setItem('todoList', JSON.stringify(todoList)) : null;
}
// Remove a task from the list
function removeTask(event) {
    let className = event.target.classList[0];
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
    addEventListenersToButtons('complete-btn', markAsCompleted);
    addEventListenersToButtons('delete-btn', removeTask);
    editTask();
    // Save updated task list to local storage
    localStorage.getItem('todoList') ? localStorage.setItem('todoList', JSON.stringify(todoList)) : null;
}
function editTask() {
    let classes = document.querySelectorAll(`[class^="edit-btn"]`);
    let textclasses = document.querySelectorAll(`[class^="task-text"]`);
    classes.forEach((className, index) => {
        className.addEventListener('click', () => {
            const existingInput = document.querySelector(".edit-input");
            if (existingInput)
                return;
            const input = document.createElement("input");
            input.type = "text";
            input.value = textclasses[index].textContent || "";
            input.className = "edit-input";
            input.classList.add("todo-item-input");
            textclasses[index].replaceWith(input);
            input.focus();
            input.addEventListener("blur", () => {
                if (input.value === '') {
                    textclasses[index].textContent = todoList[index].text;
                    input.replaceWith(textclasses[index]);
                    return;
                }
                textclasses[index].textContent = input.value;
                input.replaceWith(textclasses[index]);
                todoList[index].text = input.value;
                localStorage.setItem("todoList", JSON.stringify(todoList));
            });
            input.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    textclasses[index].textContent = input.value;
                    input.replaceWith(textclasses[index]);
                    todoList[index].text = input.value;
                    localStorage.setItem("todoList", JSON.stringify(todoList));
                }
            });
        });
    });
}
