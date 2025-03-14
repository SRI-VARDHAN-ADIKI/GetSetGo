// Update Clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Load Tasks from Local Storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
            <div>
                <strong>${task.task}</strong>
                <p class="mb-0">${task.description}</p>
            </div>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        taskList.appendChild(li);
    });
}

// Add New Task
function addTask() {
    const taskInput = document.getElementById('taskHeadingInput').value.trim();
    const taskDescription = document.getElementById('taskDescriptionInput').value.trim();

    if (!taskInput || !taskDescription) return;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ task: taskInput, description: taskDescription });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('taskHeadingInput').value = '';
    document.getElementById('taskDescriptionInput').value = '';

    loadTasks();
    
    // Close Modal
    const modalElement = document.getElementById('taskModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
}

// Delete Task
function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// Initialize Task List on Load
document.addEventListener('DOMContentLoaded', loadTasks);
