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
    const notDoneList = document.getElementById('notDoneList');
    const doneList = document.getElementById('doneList');
    const noNotDoneTasksDiv = document.getElementById('noNotDoneTasks');
    const noDoneTasksDiv = document.getElementById('noDoneTasks');
    
    notDoneList.innerHTML = '';
    doneList.innerHTML = '';
    
    const notDoneTasks = tasks.filter(task => !task.completed);
    const doneTasks = tasks.filter(task => task.completed);

    // Handle Not Done Tasks
    if (notDoneTasks.length === 0) {
        noNotDoneTasksDiv.classList.remove('d-none');
    } else {
        noNotDoneTasksDiv.classList.add('d-none');
        notDoneTasks.forEach((task, index) => {
            const globalIndex = tasks.indexOf(task);
            const li = createTaskElement(task, globalIndex);
            notDoneList.appendChild(li);
        });
    }

    // Handle Done Tasks
    if (doneTasks.length === 0) {
        noDoneTasksDiv.classList.remove('d-none');
    } else {
        noDoneTasksDiv.classList.add('d-none');
        doneTasks.forEach((task, index) => {
            const globalIndex = tasks.indexOf(task);
            const li = createTaskElement(task, globalIndex);
            doneList.appendChild(li);
        });
    }

    addDragAndDropListeners();
}

// Create Task Element
function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.draggable = true;
    li.dataset.index = index;
    li.innerHTML = `
        <div class="d-flex align-items-center">
            <input type="checkbox" class="form-check-input me-3" 
                   onchange="toggleTask(${index})" ${task.completed ? 'checked' : ''}>
            <div class="task-content" id="task-content-${index}">
                <div class="task-title ${task.completed ? 'completed' : ''}">${task.task}</div>
                <p class="task-description ${task.completed ? 'completed' : ''}">${task.description}</p>
            </div>
            <div class="edit-content d-none" id="edit-content-${index}">
                <input type="text" class="editable-input" id="edit-title-${index}" value="${task.task}">
                <textarea class="editable-textarea" id="edit-desc-${index}" rows="2">${task.description}</textarea>
            </div>
        </div>
        <div>
            <button class="btn btn-warning btn-sm btn-edit" id="edit-btn-${index}" onclick="startEdit(${index})" title="Edit Task">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-success btn-sm d-none" id="save-btn-${index}" onclick="saveEdit(${index})" title="Save Task">
                <i class="fas fa-save"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})" title="Delete Task">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    return li;
}

// Toggle Task Completion
function toggleTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
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
    tasks.push({ task: taskValue, description: descValue, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskInput.value = '';
    taskDescription.value = '';

    loadTasks();
    
    const modalElement = document.getElementById('taskModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
}

// Start Editing Task
function startEdit(index) {
    const taskContent = document.getElementById(`task-content-${index}`);
    const editContent = document.getElementById(`edit-content-${index}`);
    const editBtn = document.getElementById(`edit-btn-${index}`);
    const saveBtn = document.getElementById(`save-btn-${index}`);

    taskContent.classList.add('d-none');
    editContent.classList.remove('d-none');
    editBtn.classList.add('d-none');
    saveBtn.classList.remove('d-none');
}

// Save Edited Task
function saveEdit(index) {
    const editTitle = document.getElementById(`edit-title-${index}`).value.trim();
    const editDesc = document.getElementById(`edit-desc-${index}`).value.trim();

    if (!editTitle || !editDesc) {
        alert('Both title and description are required!');
        return;
    }

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].task = editTitle;
    tasks[index].description = editDesc;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    loadTasks();
}

// Delete Task
function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// Clear All Tasks
function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
        localStorage.removeItem('tasks');
        loadTasks();
    }
}

// Share List
function shareList() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (tasks.length === 0) {
        alert('No tasks to share!');
        return;
    }

    let shareText = 'My To-Do List:\n\n';
    tasks.forEach((task, index) => {
        shareText += `${index + 1}. ${task.task} ${task.completed ? '[✓]' : '[ ]'}\n   - ${task.description}\n`;
    });

    if (navigator.share) {
        navigator.share({
            title: 'My To-Do List',
            text: shareText,
        }).catch(err => {
            console.error('Error sharing:', err);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

// Fallback for browsers that don't support Web Share API
function fallbackShare(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('List copied to clipboard! You can paste it anywhere to share.');
}

// Add Drag and Drop Listeners
function addDragAndDropListeners() {
    const notDoneList = document.getElementById('notDoneList');
    const doneList = document.getElementById('doneList');
    const notDoneItems = notDoneList.getElementsByClassName('list-group-item');
    const doneItems = doneList.getElementsByClassName('list-group-item');

    function addListeners(items, list) {
        for (let item of items) {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.index);
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = parseInt(item.dataset.index);

                if (fromIndex !== toIndex) {
                    reorderTasks(fromIndex, toIndex);
                }
            });
        }
    }

    addListeners(notDoneItems, notDoneList);
    addListeners(doneItems, doneList);
}

// Reorder Tasks
function reorderTasks(fromIndex, toIndex) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const [movedTask] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, movedTask);
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
