class Model {
    constructor(){
        this.todoElements = [
            {id: 1, text: 'Create a Todo App', isComplete: false},
            {id: 2, text: 'Watch star wars', isComplete: true}
        ]

        
    }

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback
      }

    addTodo(todoText){
        console.log('addTodo', todoText);
        const todo ={
            id: this.todoElements.length > 0 ? this.todoElements[this.todoElements.length-1].id + 1 : 1,
            text: todoText,
            isComplete: false 
        }

        this.todoElements.push(todo);
        console.log('elements', this.todoElements)
        this.onTodoListChanged(this.todoElements);

    }

    editTodo(id, text, isCompleteCheck){

    }

    toggleTodo(id){
        this.todoElements = this.todoElements.map(element =>  element.id == id ? {id: element.id, text: element.text, isComplete: !element.isComplete} : element )
        this.onTodoListChanged(this.todoElements);

    }

    deleteTodo(id){
        this.todoElements = this.todoElements.filter(todo=> todo.id !== id)
        this.onTodoListChanged(this.todoElements);
    }
}

class View {
    constructor(){
        this.app = this.getElement('#root');

        this.title = this.createElement('h1');
        this.title.textContent = 'ToDo App';

        this.form = this.createElement('form');

        this.input = this.createElement('input');
        this.input.type = 'text';
        this.input.placeholder= 'Enter text';
        this.input.name = 'todo';

        this.submitButton = this.createElement('button');
        this.submitButton.textContent = 'Submit';
        
        
        this.todoList = this.createElement('ul','todo-list');
      
        this.form.append(this.input, this.submitButton);
        
        this.app.append(this.title, this.form, this.todoList);
    }

    get _inputText(){
        // console.log('input val', this.input.value);
        return this.input.value;

    }

    _resetInputValue(){
         this.input.value = '';
    }

    createElement(tag, className){
        let element = document.createElement(tag);
        if(className){
            element.classList.add(className);
        }
        return element;
    }

    getElement(selector){
        let element = document.querySelector(selector);
        return element;
    }

    displayTodo(todos){
        console.log('display', todos);
        while(this.todoList.firstChild){
            this.todoList.removeChild(this.todoList.firstChild);
        }

        if(todos.length === 0){
            const p = this.createElement('p');
            p.textContent = 'Nothing in a TODO App';
            this.todoList.append(p);
        } else {
            todos.forEach(element => {
                const li = this.createElement('li');
                li.id = element.id;

                const checkbox = this.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = element.isComplete;

                const text = this.createElement('span')
                // text.textContent = element.text;

                if(element.isComplete){
                    const strike = this.createElement('s');
                    strike.textContent = element.text;
                    text.append(strike);
                } else {
                    text.textContent = element.text;
                }

                const deleteButton = this.createElement('button', 'delete');
                deleteButton.textContent = 'X';
                li.append(checkbox,text,deleteButton);

                this.todoList.append(li);

            })
        }
    }


    bindAddTodo(handler){
        // console.log('inside bindAddTo Do', this._inputText);
        this.form.addEventListener('sumbit', e => {
            e.preventDefault();
            if(this._inputText){
                handler(this._inputText);
                this._resetInputValue();
            }
        })
    }

    bindDeleteTodo(handler){
        this.todoList.addEventListener('click', e => {
            if(e.target.className == 'delete'){
                const id = e.target.parentElement.id;
                handler(id);
            }
        })
    }

    bindToggleTodo(handler){
        this.todoList.addEventListener('change', e => {
            if(e.target.type == 'checkbox'){
                const id = parseInt(e.target.parentElement.id)
                handler(id);
            }
        } )
    }

}

class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;

        this.onTodoListChanged(this.model.todoElements);

        this.view.bindAddTodo(this.handleAddTodo);
        this.view.bindDeleteTodo(this.handleDeleteTodo);
        this.view.bindToggleTodo(this.handleToggleTodo);

        this.model.bindTodoListChanged(this.onTodoListChanged)
    }

    onTodoListChanged = (todos) => this.view.displayTodo(todos);

    handleAddTodo = (text) => {
        console.log('inside controller', text);
        this.model.addTodo(text);
    }

    handleDeleteTodo = (id) => {
        this.model.deleteTodo(id);
    }

    handleToggleTodo = (id) =>{
        this.model.toggleTodo(id);
    }
    
}

const app = new Controller(new Model(), new View());