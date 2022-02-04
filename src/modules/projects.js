import PubSub from "pubsub-js";
import project from "./project";

const projects = (() => {
    let projects = [];
    let currentProject = 0;

    const updateCurrentProject = (project) => {
        currentProject = project;
        const projectObj = projects[currentProject];
        PubSub.publish('currentProjectChanged', { currentProject, projectObj });
    }
    
    const getProjects = () => projects;

    // Add project
    const addProject = (newProject) => {
        projects.push(newProject);
        PubSub.publish('projectsChanged', { currentProject, projects });
    }

    // Delete project
    const deleteProject = (project) => {
        const index = projects.indexOf(project);
        projects.splice(index, 1);
        PubSub.publish('projectsChanged', { currentProject, projects });
    }

    //PubSub
    PubSub.subscribe('projectClicked', (msg, data) => {
            updateCurrentProject(data);
        }
    )

    PubSub.subscribe('addProjectClicked', (msg, data) => {
            const newProject = project({ 'name': data });
            addProject(newProject);
        }
    )

    return {
        getProjects,
        addProject,
        deleteProject,
        updateCurrentProject
    }
})()

export default projects;