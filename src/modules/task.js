export const taskType = {
  note: 'note',
  list: 'checklist'
};

export const taskPriority = {
  critical: 'critical',
  high: 'high',
  normal: 'normal',
  low: 'low'
}

class Task {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description || '';
    this.dueDate = dueDate || new Date();
    this.priority = taskPriority[priority] ? taskPriority[priority] : taskPriority.normal;
    this.done = false;
  }
  /**
   * @param {any} title
   */
  set setTitle(title) { this.title = title; }
  get getTitle() { return this.title; }
  /**
   * @param {any} description
   */
  set setDescription(description) { this.description = description; }
  get getDescription() { return this.description; }
  /**
   * @param {any} priority
   */
  set setPriority(priority) { this.priority = priority ? priority : taskPriority.normal; }
  get getPriority() { return this.priority; }
  /**
   * @param {any} dueDate
   */
  set setDueDate(dueDate) { this.dueDate = dueDate; }
  get getDueDate() { return this.dueDate; }
  /**
   * @param {boolean} state
   */
  set setDone(state) { this.done = state ? true : false; }
  get getDone() { return this.done; }
}

export class TaskNote extends Task {
  constructor(title, description, dueDate, priority) {
    super(title, description, dueDate, priority);
    this.note = '';
  }
  /**
   * @param {string} note
   */
  set setNote(note) { this.note = note; }
  get getNote() { return this.note; }
}

export class TaskCheckList extends Task {
  constructor(title, description, dueDate, priority) {
    super(title, description, dueDate, priority);
    this.setCheckList = new Set();
  }
  get getCheckList() { return this.setCheckList; }
  addActivity(activity) {
    this.setCheckList.add(activity);
  }
  deleteActivity(activity) {
    this.setCheckList.delete(activity);
  }
}

export class TaskFactory {
  constructor() {
    this.taskClass = TaskNote;
  }
  createTask(type, title, description = '', dueDate = undefined, priority = undefined) {
    switch(type) {
      case taskType.list:
        this.taskClass = TaskCheckList;
        break;
      case taskType.note:
      default:
        this.taskClass = TaskNote;
        break;
    }
    return new this.taskClass(title, description, dueDate, priority);
  }
}