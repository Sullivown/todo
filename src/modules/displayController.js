import PubSub from 'pubsub-js';
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
        tasksDiv.appendChild(addTaskDiv);

        const addTaskInput = document.createElement('input');
        addTaskInput.setAttribute('id', 'add-task-input');
        addTaskDiv.appendChild(addTaskInput);

        const addTaskButton = document.createElement('button');
        addTaskButton.textContent = 'Add New Task'
        addTaskButton.addEventListener('click', handleAddTaskClick);
        addTaskDiv.appendChild(addTaskButton);

        const taskList = document.createElement('ul');
        taskList.setAttribute('id', 'task-list');

        for (const task in tasks) {
            const currentTask = tasks[task];
            const taskLi = document.createElement('li');
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = currentTask.getName();
            taskLi.appendChild(nameSpan);

            const dueDateSpan = document.createElement('span');
            dueDateSpan.textContent = currentTask.getDueDate();
            taskLi.appendChild(dueDateSpan);

            taskList.appendChild(taskLi)
        }

        tasksDiv.appendChild(taskList);
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
        const addTaskInput = document.getElementById('add-task-input');
        PubSub.publish('addTaskClicked', addTaskInput.value);
        addTaskInput.value = '';
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

    return {
        renderProjects,
    }
})();

export default displayController;