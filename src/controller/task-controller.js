import * as mTask from 'Modules/task.js';
import { StorageController } from 'Controller/storage-controller.js';
import { v4 as uuidv4 } from 'uuid';

export const taskSortMode = {
  addDateAscending:   'Add date ascending',
  addDateDescending:  'Add date descending',
  dueDateAscending:   'Due date ascending',
  dueDateDescending:  'Due date descending',
  alphabAscending:    'Alphabetically ascending',
  alphabDescending:   'Alphabetically descending',
  priorityAscending:  'Priority ascending',
  priorityDescending: 'Priority descending'
};

export class TaskController {
  constructor() {
    this.mapTasks = new Map();
    this.storageController = new StorageController('taskTable');
    this.taskPriorityLevel = new Map();
    let level = 0;
    for (const property in mTask.taskPriority) {
      this.taskPriorityLevel.set(property, level++);
    }
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
                                  : [];
  }
  fetchSorted(projectKey, mode) {
    if(!this.exist(projectKey)) return [];
    let tasks = [...this.mapTasks.get(projectKey)];
    switch(mode) {
      case taskSortMode.alphabAscending:
      case taskSortMode.alphabDescending:
        tasks.sort((a,b) => a.getTitle.localeCompare(b.getTitle));
        break;
      case taskSortMode.dueDateAscending:
      case taskSortMode.dueDateDescending:
        tasks.sort((a,b) => { 
          const aDate = (a.getDueDate && a.getDueDate !== '') ? new Date(a.getDueDate) : new Date(2000, 1, 1);
          const bDate = (b.getDueDate && b.getDueDate !== '') ? new Date(b.getDueDate) : new Date(2000, 1, 1);
          return aDate - bDate; 
        });
        break;
      case taskSortMode.priorityAscending:
      case taskSortMode.priorityDescending:
        tasks.sort((a,b) => {
          return this.taskPriorityLevel.get(a.getPriority) - this.taskPriorityLevel.get(b.getPriority);
        })
        break;
      default:
        break;
    }
    // For descending mode reverse the buffer
    if((mode === taskSortMode.dueDateDescending) ||
       (mode === taskSortMode.addDateDescending) ||
       (mode === taskSortMode.priorityDescending) ||
       (mode === taskSortMode.alphabDescending)) {
      return tasks.reverse();
    }
    return tasks;
  }
  add(projectKey, task) {
    if(!this.exist(projectKey)) return false;
    if(this.#existTask(projectKey, task.getID)) return false;
    this.fetch(projectKey).push(task);
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  remove(projectKey, id) {
    if(!this.exist(projectKey)) return false;
    const tasks = this.fetch(projectKey);
    /* Save the number of projects */
    const nTasks = tasks.length;
    /* Filter projects */
    this.mapTasks.set(projectKey, _.filter(tasks, (t => !(id === t.getID))));
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
                                                 uuidv4(),
                                                 task.title, 
                                                 task.description, 
                                                 task.dueDate, 
                                                 task.priority);
    if(taskType === mTask.taskType.note) {
      objTask.setNote = task.note;
    } else {
      task.list.forEach(a => objTask.add(a.id, a.action, a.done));
    }
    return objTask;
  }
  #existTask(projectKey, id) {
    const tasks = this.fetch(projectKey);
    if(0 == tasks.length) return false;
    else return _.some(tasks, t => id === t.getID);
  }
  #getIndex(projectKey, id) {
    const tasks = this.fetch(projectKey);
    return _.findIndex(tasks, t => id === t.getID);
  }
  findTask(projectKey, id) {
    const index = this.#getIndex(projectKey, id);
    return -1 !== index ? this.fetch(projectKey)[index] : null;
  }
  changeTaskState(projectKey, id, state) {
    this.findTask(projectKey, id).setDone = state;
    this.storageController.serialize(this.mapTasks);
  }
  relocate(oldProjectKey, newProjectKey, oldID, newTask) {
    // Check if new task id already exists in new project
    const idxNewTask = this.#getIndex(newProjectKey, newTask.getID);
    if(-1 !== idxNewTask) return false;
    // Edit thew new task
    if(!this.edit(oldProjectKey, oldID, newTask)) return false;
    // Move task in the new project and remove the old one
    this.add(newProjectKey, this.findTask(oldProjectKey, newTask.getID));
    this.remove(oldProjectKey, newTask.getID);
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  edit(projectKey, oldID, newTask) {
    const idxOldTask = this.#getIndex(projectKey, oldID);
    if(-1 === idxOldTask) return false;
    const oldTask = this.fetch(projectKey)[idxOldTask];
    if((oldID !== newTask.getID) && (this.#existTask(projectKey, newTask.getID))) return false;
    // Change task type (remove old and insert it again)
    if(oldTask.getType !== newTask.getType) {
      this.remove(projectKey, oldID);
      this.add(projectKey, newTask);
    } else {
      this.fetch(projectKey)[idxOldTask].setID = newTask.getID;
      this.fetch(projectKey)[idxOldTask].setTitle = newTask.getTitle;
      this.fetch(projectKey)[idxOldTask].setDescription = newTask.getDescription;
      this.fetch(projectKey)[idxOldTask].setDueDate = newTask.getDueDate;
      this.fetch(projectKey)[idxOldTask].setPriority = newTask.getPriority;
      this.fetch(projectKey)[idxOldTask].setDone = oldTask.getDone;
      if(newTask.getType === mTask.taskType.note) {
        this.fetch(projectKey)[idxOldTask].setNote = newTask.getNote;
      } else {
        this.fetch(projectKey)[idxOldTask].setCheckList = newTask.getCheckList;
      }
    }
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  editTaskActivity(projectKey, id, activity) {
    const task = this.findTask(projectKey, id);
    if(!task) return;
    task.edit(activity.id, activity.action, activity.state);
    this.storageController.serialize(this.mapTasks);
  }
  changeTaskActivityState(projectKey, id, activityID, state) {
    const task = this.findTask(projectKey, id);
    if(!task) return;
    task.changeState(activityID, state);
    this.storageController.serialize(this.mapTasks);
  }
  removeTaskActivity(projectKey, id, activityID) {
    const task = this.findTask(projectKey, id);
    if(!task) return;
    task.remove(activityID);
    this.storageController.serialize(this.mapTasks);
  }
}