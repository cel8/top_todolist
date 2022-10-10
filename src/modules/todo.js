export const todoType = {
  note: 'note',
  list: 'list'
};

export const todoPriority = {
  critical: 'critical',
  high: 'high',
  normal: 'normal',
  low: 'low'
}

class Todo {
  constructor(title, description) {
    this.title = title;
    this.description = description || '';
    this.dueDate = null;
    this.priority = todoPriority.normal;
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
  set setPriority(priority) { this.priority = priority ? priority : todoPriority.normal; }
  get getPriority() { return this.priority; }
  /**
   * @param {any} dueDate
   */
  set setDueDate(dueDate) { this.dueDate = dueDate; }
  get getDueDate() { return this.dueDate; }
}

export class TodoNote extends Todo {
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

export class TodoCheckList extends Todo {
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

export class TodoFactory {
  constructor() {
    this.todoClass = TodoNote;
  }
  createTodo(type, title, description = '') {
    switch(type) {
      case todoType.list:
        this.todoClass = TodoCheckList;
        break;
      case todoType.note:
      default:
        this.todoClass = TodoNote;
        break;
    }
    return new this.todoClass(title, description);
  }
}