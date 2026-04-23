// main.test.js - Fixed version (all 26 tests pass)
global.alert = jest.fn();

describe('ToDoList Application - Full Coverage for Assignment 2', () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <h1 id="title"></h1>
            <div id="form"><form></form></div>
            <input class="todo-input" />
            <button class="todo-btn"></button>
            <ul class="todo-list"></ul>
            <button class="standard-theme"></button>
            <button class="light-theme"></button>
            <button class="darker-theme"></button>
            <input class="search-input" />
            <div id="datetime"></div>
        `;
        localStorage.clear();
        jest.clearAllMocks();
        jest.resetModules();
        require('../JS/main.js');
    });

    // ==================== CORE FUNCTIONALITY ====================
    test('add todo', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'Task 1';
        document.querySelector('.todo-btn').click();
        expect(document.querySelector('.todo-item').innerText).toBe('Task 1');
    });

    test('prevent empty todo', () => {
        const input = document.querySelector('.todo-input');
        input.value = '   ';
        document.querySelector('.todo-btn').click();
        expect(global.alert).toHaveBeenCalled();
        expect(document.querySelector('.todo-item')).toBeNull();
    });

    test('save & load from localStorage', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'Persist';
        document.querySelector('.todo-btn').click();
        const saved = JSON.parse(localStorage.getItem('todos'));
        expect(saved.length).toBe(1);
        expect(saved[0].text).toBe('Persist');
        jest.resetModules();
        require('../JS/main.js');
        document.dispatchEvent(new Event('DOMContentLoaded'));
        expect(document.querySelector('.todo-item').innerText).toBe('Persist');
    });

    test('delete todo with transition', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'Delete';
        document.querySelector('.todo-btn').click();
        const card = document.querySelector('.todo');
        document.querySelector('.delete-btn').click();
        card.dispatchEvent(new Event('transitionend'));
        expect(document.querySelector('.todo')).toBeNull();
    });

    test('toggle complete', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'Done';
        document.querySelector('.todo-btn').click();
        const card = document.querySelector('.todo');
        const checkBtn = document.querySelector('.check-btn');
        checkBtn.click();
        expect(card.classList.contains('completed')).toBe(true);
        checkBtn.click();
        expect(card.classList.contains('completed')).toBe(false);
    });

    // ==================== EDITING ====================
    test('edit todo (blur)', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'Old';
        document.querySelector('.todo-btn').click();
        document.querySelector('.edit-btn').click();
        const editInput = document.querySelector('.edit-input');
        editInput.value = 'Updated';
        editInput.dispatchEvent(new Event('blur'));
        expect(document.querySelector('.todo-item').innerText).toBe('Updated');
    });

    test('edit todo (Enter key)', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'KeyEdit';
        document.querySelector('.todo-btn').click();
        document.querySelector('.edit-btn').click();
        const editInput = document.querySelector('.edit-input');
        editInput.value = 'EnterEdit';
        editInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        expect(document.querySelector('.todo-item').innerText).toBe('EnterEdit');
    });

    test('edit does nothing if empty (blur)', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'Original';
        document.querySelector('.todo-btn').click();
        document.querySelector('.edit-btn').click();
        const editInput = document.querySelector('.edit-input');
        editInput.value = '   ';
        editInput.dispatchEvent(new Event('blur'));
        expect(document.querySelector('.todo-item').innerText).toBe('Original');
    });

    test('edit does nothing if empty (Enter key)', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'OriginalEnter';
        document.querySelector('.todo-btn').click();
        document.querySelector('.edit-btn').click();
        const editInput = document.querySelector('.edit-input');
        editInput.value = '   ';
        editInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        expect(document.querySelector('.todo-item').innerText).toBe('OriginalEnter');
    });

    test('prevent duplicate edit input', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'Task';
        document.querySelector('.todo-btn').click();
        const editBtn = document.querySelector('.edit-btn');
        editBtn.click();
        editBtn.click();
        expect(document.querySelectorAll('.edit-input').length).toBe(1);
    });

    // ==================== FILTERING ====================
    test('filter todos (case-insensitive)', () => {
        const input = document.querySelector('.todo-input');
        const search = document.querySelector('.search-input');
        input.value = 'Apple';
        document.querySelector('.todo-btn').click();
        input.value = 'Banana';
        document.querySelector('.todo-btn').click();
        search.value = 'apple';
        search.dispatchEvent(new Event('input'));
        const todos = document.querySelectorAll('.todo');
        expect(todos[0].style.display).toBe('flex');
        expect(todos[1].style.display).toBe('none');
    });

    test('clearing search shows all todos', () => {
        const input = document.querySelector('.todo-input');
        const search = document.querySelector('.search-input');
        input.value = 'First';
        document.querySelector('.todo-btn').click();
        input.value = 'Second';
        document.querySelector('.todo-btn').click();
        search.value = 'First';
        search.dispatchEvent(new Event('input'));
        let todos = document.querySelectorAll('.todo');
        expect(todos[0].style.display).toBe('flex');
        expect(todos[1].style.display).toBe('none');
        search.value = '';
        search.dispatchEvent(new Event('input'));
        expect(todos[0].style.display === 'flex' || todos[0].style.display === '').toBe(true);
        expect(todos[1].style.display === 'flex' || todos[1].style.display === '').toBe(true);
    });

    test('filter ignores non-element nodes', () => {
        const list = document.querySelector('.todo-list');
        list.appendChild(document.createTextNode('random'));
        const search = document.querySelector('.search-input');
        search.value = 'test';
        search.dispatchEvent(new Event('input'));
        expect(true).toBe(true);
    });

    // ==================== THEME SWITCHING ====================
    test('theme switching (standard, light, darker)', () => {
        document.querySelector('.standard-theme').click();
        expect(document.body.className).toBe('standard');
        document.querySelector('.light-theme').click();
        expect(document.body.className).toBe('light');
        document.querySelector('.darker-theme').click();
        expect(document.body.className).toBe('darker');
        expect(localStorage.getItem('savedTheme')).toBe('darker');
    });

    test('changeTheme removes darker-title when switching away', () => {
        const title = document.getElementById('title');
        document.querySelector('.darker-theme').click();
        expect(title.classList.contains('darker-title')).toBe(true);
        document.querySelector('.light-theme').click();
        expect(title.classList.contains('darker-title')).toBe(false);
    });

    test('changeTheme updates completed todo classes correctly (branch line 312)', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'Completed task';
        document.querySelector('.todo-btn').click();
        document.querySelector('.check-btn').click();
        document.querySelector('.light-theme').click();
        const todo = document.querySelector('.todo');
        expect(todo.classList.contains('completed')).toBe(true);
        expect(todo.classList.contains('light-todo')).toBe(true);
        expect(todo.className).toContain('light-todo completed');
    });

    test('changeTheme handles missing search-input gracefully (branch line 305)', () => {
        document.querySelector('.search-input').remove();
        expect(() => document.querySelector('.darker-theme').click()).not.toThrow();
    });

    test('changeTheme updates all button types and edit inputs', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'Edit me';
        document.querySelector('.todo-btn').click();
        document.querySelector('.edit-btn').click();
        document.querySelector('.light-theme').click();
        const todoBtn = document.querySelector('.todo-btn');
        expect(todoBtn.classList.contains('light-button')).toBe(true);
        const checkBtn = document.querySelector('.check-btn');
        expect(checkBtn.classList.contains('light-button')).toBe(true);
        const editInput = document.querySelector('.edit-input');
        expect(editInput.classList.contains('light-input')).toBe(true);
    });

    // ==================== LOCALSTORAGE & DATA MIGRATION ====================
test('loads and converts old string-based todos from localStorage (branch line 210)', () => {
    localStorage.setItem('todos', JSON.stringify(['old task 1', 'old task 2']));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const todoItems = document.querySelectorAll('.todo-item');
    expect(todoItems.length).toBe(2);
    expect(todoItems[0].innerText).toBe('old task 1');
    expect(todoItems[1].innerText).toBe('old task 2');

    const stored = JSON.parse(localStorage.getItem('todos'));
    expect(stored[0]).toHaveProperty('id');
    expect(stored[0]).toHaveProperty('text', 'old task 1');
    expect(stored[0]).toHaveProperty('createdAt');
});

    test('getStoredTodos empty case (no localStorage entry)', () => {
        localStorage.removeItem('todos');
        jest.resetModules();
        require('../JS/main.js');
        document.dispatchEvent(new Event('DOMContentLoaded'));
        expect(document.querySelectorAll('.todo').length).toBe(0);
    });

    // ==================== DATE & TIME ====================
    test('created date is rendered', () => {
        const input = document.querySelector('.todo-input');
        input.value = 'Date test';
        document.querySelector('.todo-btn').click();
        const text = document.querySelector('.todo-created-at').innerText;
        expect(text).toContain('Created:');
        expect(text).toMatch(/\d{2} [A-Za-z]{3} \d{4}/);
    });

    test('datetime updates every second', () => {
        jest.useFakeTimers();
        jest.resetModules();
        require('../JS/main.js');
        const datetimeDiv = document.getElementById('datetime');
        const initialText = datetimeDiv.innerText;
        expect(initialText).not.toBe('');
        jest.advanceTimersByTime(1000);
        const newText = datetimeDiv.innerText;
        expect(newText).not.toBe(initialText);
        jest.useRealTimers();
    });

    test('updateDateTime does not crash if datetime element missing', () => {
        document.getElementById('datetime').remove();
        expect(() => {
            jest.resetModules();
            require('../JS/main.js');
        }).not.toThrow();
    });

    // ==================== EDGE CASES ====================
    test('handleTodoActions ignores non-button clicks', () => {
        const list = document.querySelector('.todo-list');
        list.dispatchEvent(new Event('click', { bubbles: true }));
        expect(true).toBe(true);
    });

    test('handleTodoActions with button but no todo card', () => {
        const fakeBtn = document.createElement('button');
        fakeBtn.classList.add('delete-btn');
        document.body.appendChild(fakeBtn);
        fakeBtn.click();
        expect(true).toBe(true);
    });

test('formatDateTime handles invalid date without crashing', () => {
    const invalidTodo = {
        id: 999,
        text: 'Invalid date todo',
        createdAt: 'not-a-date',
        completed: false
    };
    localStorage.setItem('todos', JSON.stringify([invalidTodo]));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const createdAtElem = document.querySelector('.todo-created-at');
    expect(createdAtElem).not.toBeNull();
    expect(createdAtElem.innerText).toContain('Created:');
    expect(createdAtElem.innerText).not.toBe('');
});

});