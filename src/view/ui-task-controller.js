import { ProjectController } from 'Controller/project-controller.js';
import { TaskController, taskSortMode } from 'Controller/task-controller.js';
import * as domManager from 'Utilities/dom-manager.js';
import * as btnManager from 'Utilities/button.js';
import * as inputManager from 'Utilities/input-manager.js';
import { taskPriority, taskType } from 'Modules/task.js';
import 'Assets/images/svg/close-circle.svg';
import 'Assets/images/svg/format-list-checkbox.svg';
import 'Assets/images/svg/note-text-outline.svg';
import _ from 'lodash';
import { DataSubscriber } from 'Controller/data-subscriber';

const overlay = document.querySelector('#overlay');
const main = document.querySelector('main');

export class UiTaskController {
  constructor() {
    this.projectController = ProjectController.getInstance();
    this.taskController = TaskController.getInstance();
    this.taskController.setExpirationTimerCb = this.doUpdateExpirationTasks;
    this.currentSortMode = taskSortMode.addDateAscending;
    this.dueDateView = { active: false, mode: undefined };
  }
  static getInstance() {
    if(!this.instance) {
      this.instance = new UiTaskController();
    }
    return this.instance;
  }
  #doManageTaskForm(taskFormArgs) {
    const formMngTask = overlay.querySelector('form');
    const projectTask = taskFormArgs.isEdit ? this.taskController.findTask(taskFormArgs.projectTitle, taskFormArgs.taskID)
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
    const cbEventAdd = (task) => {
      const projectTitle = taskFormArgs.projectTitle ? taskFormArgs.projectTitle
                                                     : selectProject.input.value;
      // Add the new task to project 
      if(this.taskController.add(projectTitle, task) && ((taskFormArgs.projectTitle) || (this.dueDateView.active))) {
        this.doAddTaskUI(taskFormArgs.parentContainer, projectTitle, task);
      }
    };
    // Edit event
    const cbEventEdit = (task) => {
      if(taskFormArgs.projectTitle !== selectProject.input.value) { 
        // Relocate task
        if(this.taskController.relocate(taskFormArgs.projectTitle, 
                                        selectProject.input.value, 
                                        taskFormArgs.taskID, 
                                        task)) {
          const oldProjectKey = taskFormArgs.projectTitle;
          /* Update data */
          taskFormArgs.projectTitle = selectProject.input.value;
          taskFormArgs.taskTitle = editTextTaskTitle.input.value;
          taskFormArgs.taskID = task.getID;
          taskFormArgs.priorityLevel = task.getPriority;
          // Remove div from content
          taskFormArgs.divTask.remove();
          if(this.dueDateView.active) {
            this.doRemoveDueDateProjectTask(oldProjectKey);
            if(this.taskController.checkDueDateInterval(task, this.dueDateView.mode)) {
              this.doAddTaskUI(this.doAddDueDateProjectTask(selectProject.input.value), taskFormArgs.projectTitle, task);
            }
          }
        }
      } else { 
        // Edit task
        if(this.taskController.edit(taskFormArgs.projectTitle, taskFormArgs.taskID, task)) {
          if(this.dueDateView.active && !this.taskController.checkDueDateInterval(task, this.dueDateView.mode)) {
            taskFormArgs.divTask.remove();
            this.doRemoveDueDateProjectTask(taskFormArgs.projectTitle);
            return;
          }
          /* Update data */
          taskFormArgs.divTask.dataset.id = task.getID;
          taskFormArgs.divTask.querySelector('.task-title').textContent = task.getTitle;
          taskFormArgs.divTask.querySelector('.task-duedate').textContent = task.getDueDate && task.getDueDate !== '' ? task.getDueDate 
                                                                                                                      : 'No due date';
          UiTaskController.#doExpireTask(taskFormArgs.divTask, task.getExpired);
          taskFormArgs.divTask.classList.toggle(task.getPriority);
          // Remove previous priority level
          taskFormArgs.divTask.classList.toggle(taskFormArgs.priorityLevel);
          // Update data arguments
          taskFormArgs.taskTitle = editTextTaskTitle.input.value;
          taskFormArgs.taskID = task.getID;
          taskFormArgs.priorityLevel = task.getPriority;
          taskFormArgs.expired = task.getExpired;
        }
      }
    };
    // Cancel event
    const cbEventCancel = cbFinalizeForm;
    // Submit event
    const cbEventSubmit = (e) => {
      e.preventDefault();
      // Fill parent and project title for each case      
      let parentContainer = taskFormArgs.parentContainer;
      if(!parentContainer) {
        if(this.dueDateView.active) {
          parentContainer = this.doAddDueDateProjectTask(selectProject.input.value);
          taskFormArgs.parentContainer = parentContainer;
        } else {
          parentContainer = document.querySelector('.task-container')
        }
      }
      let projectTitle = taskFormArgs.projectTitle;
      if(!taskFormArgs.projectTitle) {
        const pTitle = document.querySelector('.task-project > p:first-of-type');
        if(pTitle) projectTitle = pTitle.textContent;
      }
      // Create task activity
      const activities = [];
      checkListTasks.forEach((div, idx) => {
        const done = div.querySelector('#taskItemCheckListCbox').checked;
        const action = div.querySelector('#taskItemCheckListEdit').value;
        if(action) {
          activities.push({ id: idx, action: action, done: done });
        }
      });
      // Create a new task
      const task = this.taskController.createTask({
        title: editTextTaskTitle.input.value,
        description: editTextTaskDescr.input.value,
        dueDate: dueDateTask.input.value,
        priority: radioBtnPriority.find(item => item.radio.checked === true).radio.value,
        note: editTextTaskNote.input.value,
        list: activities
      });
      taskFormArgs.isEdit ? cbEventEdit(task) : cbEventAdd(task);
      // Sort in DOM during add or edit (no relocate)
      if((!this.dueDateView.active) &&
         (parentContainer) && 
         (projectTitle === selectProject.input.value)) {
        this.doReloadSorted(projectTitle, parentContainer, this.currentSortMode);
      }
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
    // Create checklist content
    const cbCheckListCreateActivity = (parent, activity = undefined) => {
      // Create a new item
      const checkBoxItem = inputManager.createCheckBox('taskItemCheckListCbox');
      const editTextItem = inputManager.createEditText('taskItemCheckListEdit', 'Item in task checklist', null, false);
      // Edit activity
      if(activity) {
        checkBoxItem.input.checked = activity.getDone;
        editTextItem.input.value = activity.getAction;
      }
      const divChecklistItem = domManager.createNode('div')
      domManager.addNodeChild(divChecklistItem, checkBoxItem.input);
      domManager.addNodeChild(divChecklistItem, editTextItem.input);
      domManager.addNodeChild(divChecklistItem, inputManager.createImageButton('removeTaskItem', 'delete-circle.svg', 'task-button', () => {
        const index = _.indexOf(checkListTasks, divChecklistItem);
        if(index !== -1) {
          checkListTasks.splice(index, 1);
          divChecklistItem.remove();
        }
      }).input);
      checkListTasks.push(divChecklistItem);
      domManager.addNodeChild(parent, checkListTasks.at(-1));
    } 
    // Change task type event
    const cbEventChangeTaskType = () => {
      // Detects for content
      if(('' !== editTextTaskNote.input.value) ||
         (0 !== checkListTasks.length &&
          _.some(checkListTasks, item => '' !== item.querySelector('#taskItemCheckListEdit').value))) {
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
        btnTaskNote.input.disabled  = true;
        btnTaskCheckList.input.disabled  = false;
        // Insert add new item in checklist
        domManager.addNodeChild(divOptional, inputManager.createButton('addTaskItem', 'Add item in checklist', 'plus-circle-outline.svg', 'task-button', () => {
          // Fill last item first
          if(0 !== checkListTasks.length &&
            '' === checkListTasks.at(-1).querySelector('#taskItemCheckListEdit').value) return;
          // Create a new item
          cbCheckListCreateActivity(divOptional);
        }).input);
      } else {
        // Add edit box
        domManager.addNodeChild(divOptional, editTextTaskNote.input);
        btnTaskNote.input.disabled  = false;
        btnTaskCheckList.input.disabled  = true;
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
    const dueDateTask       = inputManager.createDate('taskDueDate', 'Due Date', true, false);
    const divPriority       = domManager.createNode('div', 'task-priority');
    const pTaskPriority     = domManager.createNodeContent('p', 'Task Priority');
    const radioBtnPriority  = [];
    for (const property in taskPriority) {
      radioBtnPriority.push(
        inputManager.createRadioButton(`priority-${taskPriority[property]}`, property, null, cbEventEditPriority, (property === taskPriority.low))
      );
    }
    const divSwitchTaskType = domManager.createAddNode('div', divInput, 'task-type-container');
    const btnTaskNote       = inputManager.createButton('btnNoteID', 'Note', 'note-text-outline.svg', 'task-type-icon');
    const switchTaskType    = inputManager.createSwitchButton('switchTaskType', true, 'Change task type', cbEventChangeTaskType);
    const btnTaskCheckList  = inputManager.createButton('btnCheckListID', 'Checklist', 'format-list-checkbox.svg', 'task-type-icon');
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
        editTextTaskNote.input.value = (projectTask.getNote ? projectTask.getNote : '');
        domManager.addNodeChild(divOptional, editTextTaskNote.input);
        btnTaskNote.input.disabled  = false;
        btnTaskCheckList.input.disabled  = true;
      } else {
        btnTaskNote.input.disabled  = true;
        btnTaskCheckList.input.disabled  = false;
        // Insert add new item in checklist
        domManager.addNodeChild(divOptional, inputManager.createButton('addTaskItem', 'Add item in checklist', 'plus-circle-outline.svg', 'task-button', () => {
          // Fill last item first
          if(0 !== checkListTasks.length &&
            '' === checkListTasks.at(-1).querySelector('#taskItemCheckListEdit').value) return;
          // Create a new item
          cbCheckListCreateActivity(divOptional);
        }).input);
        // Get the checklist
        const list = (projectTask.getCheckList ? projectTask.getCheckList : []);
        list.forEach(a => {
          // Insert the editable activity
          cbCheckListCreateActivity(divOptional, a);
        });
        // Set switch to checked
        switchTaskType.checkbox.checked = true;
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
    domManager.addNodeChild(divSwitchTaskType, btnTaskNote.input);
    domManager.addNodeChild(divSwitchTaskType, switchTaskType.label);
    domManager.addNodeChild(divSwitchTaskType, switchTaskType.input);
    domManager.addNodeChild(divSwitchTaskType, btnTaskCheckList.input);
    domManager.addNodeChild(divInput, divSwitchTaskType);
    domManager.addNodeChild(divInput, divOptional);
    domManager.addNodeChild(formMngTask, divInput);
    if(!taskFormArgs.isEdit) {
      domManager.addNodeChild(divOptional, editTextTaskNote.input);
      btnTaskNote.input.disabled  = false;
      btnTaskCheckList.input.disabled  = true;
    }
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
  #doOpenTaskDetails(projectTitle, taskID) {
    const divMngTaskDetails = overlay.querySelector('.manage-details-task');
    const divTaskOptional   = divMngTaskDetails.querySelector('.task-details-opt');
    const task              = this.taskController.findTask(projectTitle, taskID);
    let hide                = false;
    // Toggle visibility
    domManager.toggleDisplayByNode(overlay);
    domManager.toggleDisplayByNode(divMngTaskDetails);
    // Remove all optional content
    domManager.removeAllChildNodes(divTaskOptional);
    // Update details
    divMngTaskDetails.querySelector('.task-details-title').textContent       = task.getTitle;
    divMngTaskDetails.querySelector('.task-details-description').textContent = task.getDescription;
    const taskDueDate = divMngTaskDetails.querySelector('.task-details-duedate');
    taskDueDate.textContent                                                  = task.getDueDate && task.getDueDate !== '' ? task.getDueDate 
                                                                                                                         : 'No due date';
    if(task.getExpired) {
      taskDueDate.classList.add('expired');
    } else {
      taskDueDate.classList.remove('expired');
    }
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
      if(task.getCheckList.length > 0) {
        task.getCheckList.forEach(a => {
          const divActivity = domManager.createNode('div', 'task-activity');
          divActivity.dataset.activityID = a.getID;
          const activityCheckBox = inputManager.createCheckBox(`activityID-${a.getID}`, a.getAction, () => {
            this.taskController.changeTaskActivityState(projectTitle, task.getID, a.getID, activityCheckBox.input.checked);
          }, a.getDone);
          domManager.addNodeChild(divActivity, activityCheckBox.input);
          domManager.addNodeChild(divActivity, activityCheckBox.label);
          domManager.addNodeChild(divActivity, btnManager.createImageButton('delete-circle.svg', 'task-button', () => {
            this.taskController.removeTaskActivity(projectTitle, task.getID, a.getID);
            divActivity.remove();
          }));
          domManager.addNodeChild(divTaskOptional, divActivity);
        });
        // Toggle visibility and onexit will hide the item      
        domManager.toggleDisplayByNode(divTaskOptional);
        hide = true;
      }
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
  #doUpdateExpirationTasks(data) {
    const divTaskContainer = document.querySelector('.task-container');
    if(!divTaskContainer) return;
    const pTitleProject = document.querySelector('.task-project > p:first-of-type');
    if(!pTitleProject || (pTitleProject.textContent !== data.project)) return;
    const divTask = divTaskContainer.querySelector(`.task-item[data-id='${data.task.getID}']`);
    if(!divTask) return;
    UiTaskController.#doExpireTask(divTask, data.task.getExpired);
  } 
  static #doExpireTask(divTask, expired) {
    const pDueDate = divTask.querySelector('.task-duedate');
    if(!pDueDate) return;
    if(expired) {
      divTask.classList.add('expired');
    } else {
      divTask.classList.remove('expired');
    }
  }
  doAddTaskUI(parentContainer, projectTitle, task) {
    const divTask = domManager.createNode('div', 'task-item');
    const taskFormArgs = {
      isEdit: true,
      projectTitle: projectTitle,
      taskID: task.getID,
      taskTitle: task.getTitle,
      priorityLevel: task.getPriority,
      expired: task.getExpired,
      divTask: divTask,
      parentContainer: parentContainer
    };
    const checkBoxDone = inputManager.createCheckBox('checkBoxDone', null, () => {
      this.taskController.changeTaskState(taskFormArgs.projectTitle, taskFormArgs.taskID, checkBoxDone.input.checked);
      taskFormArgs.divTask.classList.toggle('complete');
    }, task.getDone);
    if(task.getDone) {
      taskFormArgs.divTask.classList.add('complete');
    } else {
      taskFormArgs.divTask.classList.remove('complete');
    }
    const pTaskTitle   = domManager.createNodeContent('p', task.getTitle, 'task-title');
    const pTaskDueDate = domManager.createNodeContent('p', task.getDueDate ? task.getDueDate : 'No due date', 'task-duedate');
    taskFormArgs.divTask.classList.toggle(taskFormArgs.priorityLevel);
    taskFormArgs.divTask.dataset.id = taskFormArgs.taskID;
    // Add node to container
    domManager.addNodeChild(parentContainer, divTask);
    domManager.addNodeChild(divTask, checkBoxDone.input);
    domManager.addNodeChild(divTask, pTaskTitle);
    domManager.addNodeChild(divTask, pTaskDueDate);
    UiTaskController.#doExpireTask(taskFormArgs.divTask, taskFormArgs.expired);
    domManager.addNodeChild(divTask, btnManager.createTextButton('details', 'task-button details', () => {
      this.#doOpenTaskDetails(taskFormArgs.projectTitle, taskFormArgs.taskID);
    }));
    domManager.addNodeChild(divTask, btnManager.createImageButton('pencil-circle.svg', 'task-button', () => {
      this.#doManageTaskForm(taskFormArgs);
    }));
    domManager.addNodeChild(divTask, btnManager.createImageButton('delete-circle.svg', 'task-button', () => {
      if(this.taskController.remove(taskFormArgs.projectTitle, taskFormArgs.taskID)) {
        divTask.remove();
        this.doRemoveDueDateProjectTask(taskFormArgs.projectTitle);
      }
    }));
  }
  doCreateTask() {
    this.#doManageTaskForm({isEdit: false});
  }
  doReloadSorted(projectTitle, parentContainer, mode) {
    domManager.removeAllChildNodes(parentContainer);
    const tasks = this.taskController.fetchSorted(projectTitle, mode);
    tasks.forEach(t => this.doAddTaskUI(parentContainer, projectTitle, t));
  }
  doEditProjectTitle(oldProjectTitle, project) {
    const queryTag = this.dueDateView.active ? `.duedate-task-project[data-project-title='${oldProjectTitle}'] > p:first-of-type`
                                             : '.task-project > p:first-of-type';
    // Check if project is currently onscreen
    const pTitleProject = document.querySelector(queryTag);
    if(pTitleProject && pTitleProject.textContent === oldProjectTitle) {
      pTitleProject.textContent = project.title;
      if(this.dueDateView.active) {
        pTitleProject.parentElement.dataset.projectTitle = project.title;
      } else {
        document.querySelector('.task-project > p:last-of-type').textContent = project.description;
      }
    }
  }
  doRemoveProject(projectTitle = undefined) {
    // Check if project is currently onscreen
    const queryTag = (this.dueDateView.active && projectTitle) ? `.duedate-task-project[data-project-title='${projectTitle}'] > p:first-of-type`
                                                               : '.task-project > p:first-of-type';
    const pTitleProject = document.querySelector(queryTag);
    if(!projectTitle || pTitleProject.textContent === projectTitle) {
      if(this.dueDateView.active && projectTitle) {
        // Remove project
        pTitleProject.parentElement.remove();
      } else {
        // Uninstall expiration timer
        this.taskController.uninstallExpirationTimer();
        // Remove main content
        domManager.removeAllChildNodes(main);
        // Disable due date mode
        this.dueDateView.active = false;
        this.dueDateView.mode = undefined;
      }
    }
  }
  doLoadProjectTask(projectTitle) {
    // Style the flexbox
    main.style.justifyContent = 'flex-start';
    // Disable due date mode
    this.dueDateView.active = false;
    this.dueDateView.mode = undefined;
    // Initialize the current sort mode
    this.currentSortMode = taskSortMode.addDateAscending;
    // Remove main content
    domManager.removeAllChildNodes(main);
    // Find project
    const project = this.projectController.find(projectTitle);
    // Load project title and description
    const divProject = domManager.createAddNode('div', main, 'task-project');
    const divTaskContainer = domManager.createNode('div', 'task-container');
    const tasks = this.taskController.fetch(projectTitle);
    tasks.forEach(t => this.doAddTaskUI(divTaskContainer, projectTitle, t));
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
    // Create a sort selector
    const option = [];
    for (const property in taskSortMode) {
      option.push(taskSortMode[property]);
    }
    const selectSortType = inputManager.createSelect('selectSortTaskID', option, taskSortMode.addDateAscending, 'Sort');
    selectSortType.input.onchange = () => {
      if(this.currentSortMode !== selectSortType.input.value) {
        this.currentSortMode = selectSortType.input.value;
        this.doReloadSorted(projectTitle, divTaskContainer, this.currentSortMode);
      }
    }
    domManager.addNodeChild(main, selectSortType.label);
    domManager.addNodeChild(main, selectSortType.input);
    domManager.addNodeChild(main, divTaskContainer);
    // Install expiration timer
    this.taskController.installExpirationTimer(new DataSubscriber(this.#doUpdateExpirationTasks));
  }
  doRemoveDueDateProjectTask(project) {
    if(!this.dueDateView.active) return;
    const divProjectContainer = main.querySelector('.duedate-project-container');
    const divProject = divProjectContainer.querySelector(`.duedate-task-project[data-project-title='${project}']`);
    if(!divProject) return;
    if(!divProject.querySelector('.duedate-task-container').children.length) divProject.remove();
  }
  doAddDueDateProjectTask(project) {
    let divTaskContainer = null;
    if(!this.dueDateView.active) return divTaskContainer;
    const divProjectContainer = main.querySelector('.duedate-project-container');
    const divProject = divProjectContainer.querySelector(`.duedate-task-project[data-project-title='${project}']`);
    if(!divProject) {
      const divProject = domManager.createAddNode('div', divProjectContainer, 'duedate-task-project');
      divProject.dataset.projectTitle = project;
      domManager.addNodeChild(divProject, domManager.createNodeContent('p', project));
      divTaskContainer = domManager.createAddNode('div', divProject, 'duedate-task-container');
    } else {
      divTaskContainer = divProject.querySelector('.duedate-task-container');
    }
    return divTaskContainer;
  }
  doLoadTasksByDueDate(mode) {
    // Style the flexbox
    main.style.justifyContent = 'flex-start';
    // Disable due date mode
    this.dueDateView.active = true;
    this.dueDateView.mode = mode;
    // Uninstall expiration timer
    this.taskController.uninstallExpirationTimer();
    // Remove main content
    domManager.removeAllChildNodes(main);
    // Fetch by due date
    const mapTasks = this.taskController.fetchByDueDate(mode);
    // Create a project container
    const divProjectContainer = domManager.createAddNode('div', main, 'duedate-project-container');
    // Loop on projects
    mapTasks.forEach((tasks, project) => {
      const divProject = domManager.createAddNode('div', divProjectContainer, 'duedate-task-project');
      divProject.dataset.projectTitle = project;
      domManager.addNodeChild(divProject, domManager.createNodeContent('p', project));
      const divTaskContainer = domManager.createAddNode('div', divProject, 'duedate-task-container');
      tasks.forEach(t => this.doAddTaskUI(divTaskContainer, project, t));
    });
  }
}