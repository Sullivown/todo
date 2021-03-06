import PubSub from "pubsub-js";

function project(projectObj) {
    let name = projectObj.name || 'Unnamed Project';
    let tasks = [];

    // Get attributes
    const getName = () => name;
    const getTasks = () => tasks;
    const getDetails = () => { return { name, tasks } };

    // Edit project
    const editName = (newName) => {
        name = newName;
    }

    // Add new task
    const addTask = (task) => {
        tasks.push(task);
        PubSub.publish('tasksChanged', tasks);
        PubSub.publish('updateLocalStorage');
    }

    // Delete task
    const deleteTask = (taskId) => {;
        tasks.splice(taskId, 1);
        PubSub.publish('tasksChanged', tasks);
        PubSub.publish('updateLocalStorage');
    }

    return {
        getName,
        getTasks,
        getDetails,
        editName,
        addTask,
        deleteTask,
    }
}

export default project;