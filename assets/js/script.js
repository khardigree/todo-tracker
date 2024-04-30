// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (!nextId) {
        nextId = 1;
    } else {
        nextId++;
    }
    return nextId;
}
generateTaskId();
// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = document.createElement("div");
    card.classList.add("task-card");
    
    const title = document.createElement("h3");
    title.textContent = task.title;
    card.appendChild(title);
    
    const description = document.createElement("p");
    description.textContent = task.description;
    card.appendChild(description);
    
    const dueDate = document.createElement("p");
    dueDate.textContent = "Due Date: " + task.dueDate;
    card.appendChild(dueDate);
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", handleDeleteTask);
    card.appendChild(deleteButton);
    
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
