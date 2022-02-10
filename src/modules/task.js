import { format } from 'date-fns';

function task(taskObj) {
    let name = taskObj.name;
    const createDate = format(new Date(), 'yyyy-MM-dd');
    let dueDate = taskObj.dueDate == 'No Due Date' ?  'No Due Date' : format(new Date(taskObj.dueDate), 'yyyy-MM-dd');
    let priority = taskObj.priority || 'medium';
    let description = taskObj.description || '';
    let complete = taskObj.complete || false;
  
    // Get attributes
    const getDetails = () => { return {name, createDate, dueDate, priority, description, complete} };
    const getName = () => name;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    const getComplete = () => complete;

    // Edit project attributes
    const editDetails = (attribs) => {
        setName(attribs.name);
        setDueDate(format(new Date(attribs.dueDate), 'yyyy-MM-dd'));
        setPriority(attribs.priority);
        setDescription(attribs.description);
    }

    const setName = (newName) => {
        name = newName;
    }

    const setDueDate = (newDueDate) => {
        dueDate = newDueDate;
    }

    const setPriority = (newPriority) => {
        priority = newPriority;
    }

    const setDescription = (newDescription) => {
        description = newDescription;
    }

    // Toggle complete
    const toggleComplete = () => {
        complete = !complete;
    }

    return {
        editDetails,
        getName,
        setName,
        getDueDate,
        setDueDate,
        getPriority,
        setPriority,
        getComplete,
        toggleComplete,
        getDetails,
    }
}

export default task;