// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');
const searchInput = document.querySelector('.search-input');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));
searchInput.addEventListener('input', filterTodos);

// Check if one theme has been set previously and apply it (or std theme if not found)
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(localStorage.getItem('savedTheme'));

// Functions

function filterTodos(event) {
    const todos = toDoList.childNodes;
    const searchText = event.target.value.toLowerCase();
    
    todos.forEach(function(todo) {
        if (todo.nodeType === Node.ELEMENT_NODE) {
            const text = todo.querySelector('.todo-item').innerText.toLowerCase();
            if (text.includes(searchText)) {
                todo.style.display = 'flex';
            } else {
                todo.style.display = 'none';
            }
        }
    });
}

function addToDo(event) {
    event.preventDefault();
    
    if (toDoInput.value === '') {
        alert("You must write something!");
        return;
    }
    
    // Create todo DIV
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);
    
    // Create LI with unique ID for editing reference
    const newToDo = document.createElement('li');
    newToDo.innerText = toDoInput.value;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);
    
    // Save to localStorage
    saveToLocal(toDoInput.value);
    
    // Check button (mark as complete)
    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);
    
    // Edit button (NEW)
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.classList.add('edit-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(editBtn);
    
    // Delete button
    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);
    
    // Append to list
    toDoList.appendChild(toDoDiv);
    
    // Clear input
    toDoInput.value = '';
}

function deletecheck(event) {
    const item = event.target;
    
    // Delete functionality
    if(item.classList[0] === 'delete-btn') {
        const todo = item.parentElement;
        todo.classList.add("fall");
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', function() {
            todo.remove();
        });
    }
    
    // Check functionality (mark as complete)
    if(item.classList[0] === 'check-btn') {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
        // Update localStorage when task is marked completed
        updateTodoStatusInLocal(todo);
    }
    
    // NEW: Edit functionality
    if(item.classList[0] === 'edit-btn') {
        const todoItem = item.parentElement.querySelector('.todo-item');
        const oldText = todoItem.innerText;
        
        // Create input field for editing
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = oldText;
        inputField.classList.add('edit-input', `${savedTheme}-input`);
        
        // Replace the text with input field
        todoItem.style.display = 'none';
        todoItem.parentElement.insertBefore(inputField, todoItem.nextSibling);
        inputField.focus();
        
        // Handle save on Enter or blur (clicking away)
        const saveEdit = function() {
            const newText = inputField.value.trim();
            if (newText !== '' && newText !== oldText) {
                todoItem.innerText = newText;
                updateTodoTextInLocal(todoItem.parentElement, oldText, newText);
            }
            inputField.remove();
            todoItem.style.display = '';
        };
        
        inputField.addEventListener('blur', saveEdit);
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    }
}

// NEW: Function to update todo text in localStorage
function updateTodoTextInLocal(todoElement, oldText, newText) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    
    const todoIndex = todos.indexOf(oldText);
    if (todoIndex !== -1) {
        todos[todoIndex] = newText;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

// NEW: Function to update todo status in localStorage (optional - for future enhancements)
function updateTodoStatusInLocal(todoElement) {
    // This function can be expanded to save completion status
    // For now, it's a placeholder for future functionality
    console.log('Task status toggled');
}

// Save to localStorage
function saveToLocal(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Load todos from localStorage on page load
function getTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    
    todos.forEach(function(todo) {
        // Create todo DIV
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);
        
        // Create LI
        const newToDo = document.createElement('li');
        newToDo.innerText = todo;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);
        
        // Check button
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);
        
        // Edit button (NEW)
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.classList.add('edit-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(editBtn);
        
        // Delete button
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);
        
        // Append to list
        toDoList.appendChild(toDoDiv);
    });
}

// Remove from localStorage
function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todos.indexOf(todo.children[0].innerText);
    todos.splice(todoIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');
    document.body.className = color;
    
    // Change blinking cursor for darker theme
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title') : 
        document.getElementById('title').classList.remove('darker-title');
    
    document.querySelector('.todo-input').className = `todo-input ${color}-input`;
    if (document.querySelector('.search-input')) {
        document.querySelector('.search-input').className = `search-input ${color}-input`;
    }
    
    // Change todo color without changing their status
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed` : 
            todo.className = `todo ${color}-todo`;
    });
    
    // Change buttons color according to their type
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`;
            } else if (item === 'edit-btn') {
                button.className = `edit-btn ${color}-button`;
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}