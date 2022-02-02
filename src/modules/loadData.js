import * as defaultData from '../assets/defaultData.json';
import projects from './projects';
import project from './project';
import task from './tasks';
import PubSub from 'pubsub-js';

function getData() {
    const localStorageData = null;

    // If local storage exists, load from there else use default data
    let data = localStorageData || defaultData.default;
    return data;
}

// Processes json data and adds it to thet projects module
function loadData() {
    const data = getData();
    
    for (const projectObj in data.projects) {
        const newProject = project(data.projects[projectObj]);
        projects.addProject(newProject);

        for (const taskObj in data.projects[projectObj].tasks) {
            const newTask = task(data.projects[projectObj].tasks[taskObj]);
            newProject.addTask(newTask);
        }
    }

    console.log('Data has been loaded!');
}

PubSub.subscribe('DOMLoaded', loadData);

export default loadData;