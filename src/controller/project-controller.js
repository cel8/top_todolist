import _ from 'lodash';
import { Project } from 'Modules/project.js';
import { StorageController } from 'Controller/storage-controller.js';

export class ProjectController {
  constructor() {
    this.projects = [];
    this.storageController = new StorageController();
  }
  load() {
    this.projects = this.storageController.deserialize();
    return this.projects;
  }
  create(title) {
    if(this.exist(title)) return false;
    this.projects.push(new Project(title, ''));
    this.storageController.serialize(this.projects);
    return true;
  }
  remove(title) {
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
    if(this.exist(newTitle)) return false;
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
}