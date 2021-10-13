// SELECTORS
    const todoInput = document.querySelector('.todo-input');
    const todoButton = document.querySelector('.todo-button');
    const todoList = document.querySelector('.todo-list');

//EVENT LISTENERS
todoButton.addEventListener('click', addTodo);


//fUNCTIONS
function addTodo(event) {
    //prevent for default submitting
    event.preventDefault();
    // Todo Div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    //create LI
    const newTodo = document.createElement('li');
    newTodo.innerHTML = "<p>Hello</p>";
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    // competed check mark button
    const CheckButton = document.createElement('button');
    CheckButton.innerHTML = '<i class="fas fa-check"></i>';
    CheckButton.classList.add("complete-btn");
    todoDiv.appendChild(CheckButton);
    // trash button
    const TrashButton = document.createElement('button');
    TrashButton.innerHTML = '<i class="fas fa-trash"></i>';
    TrashButton.classList.add("trash-btn");
    todoDiv.appendChild(TrashButton);

    // Append to list
    todoList.appendChild(todoDiv);
    
}