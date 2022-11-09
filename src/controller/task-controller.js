import * as mTask from 'Modules/task.js';
import { StorageController } from 'Controller/storage-controller.js';
import { DataPublisher } from './data-publisher.js';
import { v4 as uuidv4 } from 'uuid';
import { compareAsc } from 'date-fns'

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
    this.mapObservers = new Map();
    this.dataPublisher = new DataPublisher();
    this.storageController = new StorageController('taskTable');
    this.taskPriorityLevel = new Map();
    let level = 0;
    this.expirationTimerNotifier = new DataPublisher();
    this.expirationTimerObserver = null;
    this.expirationTimer = -1;
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
  create(projectKey, observer = null) {
    if(this.exist(projectKey)) return false;
    this.mapTasks.set(projectKey, []);
    this.subscribe(projectKey, observer);
    this.notify(projectKey);
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  connect(projectKey, observer) {
    if(!this.exist(projectKey)) return false;
    this.subscribe(projectKey, observer);
    this.notify(projectKey);
    return true;
  }
  delete(projectKey) {
    if(!this.exist(projectKey)) return false;
    this.mapTasks.delete(projectKey);
    this.unsubscribe(projectKey);
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
  fetchTotalTask(projectKey) {
    return this.fetch(projectKey).length;
  }
  fetchTotalUncompletedTask(projectKey) {
    return this.fetch(projectKey).filter(t => !t.getDone).length;
  }
  fetchTotalCompleteTask(projectKey) {
    return this.fetch(projectKey).filter(t => t.getDone).length;
  }
  add(projectKey, task) {
    if(!this.exist(projectKey)) return false;
    if(this.#existTask(projectKey, task.getID)) return false;
    this.fetch(projectKey).push(task);
    this.notify(projectKey);
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
    this.notify(projectKey);
    this.storageController.serialize(this.mapTasks);
    return true;
  }
  migrate(projectOldKey, projectNewKey) {
    if(!this.exist(projectOldKey) || this.exist(projectNewKey)) 
      return false;
    this.mapTasks.set(projectNewKey, this.mapTasks.get(projectOldKey));
    this.mapTasks.delete(projectOldKey);
    this.relocateObserver(projectOldKey, projectNewKey);
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
    this.checkTaskExpired(objTask);
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
    this.notify(projectKey);
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
    this.notify(oldProjectKey);
    this.notify(newProjectKey);
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
      this.fetch(projectKey)[idxOldTask].setExpired = TaskController.getExpired(newTask.getDueDate);
      this.fetch(projectKey)[idxOldTask].setPriority = newTask.getPriority;
      this.fetch(projectKey)[idxOldTask].setDone = oldTask.getDone;
      if(newTask.getType === mTask.taskType.note) {
        this.fetch(projectKey)[idxOldTask].setNote = newTask.getNote;
      } else {
        this.fetch(projectKey)[idxOldTask].setCheckList = newTask.getCheckList;
      }
    }
    this.notify(projectKey);
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
  subscribe(projectKey, observer) {
    if(observer && !this.mapObservers.has(projectKey)) {
      this.dataPublisher.subscribe(observer);
      this.mapObservers.set(projectKey, observer);
    }
  }
  unsubscribe(projectKey) {
    if(this.mapObservers.has(projectKey)) {
      this.dataPublisher.unsubscribe(this.mapObservers.get(projectKey));
      this.mapObservers.delete(projectKey);
    }
  }
  notify(projectKey) {
    if(this.mapObservers.has(projectKey)) {
      this.dataPublisher.notify(this.mapObservers.get(projectKey), {
        project: projectKey, 
        complete: this.fetchTotalCompleteTask(projectKey),
        total: this.fetchTotalTask(projectKey)
      });
    }
  }
  relocateObserver(projectOldKey, projectNewKey) {
    if(this.mapObservers.has(projectOldKey)) {
      this.mapObservers.set(projectNewKey, this.mapObservers.get(projectOldKey));
      this.mapObservers.delete(projectOldKey);
    }
  }
  checkExpired(projectKey, id) {
    const task = this.findTask(projectKey, id);
    if(!task) return;
    this.checkTaskExpired(task);
  }
  checkTaskExpired(task) {
    if(!task) return;
    if(!task.getDueDate || task.getDueDate === '' || task.getDueDate === 'No due date') task.setExpired = false;
    task.setExpired = compareAsc(new Date(task.getDueDate + "T00:00:00"), new Date()) < 0;
  }
  static getExpired(dueDate) {
    if(!dueDate || dueDate === '' || dueDate === 'No due date') return false;
    return compareAsc(new Date(dueDate + "T00:00:00"), new Date()) < 0;
  }
  installExpirationTimer(notifier, duration = 1440 * 60 * 1000) {
    if(this.expirationTimer > 0) return;
    this.expirationTimerObserver = notifier;
    this.expirationTimerNotifier.subscribe(notifier);
    // Set interval to verify expired tasks once a day
    this.expirationTimer = setInterval(() => {
      this.mapTasks.forEach((tasks, project) => {
        tasks.forEach(t => {
          const isExpired = t.getExpired;
          this.checkTaskExpired(t);
          if(isExpired !== t.getExpired) {
            this.expirationTimerNotifier.notify(this.expirationTimerObserver, { project: project, task: t });
          }
        });
      });
    }, duration);
  }
  uninstallExpirationTimer() {
    if(this.expirationTimer < 0) return;
    clearInterval(this.expirationTimer);
    this.expirationTimerNotifier.unsubscribe(notifier);
    this.expirationTimerObserver = null;
    this.expirationTimer = -1;
  }
}