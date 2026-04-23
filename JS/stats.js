// Function to get tasks from localStorage
function getTasks() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
        return JSON.parse(tasks);
    }
    return [];
}

// Function to save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to calculate and display statistics
function displayStatistics() {
    const tasks = getTasks();
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed === true).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    document.getElementById('completionRate').textContent = completionRate + '%';
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = completionRate + '%';
        progressFill.textContent = completionRate + '%';
        
        if (completionRate < 30) {
            progressFill.style.backgroundColor = '#dc3545';
        } else if (completionRate < 70) {
            progressFill.style.backgroundColor = '#ffc107';
            progressFill.style.color = '#333';
        } else {
            progressFill.style.backgroundColor = '#28a745';
        }
    }
    
    displayAllTasks(tasks);
}

// Function to display all tasks
function displayAllTasks(tasks) {
    const taskListElement = document.getElementById('taskList');
    
    if (tasks.length === 0) {
        taskListElement.innerHTML = '<li class="task-item">No tasks found. Add some tasks!</li>';
        return;
    }
    
    taskListElement.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="${task.completed ? 'task-completed' : ''}">
                ${task.completed ? '✅' : '○'} ${escapeHtml(task.text)}
            </span>
            <span>
                ${task.completed ? 'Completed ✓' : 'Pending ⏳'}
            </span>
        `;
        taskListElement.appendChild(li);
    });
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Clear all tasks function
function clearAllTasks() {
    if (confirm('⚠️ WARNING: This will delete ALL your tasks. Are you sure?')) {
        localStorage.removeItem('tasks');
        displayStatistics();
        alert('All tasks have been deleted!');
    }
}

// Load statistics when page loads
document.addEventListener('DOMContentLoaded', function() {
    displayStatistics();
    
    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllTasks);
    }
});

// Update statistics when localStorage changes
window.addEventListener('storage', function(e) {
    if (e.key === 'tasks') {
        displayStatistics();
    }
});