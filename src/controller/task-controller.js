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
    if(0 == tasks.length) return false;
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
  relocate(oldProjectKey, newProjectKey, oldTitle, newTask) {
    // Check if new task title already exists in new project
    const idxNewTask = this.#getIndex(newProjectKey, newTask.getTitle);
    if(-1 !== idxNewTask) return false;
    // Edit thew new task
    if(!this.edit(oldProjectKey, oldTitle, newTask)) return false;
    // Move task in the new project and remove the old one
    this.add(newProjectKey, this.findTask(oldProjectKey, newTask.getTitle));
    this.remove(oldProjectKey, newTask.getTitle);
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  edit(projectKey, oldTitle, newTask) {
    const idxOldTask = this.#getIndex(projectKey, oldTitle);
    if(-1 === idxOldTask) return false;
    const oldTask = this.fetch(projectKey)[idxOldTask];
    if((oldTitle !== newTask.getTitle) && (this.#existTask(projectKey, newTask.getTitle))) return false;
    // Change task type (remove old and insert it again)
    if(oldTask.getType !== newTask.getType) {
      this.remove(projectKey, oldTitle);
      this.add(projectKey, newTask);
    } else {
      this.fetch(projectKey)[idxOldTask].setTitle = newTask.getTitle;
      this.fetch(projectKey)[idxOldTask].setDescription = newTask.getDescription;
      this.fetch(projectKey)[idxOldTask].setDueDate = newTask.getDueDate;
      this.fetch(projectKey)[idxOldTask].setPriority = newTask.getPriority;
      this.fetch(projectKey)[idxOldTask].setDone = oldTask.getDone;
      if(newTask.getType === mTask.taskType.note) {
        this.fetch(projectKey)[idxOldTask].setNote = newTask.getNote;
      } else {
        // TODO: manage list
      }
    }
    this.storageController.serialize(this.mapTasks);
    return true;
  }
}