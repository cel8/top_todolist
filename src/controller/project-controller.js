import _ from 'lodash';
import { Project } from 'Modules/project.js';
import { TaskController } from 'Controller/task-controller.js';
import { StorageController } from 'Controller/storage-controller.js';

export class ProjectController {
  constructor() {
    this.projects = [];
    this.storageController = new StorageController('projectTable');
    this.taskController = TaskController.getInstance();
  }
  static getInstance() {
    if(!this.instance) {
      this.instance = new ProjectController();
    }
    return this.instance;
  }
  load() {
    this.projects = this.storageController.deserialize();
    // Load the tasks
    this.taskController.load();
  }
  add(title, description = '') {
    if(this.exist(title)) return false;
    if(!this.taskController.create(title)) return false;
    this.projects.push(new Project(title, description));
    this.storageController.serialize(this.projects);
    return true;
  }
  remove(title) {
    /* Delete related tasks */
    if(!this.taskController.delete(title)) return false;
    /* Save the number of projects */
    const nProjects = this.projects.length;
    /* Filter projects */
    this.projects = _.filter(this.projects, (p => !(title.toLowerCase() === p.getTitle.toLowerCase())));
    /* Check for serialization */
    if(this.projects.length === nProjects) return false;
    this.storageController.serialize(this.projects);
    return true;
  }
  find(title) {
    const index = this.#getIndex(title);
    return -1 !== index ? this.projects[index] : null;
  }
  edit(oldTitle, newTitle, description = null) {
    const index = this.#getIndex(oldTitle);
    if(-1 === index) return false;
    if((oldTitle !== newTitle) && (this.exist(newTitle))) return false;
    if((oldTitle !== newTitle) && (!this.taskController.migrate(oldTitle, newTitle))) return false;
    this.projects[index].setTitle = newTitle;
    if(description) this.projects[index].setDescription = description;
    this.storageController.serialize(this.projects);
    return true;
  }
  exist(title) {
    if(0 == this.projects.length) return false;
    else return _.some(this.projects, p => title.toLowerCase() === p.getTitle.toLowerCase());
  }
  #getIndex(title) {
    return _.findIndex(this.projects, p => title.toLowerCase() === p.getTitle.toLowerCase());
  }
  getProjects() {
    return this.projects;
  }
  getProjectsTitle() {
    const projectsTitle = [];
    this.projects.forEach(p => projectsTitle.push(p.getTitle));
    return projectsTitle;
  }
}
