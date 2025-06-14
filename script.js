const form = document.getElementById('todoForm');
const input = document.getElementById('todoInput');
const list = document.getElementById('todoList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const rawText = input.value.trim();
  if (!rawText) return;

  const tasks = rawText.split(',').map(t => t.trim()).filter(t => t);
  for (const text of tasks) {
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
  }

  input.value = '';
  fetchTodos();
});

async function fetchTodos() {
  const res = await fetch('/api/todos');
  const todos = await res.json();

  const list = document.getElementById('todoList');
  list.innerHTML = '';

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.done ? 'done' : '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;

    checkbox.onchange = async () => {
      await fetch(`/api/todos/${index}`, { method: 'PATCH' });
      fetchTodos();
    };

    const span = document.createElement('span');
    span.textContent = todo.text;

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.onclick = async () => {
      await fetch(`/api/todos/${index}`, { method: 'DELETE' });
      fetchTodos();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}


fetchTodos();