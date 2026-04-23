// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');
const dateTime = document.getElementById('datetime');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', handleTodoActions);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check saved theme
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

// Live header date/time
updateDateTime();
setInterval(updateDateTime, 1000);

// Add new todo
function addToDo(event) {
    event.preventDefault();

    const text = toDoInput.value.trim();

    if (text === '') {
        alert("You must write something!");
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        createdAt: new Date().toISOString(),
        completed: false
    };

    saveToLocal(todo);
    renderTodo(todo);
    toDoInput.value = '';
}

// Render todo card
function renderTodo(todo) {
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);
    toDoDiv.dataset.id = todo.id;

    if (todo.completed) {
        toDoDiv.classList.add('completed');
    }

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("todo-content");

    const newToDo = document.createElement('li');
    newToDo.innerText = todo.text;
    newToDo.classList.add('todo-item');

    const createdAt = document.createElement('p');
    createdAt.classList.add('todo-created-at');
    createdAt.innerText = `Created: ${formatDateTime(todo.createdAt)}`;

    contentDiv.appendChild(newToDo);
    contentDiv.appendChild(createdAt);

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("todo-actions");

    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.classList.add('edit-btn', `${savedTheme}-button`);

    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);

    actionsDiv.appendChild(checked);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleted);

    toDoDiv.appendChild(contentDiv);
    toDoDiv.appendChild(actionsDiv);

    toDoList.appendChild(toDoDiv);
}

// Handle complete, edit, delete
function handleTodoActions(event) {
    const button = event.target.closest('button');
    if (!button) return;

    const todoCard = button.closest('.todo');
    if (!todoCard) return;

    const todoId = Number(todoCard.dataset.id);

    if (button.classList.contains('delete-btn')) {
        todoCard.classList.add("fall");
        removeLocalTodo(todoId);
        todoCard.addEventListener('transitionend', function () {
            todoCard.remove();
        });
    }

    if (button.classList.contains('check-btn')) {
        todoCard.classList.toggle("completed");
        updateTodoStatusInLocal(todoId);
    }

    if (button.classList.contains('edit-btn')) {
        startEditing(todoCard, todoId);
    }
}

// Start edit mode
function startEditing(todoCard, todoId) {
    const todoItem = todoCard.querySelector('.todo-item');
    const createdAt = todoCard.querySelector('.todo-created-at');

    if (!todoItem || todoCard.querySelector('.edit-input')) return;

    const oldText = todoItem.innerText;

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = oldText;
    inputField.classList.add('edit-input', `${savedTheme}-input`);

    todoItem.style.display = 'none';
    todoCard.querySelector('.todo-content').insertBefore(inputField, createdAt);
    inputField.focus();

    const saveEdit = function () {
        const newText = inputField.value.trim();

        if (newText !== '') {
            todoItem.innerText = newText;
            updateTodoTextInLocal(todoId, newText);
        }

        inputField.remove();
        todoItem.style.display = '';
    };

    inputField.addEventListener('blur', saveEdit);
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
}

// Save todo object to local storage
function saveToLocal(todo) {
    let todos = getStoredTodos();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Get todos from local storage
function getStoredTodos() {
    let todos;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    // Support old data format (string array)
    return todos.map(todo => {
        if (typeof todo === 'string') {
            return {
                id: Date.now() + Math.floor(Math.random() * 1000),
                text: todo,
                createdAt: new Date().toISOString(),
                completed: false
            };
        }
        return todo;
    });
}

// Load todos on page load
function getTodos() {
    const todos = getStoredTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
    todos.forEach(todo => renderTodo(todo));
}

// Remove todo from local storage
function removeLocalTodo(todoId) {
    let todos = getStoredTodos();
    todos = todos.filter(todo => todo.id !== todoId);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Update todo text in local storage
function updateTodoTextInLocal(todoId, newText) {
    let todos = getStoredTodos();

    todos = todos.map(todo => {
        if (todo.id === todoId) {
            return { ...todo, text: newText };
        }
        return todo;
    });

    localStorage.setItem('todos', JSON.stringify(todos));
}

// Update completed status in local storage
function updateTodoStatusInLocal(todoId) {
    let todos = getStoredTodos();

    todos = todos.map(todo => {
        if (todo.id === todoId) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });

    localStorage.setItem('todos', JSON.stringify(todos));
}

// Format task created time
function formatDateTime(dateString) {
    const date = new Date(dateString);

    return date.toLocaleString('en-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Update live header date/time
function updateDateTime() {
    if (!dateTime) return;

    const now = new Date();
    dateTime.innerText = now.toLocaleString('en-MY', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

// Change theme
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;

    color === 'darker'
        ? document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('.todo-input').className = `todo-input ${color}-input`;

    document.querySelectorAll('.todo').forEach(todo => {
        if (todo.classList.contains('completed')) {
            todo.className = `todo ${color}-todo completed`;
        } else {
            todo.className = `todo ${color}-todo`;
        }
    });

    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('check-btn')) {
            button.className = `check-btn ${color}-button`;
            button.innerHTML = '<i class="fas fa-check"></i>';
        } else if (button.classList.contains('edit-btn')) {
            button.className = `edit-btn ${color}-button`;
            button.innerHTML = '<i class="fas fa-edit"></i>';
        } else if (button.classList.contains('delete-btn')) {
            button.className = `delete-btn ${color}-button`;
            button.innerHTML = '<i class="fas fa-trash"></i>';
        } else if (button.classList.contains('todo-btn')) {
            button.className = `todo-btn ${color}-button`;
        }
    });

    document.querySelectorAll('.edit-input').forEach(input => {
        input.className = `edit-input ${color}-input`;
    });
}