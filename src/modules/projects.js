import PubSub from "pubsub-js";

const projects = (() => {
    let projects = [];

    // Tracker variables
    let currentProject = 0;

    const updateCurrentProject = (project) => {
        currentProject = project;
        PubSub.publish('currentProjectChanged');
    }
    
    const getProjects = () => projects;

    // Add project
    const addProject = (newProject) => {
        projects.push(newProject);
        PubSub.publish('projectsChanged', projects);
    }

    // Delete project
    const deleteProject = (project) => {
        const index = projects.indexOf(project);
        projects.splice(index, 1);
        PubSub.publish('projectsChanged', projects);
    }

    return {
        getProjects,
        addProject,
        deleteProject,
        updateCurrentProject
    }
})()

export default projects;