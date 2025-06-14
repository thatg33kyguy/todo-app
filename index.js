const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const todosFile = path.join(__dirname, 'todos.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/todos', (req, res) => {
  try {
    const data = fs.readFileSync(todosFile, 'utf-8') || '[]';
    const todos = JSON.parse(data);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load todos.' });
  }
});

app.post('/api/todos', (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Task text missing' });

    const data = fs.readFileSync(todosFile, 'utf-8') || '[]';
    const todos = JSON.parse(data);
    todos.push({ text });
    fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
    res.status(201).json({ message: 'Task added.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save todo.' });
  }
});

app.delete('/api/todos/:index', (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const data = fs.readFileSync(todosFile, 'utf-8') || '[]';
    const todos = JSON.parse(data);

    if (index >= 0 && index < todos.length) {
      todos.splice(index, 1);
      fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
      res.json({ message: 'Task deleted.' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});