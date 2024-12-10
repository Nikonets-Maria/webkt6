class TaskList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.tasks = this.loadTasksFromLocalStorage();
      this.render();
      this.addEventListeners();
    }
  
    render() {
        this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: block;
              font-family: sans-serif;
              background-color: #beffb8;
            }
            .container {
              border: 1px solid #ccc;
              padding: 1rem;
            }
            input[type="text"] {
              width: calc(100% - 70px);
              padding: 0.5rem;
              margin-bottom: 0.5rem;
              
            }
            button {
              padding: 0.5rem 1rem;
              background-color: #4CAF50;
              color: white;
              border: none;
              cursor: pointer;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            li {
              display: flex;
              align-items: center;
              margin-bottom: 0.5rem;
              padding: 0.5rem;
              border-bottom: 1px solid #00521a;
            }
            li.completed {
              opacity: 0.5;
              background-color: #36f482;
            }
            
            button.delete {
              background-color: #f44336;
              margin-left: auto;
            }
          </style>
          <div class="container">
            <input type="text" id="new-task" placeholder="Новая задача">
            <button id="add-task">Добавить</button>
            <ul id="task-list"></ul>
          </div>
        `;
      }
    
  
      addEventListeners() {
        this.shadowRoot.getElementById('add-task').addEventListener('click', this.addTask.bind(this));
        this.shadowRoot.getElementById('task-list').addEventListener('click', this.handleTaskListClick.bind(this));
      }
    
    
      addTask() {
        const taskText = this.shadowRoot.getElementById('new-task').value.trim();
        if (taskText) {
          this.tasks.push({ text: taskText, completed: false });
          this.updateTaskList();
          this.shadowRoot.getElementById('new-task').value = '';
        }
      }
    
      handleTaskListClick(event) {
        if (event.target.tagName === 'INPUT') {
          const taskId = event.target.dataset.taskId;
          this.toggleTaskCompletion(taskId);
        } else if (event.target.classList.contains('delete')) {
          const taskId = event.target.dataset.taskId;
          this.deleteTask(taskId);
        }
      }
  
    toggleTaskCompletion(taskId) {
      const taskIndex = this.tasks.findIndex((task) => task.text === taskId);
      this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
      this.saveTasksToLocalStorage();
      this.updateTaskList();
    }
  
    deleteTask(taskId) {
      const taskIndex = this.tasks.findIndex((task) => task.text === taskId);
      this.tasks.splice(taskIndex, 1);
      this.saveTasksToLocalStorage(); 
      this.updateTaskList();
    }
  
    updateTaskList() {
        const taskList = this.shadowRoot.getElementById('task-list');
        taskList.innerHTML = this.tasks.map((task, index) => `
            <li data-task-id="${task.text}" class="${task.completed ? 'completed' : ''}">
                <input type="checkbox" data-task-id="${task.text}" ${task.completed ? 'checked' : ''} >
                <span>${task.text}</span>
                <button class="delete" data-task-id="${task.text}">Удалить</button>
            </li>
        `).join('');
    }
  
    saveTasksToLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  
    loadTasksFromLocalStorage() {
      const tasksJSON = localStorage.getItem('tasks');
      return tasksJSON ? JSON.parse(tasksJSON) : [];
    }
  
    disconnectedCallback() {
        console.log('Компонент удален');
    }
  }
  
  customElements.define('task-list', TaskList);
  