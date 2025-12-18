// Greeting
const nameInput = document.getElementById('nameInput');
const greetBtn = document.getElementById('greetBtn');
const greetOutput = document.getElementById('greetOutput');

if (greetBtn) {
  greetBtn.addEventListener('click', () => {
    const name = (nameInput?.value || '').trim();
    greetOutput.textContent = name ? `Hello, ${name}! 👋` : 'Please enter your name.';
  });
}

// Counter
const countEl = document.getElementById('count');
const incBtn = document.getElementById('incBtn');
const decBtn = document.getElementById('decBtn');
let count = 0;

function renderCount() {
  if (!countEl) return;
  countEl.textContent = String(count);
  countEl.style.color = count > 0 ? 'var(--accent)' : count < 0 ? '#ef4444' : 'var(--text)';
}

if (incBtn && decBtn) {
  incBtn.addEventListener('click', () => { count++; renderCount(); });
  decBtn.addEventListener('click', () => { count--; renderCount(); });
  renderCount();
}

// Todo (localStorage)
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

let todos = [];
try {
  todos = JSON.parse(localStorage.getItem('todos_v1') || '[]');
} catch { todos = []; }

function saveTodos() {
  localStorage.setItem('todos_v1', JSON.stringify(todos));
}

function renderTodos() {
  if (!todoList) return;
  todoList.innerHTML = '';
  todos.forEach((t, idx) => {
    const li = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = t;
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', () => {
      todos.splice(idx, 1);
      saveTodos();
      renderTodos();
    });
    li.appendChild(text);
    li.appendChild(del);
    todoList.appendChild(li);
  });
}

if (addTodoBtn) {
  addTodoBtn.addEventListener('click', () => {
    const value = (todoInput?.value || '').trim();
    if (!value) return;
    todos.push(value);
    if (todoInput) todoInput.value = '';
    saveTodos();
    renderTodos();
  });
  renderTodos();
}