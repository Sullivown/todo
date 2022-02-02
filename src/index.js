import loadData from './modules/loadData';
import displayController from './modules/displayController';
import PubSub from 'pubsub-js';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    PubSub.publish('DOMLoaded')}
);