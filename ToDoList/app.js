// SELECTORS
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filtering = document.querySelector(".filter-todo");

//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filtering.addEventListener("click", filterTodo);


//fUNCTIONS
function addTodo(event) {
    //prevent for default submitting
    event.preventDefault();
    // Todo Div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    // local storage
    saveLocal(todoInput.value);
    // competed check mark button
    const CheckButton = document.createElement("button");
    CheckButton.innerHTML = '<i class="fas fa-check"></i>';
    CheckButton.classList.add("complete-btn");
    todoDiv.appendChild(CheckButton);
    // trash button
    const TrashButton = document.createElement("button");
    TrashButton.innerHTML = '<i class="fas fa-trash"></i>';
    TrashButton.classList.add("trash-btn");
    todoDiv.appendChild(TrashButton);

    // Append to list
    todoList.appendChild(todoDiv);

    //delete value from input
    todoInput.value = "";
}
function deleteCheck(e) {
    const item = e.target;
    // delete todo item
    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        //animation napres se provede animace, potom se smaze element
        todo.classList.add("fall");
        removeLacalTodos(todo);
        todo.addEventListener("transitionend", function () {
            todo.remove();
        });
    }
    if (item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }

}
function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if (todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!todo.classList.contains("completed")) {
                    todo.style.display = "flex ";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}
function saveLocal(todo) {
    // LOCAL STORAGE
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}
function getTodos() {
    //fconsole.log("kokot")
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function (todo) {
        // Todo Div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        //create LI
        const newTodo = document.createElement("li");
        newTodo.innerText = todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        // competed check mark button
        const CheckButton = document.createElement("button");
        CheckButton.innerHTML = '<i class="fas fa-check"></i>';
        CheckButton.classList.add("complete-btn");
        todoDiv.appendChild(CheckButton);
        // trash button
        const TrashButton = document.createElement("button");
        TrashButton.innerHTML = '<i class="fas fa-trash"></i>';
        TrashButton.classList.add("trash-btn");
        todoDiv.appendChild(TrashButton);
        //append list
        todoList.appendChild(todoDiv);
    });
}
function removeLacalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const todoIndex = todo.children[1].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}