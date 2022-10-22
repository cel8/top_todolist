import _ from 'lodash';
import { Project } from 'Modules/project.js';
import { StorageController } from 'Controller/storage-controller.js';

export class ProjectController {
  constructor() {
    this.projects = [];
    this.storageController = new StorageController();
  }
  doLoadProjects() {
    this.projects = this.storageController.doDeserialize();
    return this.projects;
  }
  doCreateProject(projectTitle) {
    if(this.doProjectExists(projectTitle)) return;
    this.projects.push(new Project(projectTitle, ''));
    this.storageController.doSerialize(this.projects);
  }
  doProjectExists(projectTitle) {
    if(0 == this.projects.length) return false;
    else return _.some(this.projects, p => projectTitle.toLowerCase() === p.getTitle.toLowerCase());
  }
}