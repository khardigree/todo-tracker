// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

function saveTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (!tasks) {
    tasks = [];
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  return tasks;
}

// Create a function to generate a unique task id
function generateTaskId() {
  return Math.random().toString(36).substr(2, 9);
}

const taskID = generateTaskId();
console.log(taskID);

// Create a function to create a task card
function createTaskCard(task) {
  const taskCard = $("<div>")
    .addClass("card task-card draggable")
    .attr("id", task.id);
  const cardHeader = $("<div>").addClass("card-header").text(task.title);
  const cardDescription = $("<p>").addClass("card-text").text(task.description);
  const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
  const cardBody = $("<div>").addClass("card-body");
  const deleteButton = $("<button>")
    .addClass("btn btn-danger delete-task")
    .text("Delete")
    .attr("id", task.id);
  deleteButton.on("click", handleDeleteTask);

  if (task.dueDate && task.status !== "completed") {
    const now = dayjs();
    const dueDate = dayjs(task.dueDate, "YYYY-MM-DD");

    if (now.isSame(dueDate, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(dueDate)) {
      taskCard.addClass("bg-danger text-white");
      deleteButton.addClass("border-light");
    }
  }
  cardBody.append(cardDueDate, deleteButton, cardDescription);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

function grabTasks() {
  const tasks = saveTasks();

  const todoList = $("#todo-cards");
  todoList.empty();

  const inProgressList = $("#in-progress-cards");
  inProgressList.empty();

  const doneList = $("#done-cards");
  doneList.empty();

  for (let task of taskList) {
    if (task.status === "to-do") {
      todoList.append(createTaskCard(task));
    } else if (task.status === "in-progress") {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === "completed") {
      doneList.append(createTaskCard(task));
    }
  }
}

$(".draggable").draggable({
  opacity: 0.7,
  zIndex: 1000,
  helper: function (e) {
    const original = $(e.target).hasClass("draggable")
      ? $(e.target)
      : $(e.target).closest(".draggable");
    return original.clone().css({ width: original.width() });
  },
});

// Create a function to render the task list and make cards draggable
function renderTaskList() {
  taskList.forEach((task) => {
    const taskCard = createTaskCard(task);
    $(`#${task.status}-tasks`).append(taskCard);
  });
  $(".draggable").draggable({ revert: "invalid", helper: "clone" });
}

// Create a function to handle adding a new task
function handleAddTask(title, description, dueDate) {
  if (title && description) {
    const newTask = {
      id: generateTaskId(),
      title: title,
      description: description,
      dueDate: dueDate,
      status: "to-do",
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("modal-button")
    .addEventListener("click", function () {
      const title = document.getElementById("taskName").value;
      const description = document.getElementById("taskDescription").value;
      const dueDate = document.getElementById("dueDate").value;
      handleAddTask(title, description, dueDate);
    });
});

// Create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskID = $(this).attr("id");
  const tasks = saveTasks();

  tasks.forEach((task) => {
    if (task.id === taskID) {
      const index = tasks.indexOf(task);
      tasks.splice(index, 1);
    }
  });
  grabTasks();
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const tasks = saveTasks();
  const taskID = ui.draggable.attr("id");
  const newStatus = $(this).attr("id");

  for (let task of tasks) {
    if (task.id === taskID) {
      task.status = newStatus;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  grabTasks();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  saveTasks();
  renderTaskList();

  $("#dueDate").datepicker({
    changeMonth: true,
    changeYear: true,
  });
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
});
