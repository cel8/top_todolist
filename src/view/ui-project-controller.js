import 'Style/style.css';
import * as domManager from 'Utilities/dom-manager.js';
import * as btnManager from 'Utilities/button.js';
import * as inputManager from 'Utilities/input-manager.js';
import { ProjectController } from 'Controller/project-controller.js';
import { UiTaskController } from 'View/ui-task-controller.js';
import { DataSubscriber } from 'Controller/data-subscriber.js';
import 'Assets/images/svg/plus-circle-outline.svg';
import 'Assets/images/svg/project.svg';
import 'Assets/images/svg/pencil-circle.svg';
import 'Assets/images/svg/delete-circle.svg';
import 'Assets/images/svg/inbox.svg';

const nav = document.querySelector('nav');
const projectInboxTitle = 'Inbox';

export class UiProjectController {
  #isEdit = false; /* Private edit field */
  constructor() {
    this.projectController = ProjectController.getInstance();
    this.uiTaskController = UiTaskController.getInstance();
  }
  #isLocked() { return this.#isEdit === true; }
  #toggleEditing() {
    this.#isEdit = this.#isEdit ? false : true;
  }
  #doDismissProjectForm() {
    // Do not delete anything
    if(!this.#isLocked()) return;
    /* Get items */
    const btnAddProject  = document.querySelector('.add-project-btn');
    const formMngProject = document.querySelector('.manage-project-form');
    // Remove all form content
    domManager.removeAllChildNodes(formMngProject);
    /* Toggle visibility */
    domManager.toggleDisplayByNode(btnAddProject);
    domManager.toggleDisplayByNode(formMngProject);
    this.#toggleEditing();
  }
  #doManageProjectForm(prjFormArgs) {
    /* Lock editing */
    if(this.#isLocked()) return;
    this.#toggleEditing();
    /* Get items */
    const btnAddProject  = document.querySelector('.add-project-btn');
    const formMngProject = document.querySelector('.manage-project-form');
    const project = prjFormArgs.isEdit ? this.projectController.find(prjFormArgs.projectTitle)
                                       : null;
    // Remove all form content
    domManager.removeAllChildNodes(formMngProject);
    /* Toggle visibility */
    domManager.toggleDisplayByNode(btnAddProject);
    domManager.toggleDisplayByNode(formMngProject);
    // Hide form and overlay
    const cbFinalizeForm = () => {
      domManager.toggleDisplayByNode(formMngProject);
      domManager.toggleDisplayByNode(btnAddProject);
      /* Unlock editing */
      this.#toggleEditing();
    };
    // Cancel event
    const cbEventCancel = cbFinalizeForm;
    // Edit event
    const cbEventEdit = () => {
      if(this.projectController.edit(project.title, editTextPrjTitle.input.value, editTextPrjDescr.input.value)) {
        /* Update project title */
        this.uiTaskController.doEditProjectTitle(prjFormArgs.projectTitle, 
                                                 { title: editTextPrjTitle.input.value, description: editTextPrjDescr.input.value });
        prjFormArgs.projectTitle = editTextPrjTitle.input.value;
        btnManager.editButtonText(prjFormArgs.divProject.querySelector('button:first-of-type'), prjFormArgs.projectTitle);
        prjFormArgs.divProject.dataset.title = prjFormArgs.projectTitle;
        this.projectController.notify(prjFormArgs.projectTitle);
      }
    }
    // Add event
    const cbEventAdd = () => {
      if(this.projectController.add(editTextPrjTitle.input.value, editTextPrjDescr.input.value, new DataSubscriber(this.#doUpdateTaskCompletion))) {     
        this.doAddProjectUI(prjFormArgs.parentContainer, editTextPrjTitle.input.value);
        this.projectController.notify(editTextPrjTitle.input.value);
      }
    }
    // Submit event
    // TODO: need to implement form validation
    const cbEventSubmit = (e) => {
      e.preventDefault();
      prjFormArgs.isEdit ? cbEventEdit() : cbEventAdd();
      cbFinalizeForm();
    };
    /* Add input */
    const editTextPrjTitle = inputManager.createEditText('prjTitle', 'Project title:', 'Project name');
    const editTextPrjDescr = inputManager.createEditText('prjDescription', 'Project description:', 'Project description', false);
    const btnCancel        = inputManager.createTextButton('btnCancel', 'Cancel', 'form-project-button', cbEventCancel);
    const btnSubmit        = inputManager.createTextButton('btnSubmit', 'Submit', 'form-project-button', cbEventSubmit, formMngProject);
    const divCompleteBtn   = domManager.createNode('div', 'complete-button');
    domManager.addNodeChild(formMngProject, editTextPrjTitle.label);
    domManager.addNodeChild(formMngProject, editTextPrjTitle.input);
    domManager.addNodeChild(formMngProject, editTextPrjDescr.label);
    domManager.addNodeChild(formMngProject, editTextPrjDescr.input);
    domManager.addNodeChild(formMngProject, divCompleteBtn);
    domManager.addNodeChild(divCompleteBtn, btnSubmit.input);
    domManager.addNodeChild(divCompleteBtn, btnCancel.input);
    // Set value when editing
    if(prjFormArgs.isEdit) {
      editTextPrjTitle.input.value = project.getTitle;
      editTextPrjDescr.input.value = project.getDescription;
    }
  }
  #doUpdateTaskCompletion(data) {
    const divProject = document.querySelector(`[data-title='${data.project}']`);
    if(!divProject) return;
    const divCompletion = divProject.querySelector('.task-completion');
    if(!divCompletion) return;
    if(!data.total) {
      divCompletion.classList.remove('incomplete', 'complete');
      divCompletion.classList.add('empty');
      divCompletion.textContent = '0';
    } else {
      if(data.complete === data.total) {
        divCompletion.classList.remove('empty', 'incomplete');
        divCompletion.classList.add('complete');
      } else {
        divCompletion.classList.remove('empty', 'complete');
        divCompletion.classList.add('incomplete');
      }
      divCompletion.textContent = `${data.complete}/${data.total}`;
    }
  }
  #doOpenProject(projectTitle) {
    this.#doDismissProjectForm();
    this.uiTaskController.doLoadProjectTask(projectTitle);
  }
  doAddProjectUI(parentContainer, projectTitle) {
    const prjFormArgs = {
      isEdit: true,
      projectTitle: projectTitle,
      divProject: null
    };
    const nodeProject = domManager.createNodeClass('div', 'project');
    const btnProject = btnManager.createButton(prjFormArgs.projectTitle, 'project.svg', 'project-button', () => {
      this.#doOpenProject(prjFormArgs.projectTitle);
    });
    prjFormArgs.divProject = nodeProject;
    domManager.addNodeChild(nodeProject, btnProject);
    domManager.addNodeChild(nodeProject, btnManager.createImageButton('pencil-circle.svg', 'project-button', () => {
      this.#doManageProjectForm(prjFormArgs);
    }));
    domManager.addNodeChild(nodeProject, btnManager.createImageButton('delete-circle.svg', 'project-button', () => {
      /* Lock editing */
      if(this.#isLocked()) return;
      this.#toggleEditing();
      /* Remove project */
      this.projectController.remove(prjFormArgs.projectTitle);
      this.uiTaskController.doRemoveProject(prjFormArgs.projectTitle);
      nodeProject.remove();
      /* Unlock editing */
      this.#toggleEditing();
    }));
    domManager.createAddNode('div', nodeProject, 'task-completion');
    prjFormArgs.divProject.dataset.title = prjFormArgs.projectTitle;
    domManager.addNodeChild(parentContainer, nodeProject);
  }
  doLoadProjects() {
    /* Load projects from project controller */
    this.projectController.load();
    /* Create inbox project does not exists */
    this.projectController.add(projectInboxTitle);
  }
  doCreateInbox() {
    const nodeProject = domManager.createNodeClass('div', 'project');
    const btnProject = btnManager.createButton(projectInboxTitle, 'inbox.svg', 'project-button', () => {
      this.#doOpenProject(projectInboxTitle);
    });
    domManager.addNodeChild(nodeProject, btnProject);
    domManager.createAddNode('div', nodeProject, 'task-completion');
    nodeProject.dataset.title = projectInboxTitle;
    domManager.addNodeChild(nav, nodeProject);
    this.projectController.connect(projectInboxTitle, new DataSubscriber(this.#doUpdateTaskCompletion));
  }
  doCreateProjectBar() {
    /* Create project bar */
    const navProjectBar = domManager.createNode('div', 'nav-projects');
    const formAddProject = domManager.createNode('form', 'manage-project-form');
    const divProjectContainer = domManager.createNode('div', 'project-container');
    /* Toggle visibility */
    domManager.toggleDisplayByNode(formAddProject);
    /* Add project button */
    const btnAddProject = btnManager.createButton('Add project', 'plus-circle-outline.svg', 'project-button', async () => {
      this.#doManageProjectForm({ isEdit: false, parentContainer: divProjectContainer });
    });
    btnAddProject.classList.add('add-project-btn');
    /* Load project to navigation path */
    domManager.addNodeChild(nav, navProjectBar);
    domManager.addNodeChild(navProjectBar, domManager.createNodeContent('p', 'Projects'));
    domManager.addNodeChild(navProjectBar, btnAddProject);
    domManager.addNodeChild(navProjectBar, formAddProject);
    domManager.addNodeChild(navProjectBar, divProjectContainer);
    /* Fetch projects */
    this.projectController.fetchTitles().forEach(title => {
      /* Esclude inbox because it has a different management */
      if(title.toLowerCase() !== projectInboxTitle.toLowerCase()) {
        this.doAddProjectUI(divProjectContainer, title);
        this.projectController.connect(title, new DataSubscriber(this.#doUpdateTaskCompletion));
      }
    });
  }
}