// Key for local storage
const STORAGE_KEY = 'todo-tasks';

// GSAP Animations
gsap.from(".container", { duration: 1, y: -50, opacity: 0, ease: "power2.out" });

// Particle.js Background
particlesJS.load('particles-js', 'particles.json', function() {
    console.log('Particles loaded!');
});

// Get tasks from local storage
function getTasks() {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
}

// Save tasks to local storage
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Render tasks in the UI
function renderTasks(filter = 'all') {
    const tasks = getTasks();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true; // 'all'
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) li.classList.add('completed');

        const buttons = document.createElement('div');

        const completeButton = document.createElement('button');
        completeButton.innerHTML = task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>';
        completeButton.onclick = () => toggleComplete(index);

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.onclick = () => editTask(index);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.onclick = () => deleteTask(index);

        buttons.appendChild(completeButton);
        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);
        li.appendChild(buttons);
        taskList.appendChild(li);
    });
}

// Add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const tasks = getTasks();
    tasks.push({ text, completed: false });
    saveTasks(tasks);

    taskInput.value = '';
    renderTasks();
}

// Toggle task completion
function toggleComplete(index) {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

// Edit a task
function editTask(index) {
    const tasks = getTasks();
    const newText = prompt('Edit your task:', tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText;
        saveTasks(tasks);
        renderTasks();
    }
}

// Delete a task
function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}

// Filter tasks
function filterTasks(filter) {
    renderTasks(filter);
    document.querySelectorAll('.filters button').forEach(button => button.classList.remove('active'));
    document.querySelector(`.filters button:nth-child(${filter === 'all' ? 1 : filter === 'completed' ? 2 : 3})`).classList.add('active');
}

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => renderTasks());