const todoList = document.getElementById('todoList');
const addTodoForm = document.getElementById('addTodoForm');

// Function to fetch and display todos
async function fetchTodos() {
  try {
    const response = await fetch(`/todos`);
    const todos = await response.json();

    todoList.innerHTML = '';
    todos.forEach(todo => {
      const listItem = document.createElement('li');
      listItem.classList.add('todoItem');
      listItem.innerHTML = `
          <input type="checkbox" ${todo.completed ? 'checked' : ''} />
          <span>${todo.task}</span>
          <button data-todo-id="${todo._id}" class="deleteButton">Delete</button>
          <button data-todo-id="${todo._id}" class="editButton">Edit</button>
        `;

      todoList.appendChild(listItem);
    });

    addEventListeners();
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
}

// Function to add a new todo
function addTodo(event) {
  event.preventDefault();

  const taskInput = document.getElementById('task');
  const task = taskInput.value.trim();

  if (task === '') {
    alert('Task cannot be empty!');
    return;
  }

  addTodoRequest(task);
}

// Function to send a request to add a new todo
async function addTodoRequest(task) {
  try {
    const response = await fetch(`/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: task,
        completed: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Error adding todo');
    }

    // Clear the input and fetch updated todos
    taskInput.value = '';
    fetchTodos();
  } catch (error) {
    console.error('Error adding todo:', error);
  }
}

// Function to delete a todo
async function deleteTodo(todoID) {
  try {
    const response = await fetch(`/todos/${todoID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error deleting todo');
    }

    // Fetch updated todos after deletion
    fetchTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
}

// Function to update a todo
async function updateTodo(todoID, currentTask) {
  const newTask = prompt('Edit Task:', currentTask);

  if (newTask !== null) {
    try {
      const response = await fetch(`/todos/${todoID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: newTask.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error updating todo');
      }

      // Fetch updated todos after updation
      fetch
