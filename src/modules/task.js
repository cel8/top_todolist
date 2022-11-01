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
    this.type = undefined;
    this.title = title;
    this.description = description || '';
    this.dueDate = dueDate || new Date();
    this.priority = taskPriority[priority] ? taskPriority[priority] : taskPriority.normal;
    this.done = false;
  }
  /**
   * @param {any} type
   */
  set setType(type) { this.type = type; }
  get getType() { return this.type; }
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
    this.type = taskType.note;
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
    this.type = taskType.list;
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
  static createTask(type, title, description = '', dueDate = undefined, priority = undefined) {
    let taskClass = TaskNote;
    switch(type) {
      case taskType.list:
        taskClass = TaskCheckList;
        break;
      case taskType.note:
      default:
        taskClass = TaskNote;
        break;
    }
    return new taskClass(title, description, dueDate, priority);
  }
}