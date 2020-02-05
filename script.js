
/*  
    This app is created in JS only.

     WARNING::: THIS APP IS NOT COMPLETE YET :: :: i.e. that outer list stuff (part in the pink color).
    So don't rely on a view because globaltasks are not getting updated correctly.


    Requirement: You need to create a todo list following MVC and 
    There will be a main list. each list contains set of tasks. on which you can apply CRUD operations.
    you can create new list and delete that list. 

    List1: > Tasks from list 1 which are array of objects. 
    List2: > tasks from list 2 
*/

// The Model class have current todo list.
// There are three classes here Model, View and Controller. 
// App is getting created when you create new instance of a class Controller passing new Model() and new View() to it.
// Everything is working fine when there is only one list.
// but as you create new list it is getting tasks from the previous list 


let globalTasks = {
    list1: [
        { id: 1, text: 'Hello world', complete: true },
        { id: 2, text: 'Create a todo app', complete: false },
    ],
    list2: [
        { id: 1, text: 'List2 task1', complete: false },
        { id: 2, text: 'List2 task2', complete: true },
        { id: 3, text: 'List2 task3', complete: true },
    ]
}

let counter = 0;

class Model {
    constructor(listname) {

        this.listname = listname;
        this.todos = globalTasks[listname] ? [...globalTasks[listname]] : [];
    }

    addTodos(todoText) {
        const todo = {
            id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
            text: todoText,
            complete: false
        }
        
        this.todos.push(todo);
        console.log(">>>>this.listname", this.listname)
        this.onTodoListChanged(this.todos);
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id)
        this.onTodoListChanged(this.todos);
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => todo.id == id ? { id: todo.id, text: todo.text, complete: !todo.complete } : todo)
        this.onTodoListChanged(this.todos);
    }

    showTasksList(name){
        console.log("global tasks:",globalTasks[name], ', name:', name)
        // this.todos = globalTasks[name];
        this.onTodoListChanged(this.todos);
    }

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback
    }

}

class View {
    constructor(listname) {
        this.app = this.getElement('#root');
        this.listname = listname
        // this.title = this.createElement('h1');  
        // this.title.textContent = 'Todos';

        // this.p = this.createElement('p','new-list');
        // this.p.textContent = 'Create new List';

        // this.form = this.createElement('form'); 

        // this.input = this.createElement('input');
        // this.input.type = 'text';
        // this.input.placeholder = 'enter text';
        // this.input.name = 'todo';
        this.input = document.querySelector('.input-box');

        // this.submitButton = this.createElement('button');
        // this.submitButton.textContent = 'Submit';

        this.todoList = document.querySelector('.list-items')
        this.form = document.querySelector('.form');
        this.mainList = document.querySelector('.main-list')
        // this.form.append(this.input, this.submitButton);

        // this.app.append(this.title, this.p, this.form, this.todoList);

    }

    createElement(tag, className, idName) {
        const element = document.createElement(tag);
        if (className) element.classList.add(className)
        if (idName) element.id = idName
        return element;
    }

    getElement(selector) {
        return document.querySelector(selector);
    }

    get _todoText() {
        return this.input.value;
    }

    _resetInput() {
        this.input.value = '';
    }

    displayTodos(todos) {
        while (this.todoList.firstChild) {
            this.todoList.removeChild(this.todoList.firstChild);
        }

        if (todos.length == 0) {
            const p = this.createElement('p');
            p.textContent = 'The list is empty!';
            this.todoList.append(p);
        } else {
            todos.forEach(todo => {

                const li = this.createElement('li');
                li.id = todo.id;

                const checkbox = this.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.complete;


                const span = this.createElement('span');
                span.contentEditable = true;

                if (todo.complete) {
                    const strike = this.createElement('s');
                    strike.textContent = todo.text;
                    span.append(strike);
                } else {
                    span.textContent = todo.text;
                }


                const deleteButton = this.createElement('button', 'delete');
                deleteButton.textContent = 'X';
                li.append(checkbox, span, deleteButton);

                this.todoList.append(li);
            })
        }
        // you may need to comment this.
        globalTasks[this.listname] = [...todos];
    }

    bindAddTodo(handler) {
        // console.log('th  is inside bindAddTodo',this);
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            if (this._todoText) {
                handler(this._todoText);
                this._resetInput();
            }
        })
    }

    bindDeleteTodo(handler) {
        this.todoList.addEventListener('click', event => {
            if (event.target.className == 'delete') {
                const id = parseInt(event.target.parentElement.id);
                handler(id);
            }
        })
    }

    bindToggleTodo(handler) {
        this.todoList.addEventListener('change', event => {
            if (event.target.type == 'checkbox') {
                const id = parseInt(event.target.parentElement.id);
                handler(id);
            }
        })
    }

    bindshowTasks(handler){
        this.mainList.addEventListener('click', event => {
            if(event.target.className == 'main-list-li'){
                const value = (event.target.textContent);
                handler(value);
            }
        })
    }
}

class Controller {
    constructor(name, model, view) {
        this.name = name;
        this.model = model;
        this.view = view;


        let title = document.querySelector('.title');
        title.textContent = name;

        let list = document.createElement('li');
        list.textContent = name;
        list.id = `list${++counter}`;
        list.classList = 'main-list-li';
        document.querySelector('.main-list').appendChild(list);

        this.onTodoListChanged(this.model.todos);

        console.log("Inside controller constructor", this);

        this.view.bindAddTodo(this.handleAddTodo);
        this.view.bindDeleteTodo(this.handleDeleteTodo);
        this.view.bindToggleTodo(this.handleToggleTodo);
        this.view.bindshowTasks(this.handleShowTasksList);
        // this.view.bindCreateNewList(createNewList);
        this.model.bindTodoListChanged(this.onTodoListChanged);
    }


    handleAddTodo = (text) => {
        console.log("inside handleAddToDO:",this)
        this.model.addTodos(text);
    }

    handleDeleteTodo = (id) => {
        this.model.deleteTodo(id);
    }

    handleToggleTodo = (id) => {
        this.model.toggleTodo(id);
    }

    handleShowTasksList = (name) => {
        this.model.showTasksList(name);
    }

    onTodoListChanged = (todos) => {
        this.view.displayTodos(todos)
    }

}

const app = new Controller('list1', new Model('list1'), new View('list1'));
const addbutton = document.querySelector('.add-list');

addbutton.addEventListener('click', () => createNewList());

function createNewList() {

    let listName = prompt('Enter List name:', '');
    let newList = new Controller(listName, new Model(listName), new View(listName));
}
