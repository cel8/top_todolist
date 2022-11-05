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
  constructor(id, title, description, dueDate, priority) {
    this.type = undefined;
    this.id = id;
    this.title = title;
    this.description = description || '';
    this.dueDate = dueDate || '';
    this.priority = taskPriority[priority] ? taskPriority[priority] : taskPriority.normal;
    this.done = false;
  }
  /**
   * @param {any} id
   */
  set setID(id) { this.id = id; }
  get getID() { return this.id; }
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
  constructor(id, title, description, dueDate, priority) {
    super(id, title, description, dueDate, priority);
    this.note = '';
    this.type = taskType.note;
  }
  /**
   * @param {string} note
   */
  set setNote(note) { this.note = note; }
  get getNote() { return this.note; }
}

class Activity {
  constructor(id, action, state) {
    this.id = id;
    this.action = action;
    this.done = state ? true : false;
  }
  /**
   * @param {any} id
   */
  set setID(id) { this.id = id; }
  get getID() { return this.id; }
  /**
   * @param {string} action
   */
  set setAction(action) { this.action = action; }
  get getAction() { return this.action; }
  /**
   * @param {boolean} state
   */
  set setDone(state) { this.done = state ? true : false; }
  get getDone() { return this.done; }
}

export class TaskCheckList extends Task {
  constructor(id, title, description, dueDate, priority) {
    super(id, title, description, dueDate, priority);
    this.checkList = [];
    this.type = taskType.list;
  }
  /**
   * @param {any} checkList
   */
  set setCheckList(checkList) { this.checkList = checkList; }
  get getCheckList() { return this.checkList; }
  add(id, action, state = false) {
    if(!this.exist(id)) {
      this.checkList.push(new Activity(id, action, state));
    } else {
      this.edit(id, action, state);
    }
  }
  remove(id) {
    this.checkList = _.filter(this.checkList, a => a.getID !== id);
  }
  edit(id, action, state) {
    const idx = _.findIndex(this.checkList, a => id === a.getID);
    if(-1 === idx) return;
    this.checkList[idx].setAction = action;
    this.checkList[idx].setDone = state;
  }
  changeState(id, state) {
    const idx = _.findIndex(this.checkList, a => id === a.getID);
    if(-1 === idx) return;
    this.checkList[idx].setDone = state;
  }
  clear() {
    this.checkList.splice(0, this.checkList.length);
  }
  exist(id) {
    if(0 == this.checkList.length) return false;
    else return _.some(this.checkList, a => id === a.getID);
  }
}

export class TaskFactory {
  static createTask(type, id, title, description = '', dueDate = undefined, priority = undefined) {
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
    return new taskClass(id, title, description, dueDate, priority);
  }
}