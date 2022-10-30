import { ProjectController } from 'Controller/project-controller.js';
import * as domManager from 'Utilities/dom-manager.js';
import * as btnManager from 'Utilities/button.js';
import * as inputManager from 'Utilities/input-manager.js';
import { taskPriority } from 'Modules/task';
import 'Assets/images/svg/close-circle.svg';
import _ from 'lodash';

const overlay = document.querySelector('#overlay');
const main = document.querySelector('main');

export class UiTaskController {
  constructor() {
    this.projectController = ProjectController.getInstance();
  }
  doLoadProjectTask(projectTitle) {
    // Remove main content
    domManager.removeAllChildNodes(main);
    // Find project
    const project = this.projectController.find(projectTitle);
    // Load project title and description
    const divProject = domManager.createAddNode('div', main, 'task-project');
    domManager.addNodeChild(divProject, domManager.createNodeContent('p', projectTitle));
    domManager.addNodeChild(divProject, domManager.createNodeContent('p', project.getDescription));
    /* Add project button */
    const btnAddTask = btnManager.createButton('Add task', 'plus-circle-outline.svg', 'task-button', () => {
      const formMngTask = overlay.querySelector('form');
      // Remove all form content
      domManager.removeAllChildNodes(formMngTask);
      // Cancel event
      const cbEventCancel = () => {
        domManager.toggleDisplayByNode(overlay);
      };
      // Submit event
      const cbEventSubmit = (e) => {
        e.preventDefault();
        // TODO: add task in list
        domManager.toggleDisplayByNode(overlay);
      };
      // Edit priority event
      const cbEventEditPriority = (e) => {
        radioBtnPriority.forEach(item => {
          if(e.target !== item.radio) {
            item.radio.checked = false;
          }
        });
      }
      // Checklist event
      const cbEventChangeTaskType = () => {
        // Detects for content
        if(('' !== editTextTaskDescr.input.value) ||
           (0 !== checkListTasks.length &&
            _.some(checkListTasks, item => '' !== item.querySelector('input').value))) {
          // Notify to user that everything will be discarded
          if(!window.confirm("Warning: do you want to discard everything?")) {
            return false;
          }
        }
        // Remove main content
        domManager.removeAllChildNodes(divOptional);
        // Restore content
        checkListTasks.splice(0, checkListTasks.length);
        editTextTaskDescr.input.value = '';
        if(switchTaskType.checkbox.checked) {
          // Insert add new item in checklist
          domManager.addNodeChild(divOptional, inputManager.createButton('addTaskItem', 'Add item in checklist', 'plus-circle-outline.svg', 'task-button', () => {
            // Fill last item first
            if(0 !== checkListTasks.length &&
              '' === checkListTasks.at(-1).querySelector('input').value) return;
            // Create a new item
            const editTextItem = inputManager.createEditText('taskItemCheckList', 'Item in task checklist', null, false);
            const divChecklistItem = domManager.createNode('div')
            domManager.addNodeChild(divChecklistItem, editTextItem.input);
            domManager.addNodeChild(divChecklistItem, inputManager.createImageButton('removeTaskItem', 'delete-circle.svg', 'task-button', () => {
              const index = _.indexOf(checkListTasks, divChecklistItem);
              if(index !== -1) {
                checkListTasks.splice(index, 1);
                divChecklistItem.remove();
              }
            }).input);
            checkListTasks.push(divChecklistItem);
            domManager.addNodeChild(divOptional, checkListTasks.at(-1));
          }).input);
        } else {
          // Add edit box
          domManager.addNodeChild(divOptional, editTextTaskDescr.input);
        }
      };
      // Create input
      const pTaskTitle        = domManager.createNodeContent('p', 'Add a new task', 'add-new-task-title');
      const btnClose          = inputManager.createImageButton('btnCancel', 'close-circle.svg', 'task-button', cbEventCancel);
      const divInput          = domManager.createNode('div', 'task-form-container');
      const editTextTaskTitle = inputManager.createEditText('taskTitle', 'Task Title');
      const dueDateTask       = inputManager.createDate('taskDueDate', 'Due Date');
      const divPriority       = domManager.createNode('div', 'task-priority');
      const pTaskPriority     = domManager.createNodeContent('p', 'Task Priority');
      const radioBtnPriority  = [];
      for (const property in taskPriority) {
        radioBtnPriority.push(
          inputManager.createRadioButton(`priority-${taskPriority[property]}`, property, null, cbEventEditPriority, (property === taskPriority.low))
        );
      }
      const switchTaskType    = inputManager.createSwitchButton('switchTaskType', true, 'Change task type', cbEventChangeTaskType);
      const divOptional       = domManager.createNode('div', 'optional-content');
      const editTextTaskDescr = inputManager.createEditText('taskDescription', 'Task Description', null, false);
      const checkListTasks    = [];
      const btnCancel         = inputManager.createTextButton('btnCancel', 'Cancel', 'task-button', cbEventCancel);
      const btnSubmit         = inputManager.createTextButton('btnSubmit', 'Submit', 'task-button', cbEventSubmit, formMngTask);
      /* Add input child */
      domManager.addNodeChild(formMngTask, pTaskTitle);
      domManager.addNodeChild(formMngTask, btnClose.input);
      domManager.addNodeChild(divInput, editTextTaskTitle.input);
      domManager.addNodeChild(divInput, dueDateTask.label);
      domManager.addNodeChild(divInput, dueDateTask.input);
      domManager.addNodeChild(divInput, divPriority);
      domManager.addNodeChild(divPriority, pTaskPriority);
      radioBtnPriority.forEach(item => domManager.addNodeChild(divPriority, item.input));
      domManager.addNodeChild(divInput, switchTaskType.label);
      domManager.addNodeChild(divInput, switchTaskType.input);
      domManager.addNodeChild(divInput, divOptional);
      domManager.addNodeChild(formMngTask, divInput);
      domManager.addNodeChild(divOptional, editTextTaskDescr.input);
      domManager.addNodeChild(formMngTask, btnCancel.input);
      domManager.addNodeChild(formMngTask, btnSubmit.input);
      // Toggle overlay
      domManager.toggleDisplayByNode(overlay);
    });
    btnAddTask.classList.add('add-task-btn');
    domManager.addNodeChild(divProject, btnAddTask);
  }
}