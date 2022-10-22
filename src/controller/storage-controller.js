import { Project } from "Modules/project";

export class StorageController {
  constructor() {
    this.localStorageName = 'localTodoList';
  }
  deserialize() {
    let projects = [];
    const jsonProjects = JSON.parse(localStorage.getItem(this.localStorageName));
    if(jsonProjects) {
      projects = jsonProjects.map((project) => new Project(project.title, project.description));
    }
    return projects;
  }
  serialize(projects) {
    localStorage.setItem(this.localStorageName, JSON.stringify(projects));
  }
}