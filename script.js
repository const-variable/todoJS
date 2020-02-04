
let mainList = [];
// let todoList = document.querySelector('list-itmes').firstChild ? document.querySelector('list-itmes').firstChild  : '' 
class Model {
    constructor(todos) {
        this.todos = [
            { id: 1, text: 'Hello world', complete: true },
            // { id: 2, text: 'Create a todo app', complete: false },
            ...todos
        ]
    }

    addTodos(todoText) {
        const todo = {
            id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
            text: todoText,
            complete: false
        }

        this.todos.push(todo);
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

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback
    }

}

class View {
    constructor() {
        this.app = this.getElement('#root');

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
        // this.form.append(this.input, this.submitButton);

        // this.app.append(this.title, this.p, this.form, this.todoList);
        // console.log('>>> this.todoList', this.todoList, document.querySelector('#root'))
       
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
    }

    // bindCreateNewList(handler){
    //     this.app.addEventListener('click', event => {
    //         event.preventDefault();
    //         if(event.target.className == 'new-list'){
    //             handler(); 
    //         }
    //     })
    // }

    bindAddTodo(handler) {
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



}

class Controller {
    constructor(name, model, view) {
        this.name = name;
        this.model = model;
        this.view = view;


        let title = document.querySelector('.title');
        title.textContent = name;

        let firstList = document.createElement('li');
        firstList.textContent = name;
        document.querySelector('.main-list').appendChild(firstList);
        
        this.onTodoListChanged(this.model.todos);

        this.view.bindAddTodo(this.handleAddTodo);
        this.view.bindDeleteTodo(this.handleDeleteTodo);
        this.view.bindToggleTodo(this.handleToggleTodo);
        // this.view.bindCreateNewList(createNewList);
        this.model.bindTodoListChanged(this.onTodoListChanged);
    }

    onTodoListChanged = (todos) => {
        this.view.displayTodos(todos)
    }

    handleAddTodo = (text) => {
        this.model.addTodos(text);
    }

    handleDeleteTodo = (id) => {
        this.model.deleteTodo(id);
    }

    handleToggleTodo = (id) => {
        this.model.toggleTodo(id);
    }


}
// function createNewList(){
//     return new Controller(new Model(), new View());
// }
const app = new Controller('List 1', new Model([]), new View());
const addbutton = document.querySelector('.add-list');

addbutton.addEventListener('click', () => createNewList());

function createNewList() {
    // const domNodes = document.querySelector('#root');
    // let child = domNodes.lastElementChild;
    // while(child){
    //     domNodes.removeChild(child);
    //     child = domNodes.lastElementChild;
    // }
    let listName = prompt('Enter List name:', '');

    // let listNode = document.createElement('li');
    // listNode.textContent = listName;

    // document.querySelector('.main-list').appendChild(listNode);

    let newList = new Controller(listName, new Model([]), new View());
}