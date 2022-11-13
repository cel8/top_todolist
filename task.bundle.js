/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./src/modules/task.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TaskCheckList": () => (/* binding */ TaskCheckList),
/* harmony export */   "TaskFactory": () => (/* binding */ TaskFactory),
/* harmony export */   "TaskNote": () => (/* binding */ TaskNote),
/* harmony export */   "taskPriority": () => (/* binding */ taskPriority),
/* harmony export */   "taskType": () => (/* binding */ taskType)
/* harmony export */ });
const taskType = {
  note: 'note',
  list: 'checklist'
};

const taskPriority = {
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
    this.expired = false;
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
  /**
   * @param {boolean} expired
   */
  set setExpired(expired) { this.expired = expired ? true : false; }
  get getExpired() { return this.expired; }
}

class TaskNote extends Task {
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

class TaskCheckList extends Task {
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

class TaskFactory {
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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7O0FDTk87QUFDUDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQjtBQUNBLGtCQUFrQjtBQUNsQixnQkFBZ0I7QUFDaEI7QUFDQSxhQUFhLEtBQUs7QUFDbEI7QUFDQSxzQkFBc0I7QUFDdEIsa0JBQWtCO0FBQ2xCO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCO0FBQ0Esd0JBQXdCO0FBQ3hCLG1CQUFtQjtBQUNuQjtBQUNBLGFBQWEsS0FBSztBQUNsQjtBQUNBLG9DQUFvQztBQUNwQyx5QkFBeUI7QUFDekI7QUFDQSxhQUFhLEtBQUs7QUFDbEI7QUFDQSw4QkFBOEI7QUFDOUIsc0JBQXNCO0FBQ3RCO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCO0FBQ0EsNEJBQTRCO0FBQzVCLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBLHVCQUF1QjtBQUN2QixrQkFBa0I7QUFDbEI7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQSw0QkFBNEI7QUFDNUIscUJBQXFCO0FBQ3JCOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0Esc0JBQXNCO0FBQ3RCLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQjtBQUNBLGtCQUFrQjtBQUNsQixnQkFBZ0I7QUFDaEI7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQSwwQkFBMEI7QUFDMUIsb0JBQW9CO0FBQ3BCO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0EsdUJBQXVCO0FBQ3ZCLGtCQUFrQjtBQUNsQjs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQjtBQUNBLGdDQUFnQztBQUNoQyx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9wX3RvZG9saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcF90b2RvbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9wX3RvZG9saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9wX3RvZG9saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wX3RvZG9saXN0Ly4vc3JjL21vZHVsZXMvdGFzay5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImV4cG9ydCBjb25zdCB0YXNrVHlwZSA9IHtcbiAgbm90ZTogJ25vdGUnLFxuICBsaXN0OiAnY2hlY2tsaXN0J1xufTtcblxuZXhwb3J0IGNvbnN0IHRhc2tQcmlvcml0eSA9IHtcbiAgY3JpdGljYWw6ICdjcml0aWNhbCcsXG4gIGhpZ2g6ICdoaWdoJyxcbiAgbm9ybWFsOiAnbm9ybWFsJyxcbiAgbG93OiAnbG93J1xufVxuXG5jbGFzcyBUYXNrIHtcbiAgY29uc3RydWN0b3IoaWQsIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpIHtcbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gfHwgJyc7XG4gICAgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZSB8fCAnJztcbiAgICB0aGlzLmV4cGlyZWQgPSBmYWxzZTtcbiAgICB0aGlzLnByaW9yaXR5ID0gdGFza1ByaW9yaXR5W3ByaW9yaXR5XSA/IHRhc2tQcmlvcml0eVtwcmlvcml0eV0gOiB0YXNrUHJpb3JpdHkubm9ybWFsO1xuICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge2FueX0gaWRcbiAgICovXG4gIHNldCBzZXRJRChpZCkgeyB0aGlzLmlkID0gaWQ7IH1cbiAgZ2V0IGdldElEKCkgeyByZXR1cm4gdGhpcy5pZDsgfVxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IHR5cGVcbiAgICovXG4gIHNldCBzZXRUeXBlKHR5cGUpIHsgdGhpcy50eXBlID0gdHlwZTsgfVxuICBnZXQgZ2V0VHlwZSgpIHsgcmV0dXJuIHRoaXMudHlwZTsgfVxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IHRpdGxlXG4gICAqL1xuICBzZXQgc2V0VGl0bGUodGl0bGUpIHsgdGhpcy50aXRsZSA9IHRpdGxlOyB9XG4gIGdldCBnZXRUaXRsZSgpIHsgcmV0dXJuIHRoaXMudGl0bGU7IH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7YW55fSBkZXNjcmlwdGlvblxuICAgKi9cbiAgc2V0IHNldERlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7IHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjsgfVxuICBnZXQgZ2V0RGVzY3JpcHRpb24oKSB7IHJldHVybiB0aGlzLmRlc2NyaXB0aW9uOyB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge2FueX0gcHJpb3JpdHlcbiAgICovXG4gIHNldCBzZXRQcmlvcml0eShwcmlvcml0eSkgeyB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHkgPyBwcmlvcml0eSA6IHRhc2tQcmlvcml0eS5ub3JtYWw7IH1cbiAgZ2V0IGdldFByaW9yaXR5KCkgeyByZXR1cm4gdGhpcy5wcmlvcml0eTsgfVxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IGR1ZURhdGVcbiAgICovXG4gIHNldCBzZXREdWVEYXRlKGR1ZURhdGUpIHsgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZTsgfVxuICBnZXQgZ2V0RHVlRGF0ZSgpIHsgcmV0dXJuIHRoaXMuZHVlRGF0ZTsgfVxuICAvKipcbiAgICogQHBhcmFtIHtib29sZWFufSBzdGF0ZVxuICAgKi9cbiAgc2V0IHNldERvbmUoc3RhdGUpIHsgdGhpcy5kb25lID0gc3RhdGUgPyB0cnVlIDogZmFsc2U7IH1cbiAgZ2V0IGdldERvbmUoKSB7IHJldHVybiB0aGlzLmRvbmU7IH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZXhwaXJlZFxuICAgKi9cbiAgc2V0IHNldEV4cGlyZWQoZXhwaXJlZCkgeyB0aGlzLmV4cGlyZWQgPSBleHBpcmVkID8gdHJ1ZSA6IGZhbHNlOyB9XG4gIGdldCBnZXRFeHBpcmVkKCkgeyByZXR1cm4gdGhpcy5leHBpcmVkOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBUYXNrTm90ZSBleHRlbmRzIFRhc2sge1xuICBjb25zdHJ1Y3RvcihpZCwgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSkge1xuICAgIHN1cGVyKGlkLCB0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KTtcbiAgICB0aGlzLm5vdGUgPSAnJztcbiAgICB0aGlzLnR5cGUgPSB0YXNrVHlwZS5ub3RlO1xuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbm90ZVxuICAgKi9cbiAgc2V0IHNldE5vdGUobm90ZSkgeyB0aGlzLm5vdGUgPSBub3RlOyB9XG4gIGdldCBnZXROb3RlKCkgeyByZXR1cm4gdGhpcy5ub3RlOyB9XG59XG5cbmNsYXNzIEFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoaWQsIGFjdGlvbiwgc3RhdGUpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5hY3Rpb24gPSBhY3Rpb247XG4gICAgdGhpcy5kb25lID0gc3RhdGUgPyB0cnVlIDogZmFsc2U7XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7YW55fSBpZFxuICAgKi9cbiAgc2V0IHNldElEKGlkKSB7IHRoaXMuaWQgPSBpZDsgfVxuICBnZXQgZ2V0SUQoKSB7IHJldHVybiB0aGlzLmlkOyB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uXG4gICAqL1xuICBzZXQgc2V0QWN0aW9uKGFjdGlvbikgeyB0aGlzLmFjdGlvbiA9IGFjdGlvbjsgfVxuICBnZXQgZ2V0QWN0aW9uKCkgeyByZXR1cm4gdGhpcy5hY3Rpb247IH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhdGVcbiAgICovXG4gIHNldCBzZXREb25lKHN0YXRlKSB7IHRoaXMuZG9uZSA9IHN0YXRlID8gdHJ1ZSA6IGZhbHNlOyB9XG4gIGdldCBnZXREb25lKCkgeyByZXR1cm4gdGhpcy5kb25lOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBUYXNrQ2hlY2tMaXN0IGV4dGVuZHMgVGFzayB7XG4gIGNvbnN0cnVjdG9yKGlkLCB0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KSB7XG4gICAgc3VwZXIoaWQsIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpO1xuICAgIHRoaXMuY2hlY2tMaXN0ID0gW107XG4gICAgdGhpcy50eXBlID0gdGFza1R5cGUubGlzdDtcbiAgfVxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IGNoZWNrTGlzdFxuICAgKi9cbiAgc2V0IHNldENoZWNrTGlzdChjaGVja0xpc3QpIHsgdGhpcy5jaGVja0xpc3QgPSBjaGVja0xpc3Q7IH1cbiAgZ2V0IGdldENoZWNrTGlzdCgpIHsgcmV0dXJuIHRoaXMuY2hlY2tMaXN0OyB9XG4gIGFkZChpZCwgYWN0aW9uLCBzdGF0ZSA9IGZhbHNlKSB7XG4gICAgaWYoIXRoaXMuZXhpc3QoaWQpKSB7XG4gICAgICB0aGlzLmNoZWNrTGlzdC5wdXNoKG5ldyBBY3Rpdml0eShpZCwgYWN0aW9uLCBzdGF0ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVkaXQoaWQsIGFjdGlvbiwgc3RhdGUpO1xuICAgIH1cbiAgfVxuICByZW1vdmUoaWQpIHtcbiAgICB0aGlzLmNoZWNrTGlzdCA9IF8uZmlsdGVyKHRoaXMuY2hlY2tMaXN0LCBhID0+IGEuZ2V0SUQgIT09IGlkKTtcbiAgfVxuICBlZGl0KGlkLCBhY3Rpb24sIHN0YXRlKSB7XG4gICAgY29uc3QgaWR4ID0gXy5maW5kSW5kZXgodGhpcy5jaGVja0xpc3QsIGEgPT4gaWQgPT09IGEuZ2V0SUQpO1xuICAgIGlmKC0xID09PSBpZHgpIHJldHVybjtcbiAgICB0aGlzLmNoZWNrTGlzdFtpZHhdLnNldEFjdGlvbiA9IGFjdGlvbjtcbiAgICB0aGlzLmNoZWNrTGlzdFtpZHhdLnNldERvbmUgPSBzdGF0ZTtcbiAgfVxuICBjaGFuZ2VTdGF0ZShpZCwgc3RhdGUpIHtcbiAgICBjb25zdCBpZHggPSBfLmZpbmRJbmRleCh0aGlzLmNoZWNrTGlzdCwgYSA9PiBpZCA9PT0gYS5nZXRJRCk7XG4gICAgaWYoLTEgPT09IGlkeCkgcmV0dXJuO1xuICAgIHRoaXMuY2hlY2tMaXN0W2lkeF0uc2V0RG9uZSA9IHN0YXRlO1xuICB9XG4gIGNsZWFyKCkge1xuICAgIHRoaXMuY2hlY2tMaXN0LnNwbGljZSgwLCB0aGlzLmNoZWNrTGlzdC5sZW5ndGgpO1xuICB9XG4gIGV4aXN0KGlkKSB7XG4gICAgaWYoMCA9PSB0aGlzLmNoZWNrTGlzdC5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBlbHNlIHJldHVybiBfLnNvbWUodGhpcy5jaGVja0xpc3QsIGEgPT4gaWQgPT09IGEuZ2V0SUQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUYXNrRmFjdG9yeSB7XG4gIHN0YXRpYyBjcmVhdGVUYXNrKHR5cGUsIGlkLCB0aXRsZSwgZGVzY3JpcHRpb24gPSAnJywgZHVlRGF0ZSA9IHVuZGVmaW5lZCwgcHJpb3JpdHkgPSB1bmRlZmluZWQpIHtcbiAgICBsZXQgdGFza0NsYXNzID0gVGFza05vdGU7XG4gICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgIGNhc2UgdGFza1R5cGUubGlzdDpcbiAgICAgICAgdGFza0NsYXNzID0gVGFza0NoZWNrTGlzdDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRhc2tUeXBlLm5vdGU6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0YXNrQ2xhc3MgPSBUYXNrTm90ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBuZXcgdGFza0NsYXNzKGlkLCB0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KTtcbiAgfVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==