const projects = (() => {
    let projects = [];

    const getProjects = () => projects;

    // Add project
    const addProject = (newProject) => {
        projects.push(newProject);
    }

    // Delete project
    const deleteProject = (project) => {
        const index = projects.indexOf(project);
        projects.splice(index, 1);
    }

    return {
        getProjects,
        addProject,
        deleteProject,
    }
})()

export default projects;