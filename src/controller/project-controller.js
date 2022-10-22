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
  create(projectTitle) {
    if(this.exist(projectTitle)) return;
    this.projects.push(new Project(projectTitle, ''));
    this.storageController.serialize(this.projects);
  }
  remove(projectTitle) {
    /* Save the number of projects */
    const nProjects = this.projects.length;
    /* Filter projects */
    this.projects = _.filter(this.projects, (p => !(projectTitle.toLowerCase() === p.getTitle.toLowerCase())));
    /* Check for serialization */
    if(this.projects.length !== nProjects) {
      this.storageController.serialize(this.projects);
    }
  }
  exist(projectTitle) {
    if(0 == this.projects.length) return false;
    else return _.some(this.projects, p => projectTitle.toLowerCase() === p.getTitle.toLowerCase());
  }
}