import { ProjectController } from 'Controller/project-controller.js';
import { TaskController } from 'Controller/task-controller.js';
import * as domManager from 'Utilities/dom-manager.js';
import * as btnManager from 'Utilities/button.js';
import * as inputManager from 'Utilities/input-manager.js';
import { taskPriority, taskType } from 'Modules/task.js';
import 'Assets/images/svg/close-circle.svg';
import _ from 'lodash';

const overlay = document.querySelector('#overlay');
const main = document.querySelector('main');

export class UiTaskController {
  constructor() {
    this.projectController = ProjectController.getInstance();
    this.taskController = TaskController.getInstance();
  }
  #doManageTaskForm(taskFormArgs) {
    const formMngTask = overlay.querySelector('form');
    const projectTask = taskFormArgs.isEdit ? this.taskController.findTask(taskFormArgs.projectTitle, taskFormArgs.taskTitle)
                                            : null;
    // Toggle visibility
    domManager.toggleDisplayByNode(overlay);
    domManager.toggleDisplayByNode(formMngTask);
    // Remove all form content
    domManager.removeAllChildNodes(formMngTask);
    // Hide form and overlay
    const cbFinalizeForm = () => {
      domManager.toggleDisplayByNode(overlay);
      domManager.toggleDisplayByNode(formMngTask);
    };
    // Add event
    const cbEventAdd = () => {
      // TODO: add task in list
      const task = this.taskController.createTask({
        title: editTextTaskTitle.input.value,
        description: editTextTaskDescr.input.value,
        dueDate: dueDateTask.input.value,
        priority: radioBtnPriority.find(item => item.radio.checked === true).radio.value,
        note: editTextTaskNote.input.value,
        list: []
      });
      const projectTitle = taskFormArgs.projectTitle ? taskFormArgs.projectTitle
                                                     : selectProject.input.value;
      // Add the new task to project 
      if(this.taskController.add(projectTitle, task) && taskFormArgs.projectTitle) {
        this.doAddTaskUI(taskFormArgs.parentContainer, projectTitle, task);
      }
    };
    // Edit event
    const cbEventEdit = () => {
      // TODO: add task in list
      const task = this.taskController.createTask({
        title: editTextTaskTitle.input.value,
        description: editTextTaskDescr.input.value,
        dueDate: dueDateTask.input.value,
        priority: radioBtnPriority.find(item => item.radio.checked === true).radio.value,
        note: editTextTaskNote.input.value,
        list: []
      });
      if(taskFormArgs.projectTitle !== selectProject.input.value) { 
        // Relocate task
        if(this.taskController.relocate(taskFormArgs.projectTitle, 
                                        selectProject.input.value, 
                                        taskFormArgs.taskTitle, 
                                        task)) {
          /* Update data */
          taskFormArgs.projectTitle = selectProject.input.value;
          taskFormArgs.taskTitle = editTextTaskTitle.input.value;
          taskFormArgs.priorityLevel = task.getPriority;
          // Remove div from content
          taskFormArgs.divTask.remove();
        }
      } else { 
        // Edit task
        if(this.taskController.edit(taskFormArgs.projectTitle, taskFormArgs.taskTitle, task)) {
          /* Update data */
          taskFormArgs.divTask.querySelector('.task-title').textContent = task.getTitle;
          taskFormArgs.divTask.querySelector('.task-duedate').textContent = task.getDueDate;
          taskFormArgs.divTask.classList.toggle(task.getPriority);
          // Remove previous priority level
          taskFormArgs.divTask.classList.toggle(taskFormArgs.priorityLevel);
          // Update data arguments
          taskFormArgs.taskTitle = editTextTaskTitle.input.value;
          taskFormArgs.priorityLevel = task.getPriority;
        }
      }
    };
    // Cancel event
    const cbEventCancel = cbFinalizeForm;
    // Submit event
    // TODO: need to implement form validation
    const cbEventSubmit = (e) => {
      e.preventDefault();
      taskFormArgs.isEdit ? cbEventEdit() : cbEventAdd();
      cbFinalizeForm();
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
      if(('' !== editTextTaskNote.input.value) ||
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
      editTextTaskNote.input.value = '';
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
        domManager.addNodeChild(divOptional, editTextTaskNote.input);
      }
    };
    // Project selection
    const option = {
      selected: null,
      values: []
    };
    option.values = (!taskFormArgs.projectTitle || taskFormArgs.isEdit) ? this.projectController.fetchTitles() 
                                                                        : [ taskFormArgs.projectTitle ];
    option.selected = taskFormArgs.isEdit ? taskFormArgs.projectTitle : null;
    // Create input
    const pTaskTitle        = domManager.createNodeContent('p', 'Add a new task', 'add-new-task-title');
    const selectProject     = inputManager.createSelect('selectPrjID', option.values, option.selected);
    const btnClose          = inputManager.createImageButton('btnCancel', 'close-circle.svg', 'task-button', cbEventCancel);
    const divInput          = domManager.createNode('div', 'task-form-container');
    const editTextTaskTitle = inputManager.createEditText('taskTitle', 'Task Title');
    const editTextTaskDescr = inputManager.createEditText('taskDescription', 'Task Description', null, false);
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
    const editTextTaskNote  = inputManager.createEditText('taskNote', 'Task notes', null, false);
    const checkListTasks    = [];
    const btnCancel         = inputManager.createTextButton('btnCancel', 'Cancel', 'task-button', cbEventCancel);
    const btnSubmit         = inputManager.createTextButton('btnSubmit', 'Submit', 'task-button', cbEventSubmit, formMngTask);
    // Set value when editing
    if(taskFormArgs.isEdit) {
      editTextTaskTitle.input.value = projectTask.getTitle;
      editTextTaskDescr.input.value = projectTask.getDescription;
      dueDateTask.input.value = projectTask.getDueDate;
      radioBtnPriority.forEach(item => item.radio.checked = (item.radio.value === projectTask.getPriority));
      // Update optional data
      if(projectTask.getType === taskType.note) {
        editTextTaskNote.input.value = projectTask.getNote;
      } else {
        // TODO: manage list
      }
    }
    /* Add input child */
    domManager.addNodeChild(formMngTask, pTaskTitle);
    domManager.addNodeChild(formMngTask, selectProject.input);
    domManager.addNodeChild(formMngTask, btnClose.input);
    domManager.addNodeChild(divInput, editTextTaskTitle.input);
    domManager.addNodeChild(divInput, editTextTaskDescr.input);
    domManager.addNodeChild(divInput, dueDateTask.label);
    domManager.addNodeChild(divInput, dueDateTask.input);
    domManager.addNodeChild(divInput, divPriority);
    domManager.addNodeChild(divPriority, pTaskPriority);
    radioBtnPriority.forEach(item => domManager.addNodeChild(divPriority, item.input));
    domManager.addNodeChild(divInput, switchTaskType.label);
    domManager.addNodeChild(divInput, switchTaskType.input);
    domManager.addNodeChild(divInput, divOptional);
    domManager.addNodeChild(formMngTask, divInput);
    domManager.addNodeChild(divOptional, editTextTaskNote.input);
    domManager.addNodeChild(formMngTask, btnCancel.input);
    domManager.addNodeChild(formMngTask, btnSubmit.input);
  }
  doCreateTaskDetails() {
    const divMngTaskDetails = overlay.querySelector('.manage-details-task');
    // Create container content
    const pDetailsHdr      = domManager.createNodeContent('p', 'Task information');
    const btnClose         = inputManager.createImageButton('btnCancel', 'close-circle.svg', 'task-button');
    const divTaskDetails   = domManager.createNode('div', 'task-details-container');
    const pTaskTitle       = { label: domManager.createNodeContent('p', 'Title:'), data: domManager.createNode('p', 'task-details-title') };
    const pTaskDescription = { label: domManager.createNodeContent('p', 'Description:'), data: domManager.createNode('p', 'task-details-description') };
    const pTaskDueDate     = { label: domManager.createNodeContent('p', 'Due date:'), data: domManager.createNode('p', 'task-details-duedate') };
    const pTaskPriority    = { label: domManager.createNodeContent('p', 'Priority:'), data: domManager.createNode('p', 'task-details-priority') };
    const pTaskProject     = { label: domManager.createNodeContent('p', 'Project:'), data: domManager.createNode('p', 'task-details-project') };
    const divTaskOptional  = domManager.createNode('div', 'task-details-opt');
    domManager.addNodeChild(divMngTaskDetails, pDetailsHdr);
    domManager.addNodeChild(divMngTaskDetails, btnClose.input);
    domManager.addNodeChild(divMngTaskDetails, divTaskDetails);
    domManager.addNodeChild(divTaskDetails, pTaskTitle.label);
    domManager.addNodeChild(divTaskDetails, pTaskTitle.data);
    domManager.addNodeChild(divTaskDetails, pTaskDescription.label);
    domManager.addNodeChild(divTaskDetails, pTaskDescription.data);
    domManager.addNodeChild(divTaskDetails, pTaskDueDate.label);
    domManager.addNodeChild(divTaskDetails, pTaskDueDate.data);
    domManager.addNodeChild(divTaskDetails, pTaskPriority.label);
    domManager.addNodeChild(divTaskDetails, pTaskPriority.data);
    domManager.addNodeChild(divTaskDetails, pTaskProject.label);
    domManager.addNodeChild(divTaskDetails, pTaskProject.data);
    domManager.addNodeChild(divTaskDetails, divTaskOptional);
    domManager.toggleDisplayByNode(divTaskOptional);
  }
  #doOpenTaskDetails(projectTitle, taskTitle) {
    const divMngTaskDetails = overlay.querySelector('.manage-details-task');
    const divTaskOptional   = divMngTaskDetails.querySelector('.task-details-opt');
    const task              = this.taskController.findTask(projectTitle, taskTitle);
    let hide                = false;
    // Toggle visibility
    domManager.toggleDisplayByNode(overlay);
    domManager.toggleDisplayByNode(divMngTaskDetails);
    // Remove all optional content
    domManager.removeAllChildNodes(divTaskOptional);
    // Update details
    divMngTaskDetails.querySelector('.task-details-title').textContent       = task.getTitle;
    divMngTaskDetails.querySelector('.task-details-description').textContent = task.getDescription;
    divMngTaskDetails.querySelector('.task-details-duedate').textContent     = task.getDueDate;
    divMngTaskDetails.querySelector('.task-details-priority').textContent    = task.getPriority;
    divMngTaskDetails.querySelector('.task-details-project').textContent     = projectTitle;
    if(task.getType === taskType.note) {
      const note = task.getNote;
      if(note) {
        const pTaskNote = { label: domManager.createNodeContent('p', 'Extra notes:'), data: domManager.createNodeContent('p', task.getNote, 'task-details-note') };
        domManager.addNodeChild(divTaskOptional, pTaskNote.label);
        domManager.addNodeChild(divTaskOptional, pTaskNote.data);
        domManager.toggleDisplayByNode(divTaskOptional);
        hide = true;
      }
    } else {
      // TODO: manage optional
    }
    // Hide form and overlay
    divMngTaskDetails.querySelector('.task-button').onclick = () => {
      domManager.toggleDisplayByNode(overlay);
      domManager.toggleDisplayByNode(divMngTaskDetails);
      if(hide) {
        domManager.toggleDisplayByNode(divTaskOptional);
      }
    };
  }
  doAddTaskUI(parentContainer, projectTitle, task) {
    const divTask = domManager.createNode('div', 'task-item');
    const taskFormArgs = {
      isEdit: true,
      projectTitle: projectTitle,
      taskTitle: task.getTitle,
      priorityLevel: task.getPriority,
      divTask: divTask
    };
    const checkBoxDone = inputManager.createCheckBox('checkBoxDone', null, () => {
      this.taskController.changeTaskState(taskFormArgs.projectTitle, taskFormArgs.taskTitle, checkBoxDone.input.checked);
    }, task.getDone);
    const pTaskTitle   = domManager.createNodeContent('p', task.getTitle, 'task-title');
    const pTaskDueDate = domManager.createNodeContent('p', task.dueDate, 'task-duedate');
    taskFormArgs.divTask.classList.toggle(taskFormArgs.priorityLevel);
    // Add node to container
    domManager.addNodeChild(parentContainer, divTask);
    domManager.addNodeChild(divTask, checkBoxDone.input);
    domManager.addNodeChild(divTask, pTaskTitle);
    domManager.addNodeChild(divTask, pTaskDueDate);
    domManager.addNodeChild(divTask, btnManager.createTextButton('details', 'task-button details', () => {
      this.#doOpenTaskDetails(taskFormArgs.projectTitle, taskFormArgs.taskTitle);
    }));
    domManager.addNodeChild(divTask, btnManager.createImageButton('pencil-circle.svg', 'task-button', () => {
      this.#doManageTaskForm(taskFormArgs);
    }));
    domManager.addNodeChild(divTask, btnManager.createImageButton('delete-circle.svg', 'task-button', () => {
      if(this.taskController.remove(taskFormArgs.projectTitle, taskFormArgs.taskTitle)) {
        divTask.remove();
      }
    }));
  }
  doCreateTask() {
    this.#doManageTaskForm({isEdit: false});
  }
  doLoadProjectTask(projectTitle) {
    // Remove main content
    domManager.removeAllChildNodes(main);
    // Find project
    const project = this.projectController.find(projectTitle);
    // Load project title and description
    const divProject = domManager.createAddNode('div', main, 'task-project');
    const divTaskContainer = domManager.createNode('div', 'task-container');
    const tasks = this.taskController.fetch(projectTitle);
    tasks.forEach(t => this.doAddTaskUI(divTaskContainer, projectTitle, t))
    domManager.addNodeChild(divProject, domManager.createNodeContent('p', projectTitle));
    domManager.addNodeChild(divProject, domManager.createNodeContent('p', project.getDescription));
    /* Add project button */
    const btnAddTask = btnManager.createButton('Add task', 'plus-circle-outline.svg', 'task-button', () => {
      this.#doManageTaskForm({
        isEdit: false,
        parentContainer: divTaskContainer,
        projectTitle: projectTitle
      });
    });
    btnAddTask.classList.add('add-task-btn');
    domManager.addNodeChild(main, btnAddTask);
    domManager.addNodeChild(main, divTaskContainer);
  }
}