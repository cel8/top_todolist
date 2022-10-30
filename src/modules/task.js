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
  constructor(title, description) {
    this.title = title;
    this.description = description || '';
    this.dueDate = null;
    this.priority = taskPriority.normal;
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
}

export class TaskNote extends Task {
  constructor(title, description) {
    super(title, description);
    this.note = '';
  }
  /**
   * @param {string} note
   */
  set setNote(note) { this.note = note; }
  get getNote() { return this.note; }
}

export class TaskCheckList extends Task {
  constructor(title, description) {
    super(title, description);
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
  createTask(type, title, description = '') {
    switch(type) {
      case taskType.list:
        this.taskClass = TaskCheckList;
        break;
      case taskType.note:
      default:
        this.taskClass = TaskNote;
        break;
    }
    return new this.taskClass(title, description);
  }
}