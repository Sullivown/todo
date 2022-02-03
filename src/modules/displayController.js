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

        const projects = document.createElement('div');
        projects.setAttribute('id', 'projects');
        projects.textContent = 'This is the projects area';

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

    const renderProjects = (msg, data) => {
        const projectsDiv = document.getElementById('projects');
        projectsDiv.innerHTML = '';

        for (const project in data) {
            projectsDiv.textContent += data[project].getName();
        }

        renderTasks(data[0]);
    }

    const renderTasks = (project) => {
        const tasksDiv = document.getElementById('tasks');
        tasksDiv.innerHTML = '';

        const taskList = document.createElement('ul');

        const tasks = project.getTasks();

        for (const task in tasks) {
            const taskLi = document.createElement('li');
            taskLi.textContent += tasks[task].getName();

            taskList.appendChild(taskLi)
        }

        tasksDiv.appendChild(taskList);
    }

    // Pub/Sub
    PubSub.subscribe('DOMLoaded', initRender);
    PubSub.subscribe('projectsChanged', renderProjects);

    return {
        renderProjects,
    }
})();

export default displayController;