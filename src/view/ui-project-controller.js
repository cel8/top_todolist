import 'Style/style.css';
import * as domManager from 'Utilities/dom-manager.js';
import * as btnManager from 'Utilities/button.js';
import * as inputManager from 'Utilities/input-manager.js';
import 'Assets/images/svg/plus-circle-outline.svg';
import 'Assets/images/svg/project.svg';
import 'Assets/images/svg/pencil-circle.svg';
import 'Assets/images/svg/delete-circle.svg';
import { ProjectController } from 'Controller/project-controller.js';
import { UiTaskController } from 'View/ui-task-controller.js';

export class UiProjectController {
  #isEdit = false; /* Private edit field */
  constructor() {
    this.projectController = ProjectController.getInstance();
    this.uiTaskController = new UiTaskController();
  }
  #isLocked() { return this.#isEdit === true; }
  #toggleEditing() {
    this.#isEdit = this.#isEdit ? false : true;
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
        prjFormArgs.projectTitle = editTextPrjTitle.input.value;
        btnManager.editButtonText(prjFormArgs.projectBtn, prjFormArgs.projectTitle);
      }
    }
    // Add event
    const cbEventAdd = () => {
      if(this.projectController.add(editTextPrjTitle.input.value, editTextPrjDescr.input.value)) {     
        this.doAddProjectUI(prjFormArgs.parentContainer, editTextPrjTitle.input.value);
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
    const editTextPrjDescr = inputManager.createEditText('prjDescription', 'Project description:', 'Project description');
    const btnCancel        = inputManager.createTextButton('btnCancel', 'Cancel', 'form-project-button', cbEventCancel);
    const btnSubmit        = inputManager.createTextButton('btnSubmit', 'Submit', 'form-project-button', cbEventSubmit, formMngProject);
    domManager.addNodeChild(formMngProject, editTextPrjTitle.label);
    domManager.addNodeChild(formMngProject, editTextPrjTitle.input);
    domManager.addNodeChild(formMngProject, editTextPrjDescr.label);
    domManager.addNodeChild(formMngProject, editTextPrjDescr.input);
    domManager.addNodeChild(formMngProject, btnCancel.input);
    domManager.addNodeChild(formMngProject, btnSubmit.input);
    // Set value when editing
    if(prjFormArgs.isEdit) {
      editTextPrjTitle.input.value = project.getTitle;
      editTextPrjDescr.input.value = project.getDescription;
    }
  }
  doAddProjectUI(parentContainer, projectTitle) {
    // TODO: implement number of active tasks observer
    const prjFormArgs = {
      isEdit: true,
      projectTitle: projectTitle,
      projectBtn: null
    };
    // TODO: need to remove or refresh tasks on edit/remove
    const nodeProject = domManager.createNodeClass('div', 'project');
    const btnProject = btnManager.createButton(prjFormArgs.projectTitle, 'project.svg', 'project-button', () => {
      // TODO: stop editing #isEdit
      this.uiTaskController.doLoadProjectTask(prjFormArgs.projectTitle);
    });
    prjFormArgs.projectBtn = btnProject;
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
      nodeProject.remove();
      /* Unlock editing */
      this.#toggleEditing();
    }));
    domManager.addNodeChild(parentContainer, nodeProject);
  }
  doCreateProjectBar() {
    /* Load projects from project controller */
    this.projectController.load();
    /* Create inbox project does not exists */
    this.projectController.add('Inbox');
    /* Create project bar */
    const navProjectBar = domManager.createNode('div', 'nav-projects');
    const formAddProject = domManager.createNode('form', 'manage-project-form');
    const divProjectContainer = domManager.createNode('div', 'project-container');
    /* Toggle visibility */
    domManager.toggleDisplayByNode(formAddProject);
    /* Fetch projects */
    this.projectController.fetchTitles().forEach(title => {
      /* Esclude inbox because it has a different management */
      if(title.toLowerCase() !== 'inbox') {
        this.doAddProjectUI(divProjectContainer, title);
      }
    });
    /* Add project button */
    const btnAddProject = btnManager.createButton('Add project', 'plus-circle-outline.svg', 'project-button', async () => {
      this.#doManageProjectForm({ isEdit: false, parentContainer: divProjectContainer });
    });
    btnAddProject.classList.add('add-project-btn');
    /* Load project to navigation path */
    domManager.addNodeChild(navProjectBar, domManager.createNodeContent('p', 'Projects'));
    domManager.addNodeChild(navProjectBar, btnAddProject);
    domManager.addNodeChild(navProjectBar, formAddProject);
    domManager.addNodeChild(navProjectBar, divProjectContainer);
    return navProjectBar;
  }
}