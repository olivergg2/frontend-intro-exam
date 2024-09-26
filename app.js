const todosList = document.querySelector('#todos')
const addTodoFormElement = document.querySelector('#add-todo-form')
const todoInputElement = document.querySelector('#add-todo-text')

let todos = []

function saveToLocalstorage() {
  const stringifiedTodos = JSON.stringify(todos)

  localStorage.setItem('todos', stringifiedTodos)

  updateTodosInfo()
}

function tryParseJSON(string, fallback = null) {
  if (!string) return fallback

  try {
    return JSON.parse(string)
  } catch (error) {
    return fallback
  }
}

function loadFromLocalstorage() {
  const todosFromLocalStorage = localStorage.getItem('todos')
  const storedTodos = tryParseJSON(todosFromLocalStorage, [])

  console.log('Loaded', storedTodos.length, 'todos from localStorage!')

  // Merge storedTodos with todos list
  todos = [...todos, ...storedTodos]

  // Add todo elements to DOM
  todos.forEach(addTodoElement)

  updateTodosInfo()
}

function toggleTodoDone(id) {
  // Find index of todo
  const index = todos.findIndex(t => t.id === id)

  // Ensure todo was found
  if (index < 0) return

  // Update todo in list
  const todo = todos[index]

  todos[index].done = !todo.done

  // Save changes to localStorage
  saveToLocalstorage()

  // Return new value
  return todos[index].done
}

function removeTodo(id) {
  todos = todos.filter(todo => todo.id !== id)

  saveToLocalstorage()
}

function createTodo(name) {
  if (!name) return console.error('Todo must have text content')

  // Create todo with random id
  const uuid = crypto.randomUUID()
  const todoToAdd = { id: uuid, text: name, done: false }

  // Add todo to list of todos
  todos.push(todoToAdd)

  // Save todos in localstorage
  saveToLocalstorage()

  // Add todo to DOM
  addTodoElement(todoToAdd)
}

function addTodoElement(todo) {
  const element = document.createElement('li')
  const doneClassName = todo.done ? 'done' : ''

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = todo.done
  checkbox.addEventListener('change', e => {
    e.currentTarget.checked = toggleTodoDone(todo.id)
    element.classList.toggle('done')
  })

  const paragraph = document.createElement('p')
  paragraph.innerText = todo.text
  paragraph.className = 'todo-text'

  const deleteButton = document.createElement('button')
  deleteButton.innerHTML = '&#10006;'
  deleteButton.className = 'todo-remove'
  deleteButton.addEventListener('click', () => {
    removeTodo(todo.id)
    element.remove()
  })

  element.className = ['todo', doneClassName].join(' ')
  element.title = todo.text
  element.appendChild(checkbox)
  element.appendChild(paragraph)
  element.appendChild(deleteButton)

  todosList.appendChild(element)
}

function updateTodosInfo() {
  const label = document.querySelector('#todo-info')

  if (!todos.length) return (label.innerText = 'Inga todos, lägg till en!')

  const doneTodos = todos.filter(todo => todo.done)
  const incompleteTodos = todos.length - doneTodos.length

  const text = `${todos.length} todos, ${doneTodos.length} klara, ${incompleteTodos} att göra`

  label.innerText = text
}

addTodoFormElement.addEventListener('submit', e => {
  e.preventDefault()

  // Get form data
  const data = new FormData(e.target)

  // Get user inputted text
  const todoText = data.get('todo-text')

  // Create a todo
  createTodo(todoText)

  // Reset input
  todoInputElement.value = ''
})

// Load todos from localstorage when page is loaded
loadFromLocalstorage()
