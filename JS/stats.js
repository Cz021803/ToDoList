// Statistics Page - Tharani Chandran (2106415)
// Reads tasks from localStorage and displays statistics

document.addEventListener('DOMContentLoaded', function() {
    // Get tasks from localStorage (same as main page)
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Calculate statistics
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed === true).length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    // Update the statistics display
    document.getElementById('total-tasks').innerText = total;
    document.getElementById('completed-tasks').innerText = completed;
    document.getElementById('pending-tasks').innerText = pending;
    document.getElementById('completion-rate').innerText = completionRate + '%';
    
    // Update progress bar if it exists
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = completionRate + '%';
        progressBar.setAttribute('aria-valuenow', completionRate);
    }
    
    // Display all tasks
    displayAllTasks(tasks);
});

function displayAllTasks(tasks) {
    const tasksContainer = document.getElementById('all-tasks-list');
    if (!tasksContainer) return;
    
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<p style="text-align: center; color: #666;">No tasks found. Add some tasks!</p>';
        return;
    }
    
    let tasksHtml = '<ul style="list-style: none; padding: 0;">';
    tasks.forEach(task => {
        const status = task.completed ? '✅ Completed' : '⏳ Pending';
        tasksHtml += `
            <li style="padding: 10px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between;">
                <span><strong>${escapeHtml(task.text)}</strong></span>
                <span>${status}</span>
            </li>
        `;
    });
    tasksHtml += '</ul>';
    
    tasksContainer.innerHTML = tasksHtml;
}

// Helper function to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}