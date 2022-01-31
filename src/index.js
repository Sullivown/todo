import projects from './modules/projects';
import project from './modules/project';
import task from './modules/tasks';
import './style.css';

// Test init
const project1 = project('Home');
projects.addProject(project1);

const task1 = task('Clean house', 'Wednesday');
project1.addTask(task1);

const subTask1 = task('Hoover stairs', 'Tuesday');
task1.addSubTask(subTask1);

console.log(projects.getProjects()[0].getTasks());