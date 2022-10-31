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
  #toggleEditing() {
    this.#isEdit = this.#isEdit ? false : true;
  }
  doAddProjectUI(parentContainer, projectTitle) {
    const nodeProject = domManager.createNodeClass('div', 'project');
    const btnProject = btnManager.createButton(projectTitle, 'project.svg', 'project-button', () => {
      // TODO: stop editing #isEdit
      this.uiTaskController.doLoadProjectTask(projectTitle);
    });
    domManager.addNodeChild(nodeProject, btnProject);
    domManager.addNodeChild(nodeProject, btnManager.createImageButton('pencil-circle.svg', 'project-button', () => {
      /* Lock editing */
      if(this.#isEdit === true) return;
      this.#toggleEditing();
      /* Get items */
      const btnAddProject  = document.querySelector('.add-project-btn');
      const formAddProject = document.querySelector('.add-project-form');
      /* Toggle visibility */
      domManager.toggleDisplayByNode(btnAddProject);
      domManager.toggleDisplayByNode(formAddProject);
      /* Find project */
      const project = this.projectController.find(projectTitle);
      /* Add input */
      const editTextPrjTitle = inputManager.createEditText('prjTitle', 'Project title:', 'Project name');
      const editTextPrjDescr = inputManager.createEditText('prjDescription', 'Project description:', 'Project description');
      domManager.addNodeChild(formAddProject, editTextPrjTitle.label);
      domManager.addNodeChild(formAddProject, editTextPrjTitle.input);
      domManager.addNodeChild(formAddProject, editTextPrjDescr.label);
      domManager.addNodeChild(formAddProject, editTextPrjDescr.input);    
      /* Set input values */
      editTextPrjTitle.input.value = project.title;
      editTextPrjDescr.input.value = project.description;
      /* Cancel button */
      const btnCancel = domManager.createAddNode('button', formAddProject, 'btnForm', null, 'Cancel');
      btnCancel.setAttribute('type', 'button');
      btnCancel.onclick = () => {
        domManager.removeAllChildNodes(formAddProject);
        domManager.toggleDisplayByNode(formAddProject);
        domManager.toggleDisplayByNode(btnAddProject);
        /* Unlock editing */
        this.#toggleEditing();
      }
      /* Submit button */
      const btnSubmit = domManager.createAddNode('button', formAddProject, 'btnForm', null, 'Submit');
      btnSubmit.setAttribute('type', 'submit');
      formAddProject.onsubmit = (e) => {
        e.preventDefault();
        if(this.projectController.edit(project.title, editTextPrjTitle.input.value, editTextPrjDescr.input.value)) {
          /* Update project title */
          projectTitle = editTextPrjTitle.input.value;
          btnManager.editButtonText(btnProject, projectTitle);
        }
        domManager.removeAllChildNodes(formAddProject);
        domManager.toggleDisplayByNode(formAddProject);
        domManager.toggleDisplayByNode(btnAddProject);
        /* Unlock editing */
        this.#toggleEditing();
      }
    }));
    domManager.addNodeChild(nodeProject, btnManager.createImageButton('delete-circle.svg', 'project-button', () => {
      /* Lock editing */
      if(this.#isEdit === true) return;
      this.#toggleEditing();
      /* Remove project */
      this.projectController.remove(projectTitle);
      nodeProject.remove();
      /* Unlock editing */
      this.#toggleEditing();
    }));
    domManager.addNodeChild(parentContainer, nodeProject);
  }
  doCreateProjectBar() {
    /* Load projects from project controller */
    const projects = this.projectController.load();
    /* Create inbox project does not exists */
    this.projectController.add('Inbox');
    /* Create project bar */
    const navProjectBar = domManager.createNode('div', 'nav-projects');
    const formAddProject = domManager.createNode('form', 'add-project-form');
    const nodeProjects = domManager.createNode('div', 'project-container');
    /* Toggle visibility */
    domManager.toggleDisplayByNode(formAddProject);
    /* Fetch projects */
    projects.forEach((project) => {
      /* Esclude inbox because it has a different management */
      if(project.title.toLowerCase() !== 'inbox') {
        this.doAddProjectUI(nodeProjects, project.title);
      }
    });
    /* Add project button */
    const btnAddProject = btnManager.createButton('Add project', 'plus-circle-outline.svg', 'project-button', async () => {
      /* Lock editing */
      if(this.#isEdit === true) return;
      this.#toggleEditing();
      /* Toggle visibility */
      domManager.toggleDisplayByNode(btnAddProject);
      domManager.toggleDisplayByNode(formAddProject);
      /* Add input */
      const editTextPrjTitle = inputManager.createEditText('prjTitle', 'Project title:', 'Project name');
      const editTextPrjDescr = inputManager.createEditText('prjDescription', 'Project description:', 'Project description');
      domManager.addNodeChild(formAddProject, editTextPrjTitle.label);
      domManager.addNodeChild(formAddProject, editTextPrjTitle.input);
      domManager.addNodeChild(formAddProject, editTextPrjDescr.label);
      domManager.addNodeChild(formAddProject, editTextPrjDescr.input);
      /* Cancel button */
      const btnCancel = domManager.createAddNode('button', formAddProject, 'btnForm', null, 'Cancel');
      btnCancel.setAttribute('type', 'button');
      btnCancel.onclick = () => {
        domManager.removeAllChildNodes(formAddProject);
        domManager.toggleDisplayByNode(formAddProject);
        domManager.toggleDisplayByNode(btnAddProject);
        /* Unlock editing */
        this.#toggleEditing();
      }
      /* Submit button */
      const btnSubmit = domManager.createAddNode('button', formAddProject, 'btnForm', null, 'Submit');
      btnSubmit.setAttribute('type', 'submit');
      formAddProject.onsubmit = (e) => {
        e.preventDefault();
        if(this.projectController.add(editTextPrjTitle.input.value, editTextPrjDescr.input.value)) {
          this.doAddProjectUI(nodeProjects, editTextPrjTitle.input.value);
        }
        domManager.removeAllChildNodes(formAddProject);
        domManager.toggleDisplayByNode(formAddProject);
        domManager.toggleDisplayByNode(btnAddProject);
        /* Unlock editing */
        this.#toggleEditing();
      }
    });
    btnAddProject.classList.add('add-project-btn');
    /* Load project to navigation path */
    domManager.addNodeChild(navProjectBar, domManager.createNodeContent('p', 'Projects'));
    domManager.addNodeChild(navProjectBar, btnAddProject);
    domManager.addNodeChild(navProjectBar, formAddProject);
    domManager.addNodeChild(navProjectBar, nodeProjects);
    return navProjectBar;
  }
}