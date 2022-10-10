export class ProjectController {
  constructor() {
    this.projects = new Set();
  }
  doLoadProjects() {
    return this.projects;
  }
}