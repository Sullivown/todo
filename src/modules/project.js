function project(name) {
    let tasks = [];

    // Get attributes
    const getName = () => name;
    const getTasks = () => tasks;

    // Edit project
    const editName = (newName) => {
        name = newName;
    }

    // Add new task
    const addTask = (task) => {
        tasks.push(task);
    }

    // Delete task
    const deleteTask = (task) => {
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
    }

    return {
        getName,
        getTasks,
        editName,
        addTask,
        deleteTask,
    }
}

export default project;