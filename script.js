// Update Clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
setInterval(updateClock, 1000);
updateClock();

// Load Tasks from Local Storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    const noTasksDiv = document.getElementById('noTasks');
    
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        noTasksDiv.classList.remove('d-none');
    } else {
        noTasksDiv.classList.add('d-none');
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <div class="task-title">${task.task}</div>
                    <p class="task-description">${task.description}</p>
                </div>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})" title="Delete Task">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            taskList.appendChild(li);
        });
    }
}

// Add New Task
function addTask() {
    const taskInput = document.getElementById('taskHeadingInput');
    const taskDescription = document.getElementById('taskDescriptionInput');
    const errorMessage = document.getElementById('errorMessage');
    
    const taskValue = taskInput.value.trim();
    const descValue = taskDescription.value.trim();

    if (!taskValue || !descValue) {
        errorMessage.classList.remove('d-none');
        return;
    }

    errorMessage.classList.add('d-none');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ task: taskValue, description: descValue });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskInput.value = '';
    taskDescription.value = '';

    loadTasks();
    
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

// Clear modal inputs when shown
document.getElementById('taskModal').addEventListener('show.bs.modal', () => {
    document.getElementById('taskHeadingInput').value = '';
    document.getElementById('taskDescriptionInput').value = '';
    document.getElementById('errorMessage').classList.add('d-none');
});

// Initialize Task List on Load
document.addEventListener('DOMContentLoaded', loadTasks);