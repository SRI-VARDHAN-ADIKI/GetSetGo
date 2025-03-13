function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `${task} <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></button>`;
        taskList.appendChild(li);
    });
}

function addTask() {
    const taskInput = document.getElementById('taskHeadingInput').value;
    const taskDescription = document.getElementById('taskDescriptionInput').value;
    if (taskInput.trim() === '' || taskDescription.trim() === '') return;
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ task: taskInput, description: taskDescription });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('taskHeadingInput').value = '';
    document.getElementById('taskDescriptionInput').value = '';
    loadTasks();
    bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

document.addEventListener('DOMContentLoaded', loadTasks);