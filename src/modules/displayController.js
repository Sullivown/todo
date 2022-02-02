import PubSub from 'pubsub-js';
import projects from './projects';

const displayController = (function() {
    // Cache DOM
    const body = document.querySelector('body');

    // Tracker variables
    let currentProject = null;

    const updateCurrentProject = (project) => {
        currentProject = project;
    }
    
    const render = () => {
        body.textContent = 'Hello';
    }

    // Pub/Sub

    PubSub.subscribe('DOMLoaded', render);

    return {
        render,
    }
})();

export default displayController;