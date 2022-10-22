import { Project } from "Modules/project";

export class StorageController {
  constructor() {
    this.localStorageName = 'localTodoList';
  }
  doDeserialize() {
    let projects = [];
    const jsonProjects = JSON.parse(localStorage.getItem(this.localStorageName));
    if(jsonProjects) {
      projects = jsonProjects.map((project) => new Project(project.title, project.description));
    }
    return projects;
  }
  doSerialize(projects) {
    localStorage.setItem(this.localStorageName, JSON.stringify(projects));
  }
}