import * as mTask from 'Modules/task.js';
import { StorageController } from 'Controller/storage-controller.js';

export class TaskController {
  constructor() {
    this.mapTasks = new Map();
    this.taskFactory = new mTask.TaskFactory();
    this.storageController = new StorageController('taskTable');
  }
  static getInstance() {
    if(!this.instance) {
      this.instance = new TaskController();
    }
    return this.instance;
  }
  load() {
    this.mapTasks = this.storageController.deserialize();
    return this.mapTasks;
  }
  create(projectKey) {
    if(this.exist(projectKey)) return false;
    this.mapTasks.set(projectKey, []);
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  delete(projectKey) {
    if(!this.exist(projectKey)) return false;
    this.mapTasks.delete(projectKey);
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  exist(projectKey) {
    return this.mapTasks.has(projectKey);
  }
  fetch(projectKey) {
    return this.exist(projectKey) ? this.mapTasks.get(projectKey) 
                                  : null;
  }
  add(projectKey, task) {
    if(!this.exist(projectKey)) return false;
    if(this.#existTask(projectKey, task.title)) return false;
    const taskType = ((task.list) && (task.list.length > 0))  ? mTask.taskType.list : mTask.taskType.note;
    const objTask = this.taskFactory.createTask(taskType, 
                                                task.title, 
                                                task.description, 
                                                task.dueDate, 
                                                task.priority);
    if(taskType === mTask.taskType.note) {
      objTask.setNote = task.note;
    } else {
      // TODO: manage list
    }
    this.fetch(projectKey).push(objTask);
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  migrate(projectOldKey, projectNewKey) {
    if(!this.exist(projectOldKey) || this.exist(projectNewKey)) 
      return false;
    this.mapTasks.set(projectNewKey, this.mapTasks.get(projectOldKey));
    this.mapTasks.delete(projectOldKey);
    this.storageController.serialize(this.mapTasks);
  }
  createTask(task) {
    const taskType = ((task.list) && (task.list.length > 0))  ? mTask.taskType.list : mTask.taskType.note;
    const objTask = this.taskFactory.createTask(taskType, 
                                                task.title, 
                                                task.description, 
                                                task.dueDate, 
                                                task.priority);
    if(taskType === mTask.taskType.note) {
      objTask.setNote = task.note;
    } else {
      // TODO: manage list
    }
    return objTask;
  }
  #existTask(projectKey, title) {
    const tasks = this.fetch(projectKey);
    if(0 == tasks) return false;
    else return _.some(tasks, t => title.toLowerCase() === t.getTitle.toLowerCase());
  }
  #getIndex(projectKey, title) {
    const tasks = this.fetch(projectKey);
    return _.findIndex(tasks, t => title.toLowerCase() === t.getTitle.toLowerCase());
  }
  findTask(projectKey, titletitle) {
    const index = this.#getIndex(projectKey, titletitle);
    return -1 !== index ? this.fetch(projectKey)[index] : null;
  }
}