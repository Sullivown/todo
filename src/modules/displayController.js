import PubSub from 'pubsub-js';
import task from './task';

const displayController = (function() {
    // Cache DOM
    const body = document.querySelector('body');
    
    // Initial render to set up page structure
    const initRender = () => {
        const header = document.createElement('header');
        header.textContent = 'This is the header';
        body.appendChild(header);

        const main = document.createElement('main');
        body.appendChild(main);

        const projects = document.createElement('div');
        projects.setAttribute('id', 'projects');
        
        const projectsList = document.createElement('ul');
        projectsList.setAttribute('id', 'projects-list');
        projects.appendChild(projectsList);

        const addProjectInput = document.createElement('input');
        addProjectInput.setAttribute('type', 'text');
        addProjectInput.setAttribute('id', 'add-project-input');
        projects.appendChild(addProjectInput);

        const addProjectButton = document.createElement('button');
        addProjectButton.textContent = 'Add New Project';
        addProjectButton.addEventListener('click', handleAddProjectClick);
        projects.appendChild(addProjectButton);

        const tasks = document.createElement('div');
        tasks.setAttribute('id', 'tasks');
        tasks.textContent = 'This is the tasks area';

        main.appendChild(projects);
        main.appendChild(tasks);

        const footer = document.createElement('footer');
        footer.textContent = 'This is the footer';
        body.appendChild(footer);

        PubSub.publish('initRenderComplete');
    }

    const renderProjects = (projects) => {
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';

        for (const project in projects) {
            const projectLi = document.createElement('li');
            projectLi.dataset.projectId = project;
            projectLi.textContent += projects[project].getName();
            projectLi.addEventListener('click', handleProjectClick);

            projectsList.appendChild(projectLi);
        }
    }

    const renderTasks = (tasks) => {
        const tasksDiv = document.getElementById('tasks');
        tasksDiv.innerHTML = '';
        
        const addTaskDiv = document.createElement('div');
        addTaskDiv.setAttribute('id', 'add-task-div');
        tasksDiv.appendChild(addTaskDiv);

        const addTaskNameInput = document.createElement('input');
        addTaskNameInput.setAttribute('id', 'add-task-input-name');
        addTaskNameInput.setAttribute('type', 'text');
        addTaskDiv.appendChild(addTaskNameInput);

        const addTaskDateInput = document.createElement('input');
        addTaskDateInput.setAttribute('id', 'add-task-input-date');
        addTaskDateInput.setAttribute('type', 'date');
        addTaskDiv.appendChild(addTaskDateInput);

        const addTaskButton = document.createElement('button');
        addTaskButton.textContent = 'Add New Task'
        addTaskButton.addEventListener('click', handleAddTaskClick);
        addTaskDiv.appendChild(addTaskButton);

        const taskList = document.createElement('ul');
        taskList.setAttribute('id', 'task-list');

        for (const task in tasks) {
            const currentTask = tasks[task].getDetails();
            const taskLi = document.createElement('li');
            taskLi.dataset.taskId = task;
            taskLi.classList.add('task-li');
            taskLi.addEventListener('click', handleExpandTaskClick);

            const completedCheckbox = document.createElement('input');
            completedCheckbox.setAttribute('type', 'checkbox');
            completedCheckbox.addEventListener('click', handleTaskCompletedClick);
            taskLi.appendChild(completedCheckbox);
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = currentTask.name;
            taskLi.appendChild(nameSpan);

            const dueDateSpan = document.createElement('span');
            dueDateSpan.classList.add('due-date-span');
            dueDateSpan.textContent = currentTask.dueDate;
            taskLi.appendChild(dueDateSpan);

            // Task complete/incomplete logic
            if (currentTask.complete) {
                completedCheckbox.checked = true;
                taskLi.classList.add('task-complete');
            };

            
            
            taskList.appendChild(taskLi)
        }

        tasksDiv.appendChild(taskList);
    }

    const expandTask = (taskObj) => {
        const task = taskObj.getDetails();
        const taskDetailsModal = document.createElement('div');
        taskDetailsModal.classList.add('task-details-modal-background');

        const taskDetailsDiv = document.createElement('div');
        taskDetailsDiv.classList.add('task-details-modal-div');
        taskDetailsDiv.textContent = task.name;

        taskDetailsModal.appendChild(taskDetailsDiv);;

        const body = document.querySelector('body');
        body.appendChild(taskDetailsModal);
    }

    // Click handlers
    const handleProjectClick = (event) => {
        PubSub.publish('projectClicked', parseInt(event.target.dataset.projectId))
    }

    const handleAddProjectClick = () => {
        const addProjectInput = document.getElementById('add-project-input');
        PubSub.publish('addProjectClicked', addProjectInput.value);
        addProjectInput.value = '';
    }

    const handleAddTaskClick = () => {
        const addTaskNameInput = document.getElementById('add-task-input-name');
        const addTaskDateInput = document.getElementById('add-task-input-date');
        PubSub.publish('addTaskClicked', {
            'name': addTaskNameInput.value,
            'dueDate': addTaskDateInput.value
        });
        addTaskNameInput.value = '';
    }

    const handleTaskCompletedClick = (event) => {
        PubSub.publish('completeTaskClicked', {
            'id': event.target.parentNode.dataset.taskId
        })
    }

    const handleExpandTaskClick = (event) => {
        if (event.target.nodeName !== 'INPUT') {
            const taskId = event.target.parentNode.dataset.taskId || event.target.dataset.taskId;
            PubSub.publish('expandTaskClicked', { taskId });
        };
    }

    // Pub/Sub
    PubSub.subscribe('DOMLoaded', initRender);

    PubSub.subscribe('projectsChanged', (msg, data) => {
        renderProjects(data.projects);
        }
    );
    
    PubSub.subscribe('projectsChanged', (msg, data) => {
        const { currentProject, projects } = data;
        renderTasks(data.projects[currentProject].getTasks());
    });

    PubSub.subscribe('currentProjectChanged', (msg, data) => {
        const { currentProject, projectObj } = data;
        renderTasks(projectObj.getTasks());
    });

    PubSub.subscribe('tasksChanged', (msg, data) => {
        renderTasks(data);
    })

    PubSub.subscribe('taskDataSent', (msg, data) => {
        expandTask(data);
    })

    return {
        renderProjects,
    }
})();

export default displayController;