// Task Manager Logic

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const quoteDisplay = document.getElementById('quoteDisplay');

// State
let tasks = [];

// Spiderman Motivational Quotes
const quotes = [
    "With great power comes great responsibility.",
    "I believe there's a hero in all of us.",
    "No matter how buried it gets, or lost you feel, you must promise me, that you will hold on to hope.",
    "Anyone can wear the mask. You could wear the mask.",
    "This is my gift, my curse. Who am I? I'm Spider-Man.",
    "We all have secrets: the ones we keep... and the ones that keep us.",
    "You're much stronger than you think you are. Trust me.",
    "It's a leap of faith. That's all it is, Miles. A leap of faith.",
    "Help one person, you help everyone.",
    "The only thing standing between this city and oblivion is me."
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    startQuoteRotation();
});

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

// Functions

/**
 * Load tasks from localStorage and render them
 */
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

/**
 * Save current tasks to localStorage
 */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Add a new task to the list
 */
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = ''; // Clear input
    taskInput.focus();
}

/**
 * Render the list of tasks to the DOM
 */
function renderTasks() {
    taskList.innerHTML = ''; // Clear current list

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        // Task Content (Checkbox + Text)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';
        contentDiv.onclick = () => toggleTask(task.id);

        const checkbox = document.createElement('div');
        checkbox.className = 'checkbox';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;'; // HTML entity for multiplication sign (X)
        deleteBtn.ariaLabel = 'Delete task';
        deleteBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent toggling when deleting
            deleteTask(task.id);
        };

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}


function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

/**
 * Save current tasks to localStorage
 */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Add a new task to the list
 */
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = ''; // Clear input
    taskInput.focus();
}

/**
 * Render the list of tasks to the DOM
 */
function renderTasks() {
    taskList.innerHTML = ''; // Clear current list

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        // Task Content (Checkbox + Text)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';
        contentDiv.onclick = () => toggleTask(task.id);

        const checkbox = document.createElement('div');
        checkbox.className = 'checkbox';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;'; // HTML entity for multiplication sign (X)
        deleteBtn.ariaLabel = 'Delete task';
        deleteBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent toggling when deleting
            deleteTask(task.id);
        };

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

/**
 * Toggle the completed status of a task
 * @param {number} id - The ID of the task to toggle
 */
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            const isCompleted = !task.completed;
            if (isCompleted) playSuccessSound(); // Play sound on completion
            return { ...task, completed: isCompleted };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

/**
 * Delete a task from the list
 * @param {number} id - The ID of the task to delete
 */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

/**
 * Clear all completed tasks
 */
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

/**
 * Rotate motivational quotes every 10 seconds
 */
function startQuoteRotation() {
    let currentQuoteIndex = 0;

    function showQuote() {
        // Fade out
        quoteDisplay.classList.add('fade-out');

        setTimeout(() => {
            // Update text and fade in
            quoteDisplay.textContent = quotes[currentQuoteIndex];
            quoteDisplay.classList.remove('fade-out');

            // Prepare next quote
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        }, 500); // Wait for fade out transition
    }

    showQuote(); // Show initial quote
    setInterval(showQuote, 10000); // Rotate every 10 seconds
}

/**
 * Play a success sound effect using Web Audio API
 */
function playSuccessSound() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Sound settings: High pitch "ding"
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime); // Start at 800Hz
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1); // Ramp up

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5); // Fade out

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
}
