import PubSub from 'pubsub-js';
import { capitalizeFirstLetter, processTaskForm } from './helpers';
import { format } from 'date-fns';


const displayController = (function() {
    // Cache DOM
    const body = document.querySelector('body');
    
    // Initial render to set up page structure
    const initRender = () => {
        const header = document.createElement('header');
        header.textContent = 'ToDoodle Bug';
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
        console.log('Projects rendered');
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
            dueDateSpan.textContent = currentTask.dueDate == 'No Due Date' ? 'No Due Date' : format(new Date(currentTask.dueDate), 'dd/MM/yyyy');
            taskLi.appendChild(dueDateSpan);

            // Task complete/incomplete logic
            if (currentTask.complete) {
                completedCheckbox.checked = true;
                taskLi.classList.add('task-complete');
            };

            taskList.appendChild(taskLi)
        }

        tasksDiv.appendChild(taskList);
        console.log('Tasks rendered')
    }

    const expandTask = (taskObj) => {
        const task = taskObj.getDetails();
        const taskDetailsModal = document.createElement('div');
        taskDetailsModal.classList.add('task-details-modal-background');

        const taskDetailsDiv = document.createElement('div');
        taskDetailsDiv.classList.add('task-details-modal-div');
        taskDetailsDiv.dataset.taskId = taskObj.id;
        
        // Task name
        const nameInput = document.createElement('input');
        nameInput.setAttribute('id', 'name-input');
        nameInput.value = task.name;
        const nameLabel = document.createElement('label');
        nameLabel.setAttribute('for', 'name-input');
        nameLabel.textContent = 'Task:';
        taskDetailsDiv.appendChild(nameLabel);
        taskDetailsDiv.appendChild(nameInput);
        
        // Due date
        const dueDateInput = document.createElement('input');
        dueDateInput.setAttribute('id', 'due-date-input');
        dueDateInput.setAttribute('type', 'date');
        dueDateInput.value = task.dueDate;
        const dueDateLabel = document.createElement('label');
        dueDateLabel.setAttribute('for', 'due-date-input');
        dueDateLabel.textContent = 'Due Date:';
        taskDetailsDiv.appendChild(dueDateLabel)
        taskDetailsDiv.appendChild(dueDateInput);

        // Priority
        const priorityInput = document.createElement('select');
        priorityInput.setAttribute('id', 'priority-input')
        const priorityLabel = document.createElement('label');
        priorityLabel.setAttribute('for', 'priority-input');
        priorityLabel.textContent = 'Priority:';

        // Array of priority options
        const priorityArr = ['high', 'medium', 'low'];
        for (const item in priorityArr) {
            const option = document.createElement('option');
            option.value = priorityArr[item];
            option.textContent = capitalizeFirstLetter(priorityArr[item]);

            if (option.value == task.priority) {
                option.selected = true;
            }

            priorityInput.appendChild(option);
        }

        taskDetailsDiv.appendChild(priorityLabel);
        taskDetailsDiv.appendChild(priorityInput);

        // Description
        const descriptionInput = document.createElement('textarea');
        descriptionInput.setAttribute('id', 'description-input');
        descriptionInput.textContent = task.description;
        const descriptionLabel = document.createElement('label');
        descriptionLabel.textContent = 'Description:';
        taskDetailsDiv.appendChild(descriptionLabel);
        taskDetailsDiv.appendChild(descriptionInput);

        // Controls
        const controlsDiv = document.createElement('div');
        controlsDiv.setAttribute('id', 'task-modal-controls');
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', handleSaveTaskClick);
        controlsDiv.appendChild(saveButton);
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', handleTaskCloseClick);
        controlsDiv.appendChild(closeButton);

        taskDetailsDiv.appendChild(controlsDiv);

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
        const task = {
            'name': document.getElementById('add-task-input-name').value,
            'dueDate': document.getElementById('add-task-input-date').value,
        }
        const processedTask = processTaskForm(task);
        PubSub.publish('addTaskClicked', processedTask);
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

    const handleSaveTaskClick = (event) => {
        // Get input values, put into an obj and send to pubsub
        const task = {
            'id': document.querySelector('.task-details-modal-div').dataset.taskId,
            'name': document.querySelector('#name-input').value,
            'dueDate': document.querySelector('#due-date-input').value,
            'priority': document.querySelector('#priority-input').value,
            'description': document.querySelector('#description-input').value
        }

        const processedTask = processTaskForm(task);

        PubSub.publish('taskEdited', processedTask);
    }

    const handleTaskCloseClick = (modal) => {
        document.querySelector('.task-details-modal-background').remove();
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

    PubSub.subscribe('taskEditComplete', (msg, data) => {
        handleTaskCloseClick();
    })

    return {
        renderProjects,
    }
})();

export default displayController;