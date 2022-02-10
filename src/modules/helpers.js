function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function processTaskForm(taskObj) {
    if (taskObj.dueDate == '') {
        taskObj.dueDate = 'No Due Date';
    };

    if (taskObj.name == '') {
        taskObj.name = 'Unnamed task';
    }

    return taskObj;
}

export { capitalizeFirstLetter, processTaskForm };