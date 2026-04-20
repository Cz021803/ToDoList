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
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

updateDateTime();
setInterval(updateDateTime, 1000);

// Check saved theme
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

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

  saveLocal(todo);
  renderTodo(todo);
  toDoInput.value = '';
}

// Render a todo card
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

  const deleted = document.createElement('button');
  deleted.innerHTML = '<i class="fas fa-trash"></i>';
  deleted.classList.add('delete-btn', `${savedTheme}-button`);

  actionsDiv.appendChild(checked);
  actionsDiv.appendChild(deleted);

  toDoDiv.appendChild(contentDiv);
  toDoDiv.appendChild(actionsDiv);

  toDoList.appendChild(toDoDiv);
}

// Handle delete / check
function deletecheck(event) {
  const item = event.target;
  const todoCard = item.closest('.todo');

  if (!todoCard) return;

  const todoId = Number(todoCard.dataset.id);

  if (
    item.classList.contains('delete-btn') ||
    item.classList.contains('fa-trash')
  ) {
    todoCard.classList.add("fall");
    removeLocalTodos(todoId);
    todoCard.addEventListener('transitionend', function () {
      todoCard.remove();
    });
  }

  if (
    item.classList.contains('check-btn') ||
    item.classList.contains('fa-check')
  ) {
    todoCard.classList.toggle("completed");
    toggleCompleted(todoId);
  }
}

// Save todo object to local storage
function saveLocal(todo) {
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
function removeLocalTodos(todoId) {
  let todos = getStoredTodos();
  todos = todos.filter(todo => todo.id !== todoId);
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Toggle completed state
function toggleCompleted(todoId) {
  let todos = getStoredTodos();

  todos = todos.map(todo => {
    if (todo.id === todoId) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateDateTime() {
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

// Format created date/time
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

// Change theme
function changeTheme(color) {
  localStorage.setItem('savedTheme', color);
  savedTheme = localStorage.getItem('savedTheme');

  document.body.className = color;

  color === 'darker'
    ? document.getElementById('title').classList.add('darker-title')
    : document.getElementById('title').classList.remove('darker-title');

  document.querySelector('input').className = `todo-input ${color}-input`;

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
    } else if (button.classList.contains('delete-btn')) {
      button.className = `delete-btn ${color}-button`;
      button.innerHTML = '<i class="fas fa-trash"></i>';
    } else if (button.classList.contains('todo-btn')) {
      button.className = `todo-btn ${color}-button`;
    }
  });
}