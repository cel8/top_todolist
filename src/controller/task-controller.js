import * as mTask from 'Modules/task.js';
import { StorageController } from 'Controller/storage-controller.js';

export class TaskController {
  constructor() {
    this.mapTasks = new Map();
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
    this.fetch(projectKey).push(this.createTask(task));
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  remove(projectKey, title) {
    if(!this.exist(projectKey)) return false;
    const tasks = this.fetch(projectKey);
    /* Save the number of projects */
    const nTasks = tasks.length;
    /* Filter projects */
    this.mapTasks.set(projectKey, _.filter(tasks, (t => !(title.toLowerCase() === t.getTitle.toLowerCase()))));
    /* Check for serialization */
    if(this.fetch(projectKey).length === nTasks) return false;
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  migrate(projectOldKey, projectNewKey) {
    if(!this.exist(projectOldKey) || this.exist(projectNewKey)) 
      return false;
    this.mapTasks.set(projectNewKey, this.mapTasks.get(projectOldKey));
    this.mapTasks.delete(projectOldKey);
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  createTask(task) {
    const taskType = ((task.list) && (task.list.length > 0))  ? mTask.taskType.list : mTask.taskType.note;
    const objTask = mTask.TaskFactory.createTask(taskType, 
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
  findTask(projectKey, title) {
    const index = this.#getIndex(projectKey, title);
    return -1 !== index ? this.fetch(projectKey)[index] : null;
  }
  changeTaskState(projectKey, title, state) {
    this.findTask(projectKey, title).setDone = state;
    this.storageController.serialize(this.mapTasks);
  }
}