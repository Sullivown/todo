import PubSub from 'pubsub-js';
import projects from './projects';

const displayController = (function() {
    // Cache DOM
    const body = document.querySelector('body');
    
    // Initial render to set up page structure
    const initRender = () => {
        const header = document.createElement('header');
        header.textContent = 'This is the header';
        body.appendChild(header);

        const main = document.createElement('main');

        const projects = document.createElement('div');
        projects.setAttribute('id', 'projects');
        
        const projectsList = document.createElement('ul');
        projectsList.setAttribute('id', 'projects-list');
        projects.appendChild(projectsList);

        const addProjectButton = document.createElement('button');
        addProjectButton.textContent = 'Add New Project';
        projects.appendChild(addProjectButton);

        const tasks = document.createElement('div');
        tasks.setAttribute('id', 'tasks');
        tasks.textContent = 'This is the tasks area';

        main.appendChild(projects);
        main.appendChild(tasks);

        body.appendChild(main);

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
            projectLi.addEventListener('click', handleClick);

            projectsList.appendChild(projectLi);
        }
    }

    const renderTasks = (tasks) => {
        const tasksDiv = document.getElementById('tasks');
        tasksDiv.innerHTML = '';
        const taskList = document.createElement('ul');

        for (const task in tasks) {
            const taskLi = document.createElement('li');
            taskLi.textContent += tasks[task].getName();

            taskList.appendChild(taskLi)
        }

        tasksDiv.appendChild(taskList);
    }

    // Click handlers
    const handleClick = (event) => {
        console.log(event.target.dataset.projectId);
        PubSub.publish('projectClicked', parseInt(event.target.dataset.projectId))
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

    return {
        renderProjects,
    }
})();

export default displayController;