function task(taskObj) {
    let name = taskObj.name;
    let dueDate = taskObj.dueDate || 'No Due Date';
    let priority = taskObj.priority || 'medium';
    let subTasks = taskObj.subTasks || [];
    let complete = taskObj.complete || false;
 
    // Get attributes
    const getName = () => name;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    const getSubTasks = () => subTasks;
    const getComplete = () => complete;

    // Edit project attributes
    const setName = (newName) => {
        name = newName;
    }

    const setDueDate = (newDueDate) => {
        dueDate = newDueDate;
    }

    const setPriority = (newPriority) => {
        priority = newPriority;
    }

    // Add sub task
    const addSubTask = (newSubTask) => {
        subTasks.push(newSubTask);
    }

    // Delete sub task
    const deleteSubTask = (subTask) => {
        const index = subTasks.indexOf(subTask);
        subTasks.splice(index, 1);
    }

    // Toggle complete
    const toggleComplete = () => {
        complete = !complete;
    }

    return {
        getName,
        setName,
        getDueDate,
        setDueDate,
        getPriority,
        setPriority,
        getSubTasks,
        addSubTask,
        deleteSubTask,
        getComplete,
        toggleComplete,
    }
}

export default task;