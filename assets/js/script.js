    const projectFormEl = $('#modalForm');
    const projectNameInputEl = $('#taskName');
    const projectTypeInputEl = $('#taskDescription');
    const projectDateInputEl = $('#dueDate');
    const formModalEl = $('#formModal');
    const todoList = $('#todo-cards');
    const inProgressList = $('#in-progress-cards');
    const doneList = $('#done-cards');


// Retrieve tasks and nextId from localStorage
let task = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId = parseInt(localStorage.getItem('nextId')) || 1;
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

let taskList = getTasks();

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let nextId = parseInt(localStorage.getItem("nextId")) || 1;
    localStorage.setItem("nextId", nextId + 1);
    return nextId;

}

function displayTime() {
    const rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
    timeDisplayEl.text(rightNow);
  }

// Todo: create a function to create a task card
function createTaskCard(task) {
    // console.log('task', task);
    let card = $("<div>").addClass("card project-card my-3").attr("data-project-id", task.id);
    let cardHeader = $("<div>").addClass("card-header h5").text(task.taskName);
    let cardBody = $("<div>").addClass("card-body").text(task.taskDescription);
    let cardDueDate = $("<div>").addClass("card-text").text(task.dueDate);
    let cardCompleteBtn = $("<button>").addClass("btn btn-danger delete").text("Complete").attr("data-project-id", task.id); // Fix attribute name
    cardCompleteBtn.on("click", handleDeleteTask);
    let today = dayjs().startOf('day');
    let dueDate = dayjs(task.dueDate, 'DD-MM-YYYY').startOf('day');
    let daysDifference = dueDate.diff(today, 'day');

    // console.log('today', today);
    // console.log('dueDate', dueDate);

    if (daysDifference < 0) {
        card.addClass("bg-danger");
    }
    else if (daysDifference < 3) {
        card.addClass("bg-warning");
    }
    else {
        card.addClass("bg-white");
    }

    $(".card").addClass("draggable-element").draggable({
        revert: "invalid",
        stack: ".card"
    });

    

    if (task.dueDate && task.status !== 'done') {
        let now = dayjs();
        let taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
        
    if (now.isSame(taskDueDate, 'day')) {
        card.addClass('bg-warning text-white');
      } else if (now.isAfter(taskDueDate)) {
        card.addClass('bg-danger text-white');
        cardCompleteBtn.addClass('border-light');
      }
      }

    cardBody.append(cardDueDate, cardCompleteBtn);
    card.append(cardHeader, cardBody);

      return card;
}


// Todo: create a function to render the task list and make cards draggable

function renderTaskList() {
    let todoLane = $("#todo-cards");
    let inProgressLane = $("#in-progress-cards");
    let doneLane = $("#done-cards");

    let taskList = getTasks();

    todoLane.empty();
    inProgressLane.empty();
    doneLane.empty();

    taskList.forEach(task => {
        let cardBody = createTaskCard(task);
        if (task.status === "todo") { 
            cardBody.appendTo(todoLane);
        } else if (task.status === "inProgress") {
            cardBody.appendTo(inProgressLane);
        } else if (task.status === "done") {
            cardBody.appendTo(doneLane);
        }
    });

    // Make cards draggable
    $(".card").draggable({
        revert: "invalid",
        stack: ".card"
    });

    

}

// Todo: create a function to handle adding a new task
function createTask(event) {
    event.preventDefault();
    let form = $("#modalForm");
    let formData = form.serializeArray();
    let task = {};
    formData.forEach(field => {
        task[field.name] = field.value;
    });
    task.id = generateTaskId();
    task.status = "todo"; 
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
    renderTaskList();
    form.trigger("reset");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    let taskId = parseInt($(event.target).closest(".card").attr("data-project-id"));
    let taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        saveTasks();
        renderTaskList();
    }
}

// Todo: create a function to handle dropping a task into a new status lane
// function handleDrop(event, ui) {
//     console.log('ui', ui);
//     const taskId = ui.draggable.attr('data-project-id');
//     const newStatus = event.target.id;
//     const projects = readProjectsFromStorage();
//     const droppedProject = projects.find(project => project.id === taskId);
//     if (droppedProject) {
//         droppedProject.status = newStatus;
//         ui.draggable.css('background-color', newStatus === 'done' ? 'white' : '');
//         saveProjectsToStorage(projects);
//     }
//     printProjectData();
// }

function handleDrop(event, ui) {
    console.log('ui', ui);
    // Get the task id from the target task
    const taskId = ui.draggable[0].dataset.taskId;

    // Get the id of the lane that the task was dropped into
    const newStatus = event.target.id;
    
    // Find the task card by the `id` and update the task status.
    for (let task of taskList) {        
        if (task.taskId == taskId) {
            task.status = newStatus;
        }
    }

    // Save the updated tasks array to localStorage.
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // Render task on the screen
    renderTaskList();

}




// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// $(document).ready(function () {
//     $(".card").addClass("draggable-element").draggable({
//         revert: "invalid",
//         stack: ".card"
//     });
//     renderTaskList();
// });

// //event listener for modal button
// $("#btn").click(function() {
//     $("#formModal").modal("show");
// });


// Event listener for form submission
function handleAddTask(event) {
    event.preventDefault();
    let taskName = projectNameInputEl.val();
    let taskDescription = projectTypeInputEl.val();
    let taskDueDate = projectDateInputEl.val();
    if (!taskName || !taskDescription || !taskDueDate) {
        alert('Please fill out all fields');
        return;
    }
    let task = {
        id: generateTaskId(),
        title: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
        status: 'todo'
    };
    taskList.push(task); 
    saveTasks();
    renderTaskList();
    formModalEl.modal('hide');
}

projectFormEl.submit(createTask);

// Make lanes droppable
// function makeLanesDroppable() {
//     $('.lane').droppable({
//         accept: '.draggable-element', 
//         drop: handleDrop,
//     });
// }


// Initialize date picker
var $datepicker = $('#dueDate');
$datepicker.datepicker({ dateFormat: 'yy-mm-dd' });
$datepicker.datepicker('setDate', new Date());

// function that runs when the page loads
$(document).ready(function () {
    // render the task list
    renderTaskList();
    // add event listener
    $('#modalForm').on('submit', handleAddTask);
    // make lanes droppable
    $('.lane').droppable({
      accept: '.card',
      drop: handleDrop,
    });
    // make due date field a date picker
    $('#taskDueDate').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  });