import { format } from 'date-fns';

function task(taskObj) {
    let name = taskObj.name;
    const createDate = format(new Date(), 'dd/MM/yyyy');
    let dueDate = format(new Date(taskObj.dueDate), 'dd/MM/yyyy') || 'No Due Date';
    let priority = taskObj.priority || 'medium';
    let subTasks = taskObj.subTasks || [];
    let complete = taskObj.complete || false;
    //format(new Date(2014, 1, 11), 'yyyy-MM-dd')
    // Get attributes
    const getDetails = () => { return {name, createDate, dueDate, priority, subTasks, complete} };
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
        getDetails,
    }
}

export default task;