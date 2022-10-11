import _ from 'lodash';
import { Project } from 'Modules/project.js';

export class ProjectController {
  constructor() {
    this.projects = [];
  }
  doLoadProjects() {
    return this.projects;
  }
  doCreateProject(projectTitle) {
    if(!this.doProjectExists(projectTitle)) {
      this.projects.push(new Project(projectTitle, ''));
      console.log('Add project ' + projectTitle);
    } else {
      console.log('Project ' + projectTitle + ' already exists.');
    }
  }
  doProjectExists(projectTitle) {
    if(!this.projects.length) return false;
    else return _.some(this.projects, p => projectTitle === p.getTitle);
  }
}