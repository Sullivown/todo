import * as defaultData from '../assets/defaultData.json';
import projects from './projects';
import project from './project';
import task from './task';
import PubSub from 'pubsub-js';
import { format } from 'date-fns';

function getData() {
    // If local storage exists, load from there else use default data
    let data = localStorage.getItem('todos');
    if (!data) {
        data = JSON.stringify(defaultData.default);
        localStorage.setItem('todos', data);
    }
    
    return JSON.parse(data);
}

// Processes JSON data and adds it to the projects module
function loadData() {
    const data = getData();
    
    for (const projectObj in data.projects) {
        const newProject = project(data.projects[projectObj]);
        projects.addProject(newProject);

        for (const taskObj in data.projects[projectObj].tasks) {
            const newTask = task(data.projects[projectObj].tasks[taskObj]);
            newTask.getDueDate() == 'No Due Date' ? ' No Due Date' : newTask.setDueDate(format(new Date(newTask.getDueDate()), 'yyyy-MM-dd'));
            newProject.addTask(newTask);
        }
    }

    PubSub.publish('dataLoaded');
}

function updateLocalStorage() {
    console.log('Local storage updated');
    const projectsObj = {
        'projects': [],
    };
    const projectsArr = projects.getProjects()
    for (const project in projectsArr) {
        const newProject = projectsArr[project].getDetails();
        newProject.tasks = [];
        projectsObj.projects.push(newProject);

        const tasksArr = projectsArr[project].getTasks();
        for (const task in tasksArr) {
            const newTask = tasksArr[task].getDetails();
            console.log(newTask);
            projectsObj.projects[project].tasks.push(newTask);
        }

    }

    console.log(projectsObj)
    localStorage.setItem('todos', JSON.stringify(projectsObj));
}


PubSub.subscribe('initRenderComplete', loadData);
PubSub.subscribe('updateLocalStorage', updateLocalStorage);

export default loadData;