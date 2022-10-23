import 'Style/style.css';
import * as domManager from 'Utilities/dom-manager.js';
import * as btnManager from 'Utilities/button.js';
import 'Assets/images/svg/plus-circle-outline.svg';
import 'Assets/images/svg/project.svg';
import 'Assets/images/svg/pencil-circle.svg';
import 'Assets/images/svg/delete-circle.svg';
import { ProjectController } from 'Controller/project-controller.js';

export class UiProjectController {
  constructor() {
    this.projectController = new ProjectController();
  }
  doAddProjectUI(parentContainer, projectTitle) {
    const nodeProject = domManager.createNodeClass('div', 'project');
    domManager.addNodeChild(nodeProject, domManager.createNodeContent('p', projectTitle));
    domManager.addNodeChild(nodeProject, btnManager.createImageButton('pencil-circle.svg', 'project-button'));
    domManager.addNodeChild(nodeProject, btnManager.createImageButton('delete-circle.svg', 'project-button', () => {
      this.projectController.remove(projectTitle);
      nodeProject.remove();
    }));
    domManager.addNodeChild(parentContainer, nodeProject);
  }
  doCreateProjectBar() {
    /* Load projects from project controller */
    const projects = this.projectController.load();
    /* Create inbox project does not exists */
    this.projectController.create('Inbox');
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
      /* Toggle visibility */
      domManager.toggleDisplayByNode(btnAddProject);
      domManager.toggleDisplayByNode(formAddProject);
      // Add input
      const nameTitleProject = 'projectTitle'
      const labelProject = domManager.createAddNode('label', formAddProject, null, null, 'Project title:');
      labelProject.htmlFor = nameTitleProject;
      const inputProject = domManager.createAddNode('input', formAddProject, null, nameTitleProject);
      inputProject.setAttribute('type', 'text');
      inputProject.setAttribute('name', nameTitleProject);
      inputProject.setAttribute('placeholder', 'Project name');
      inputProject.required = true;
      const btnCancel = domManager.createAddNode('button', formAddProject, 'btnForm', null, 'Cancel');
      btnCancel.setAttribute('type', 'button');
      btnCancel.onclick = () => {
        domManager.removeAllChildNodes(formAddProject);
        domManager.toggleDisplayByNode(formAddProject);
        domManager.toggleDisplayByNode(btnAddProject);
      }
      const btnSubmit = domManager.createAddNode('button', formAddProject, 'btnForm', null, 'Submit');
      btnSubmit.setAttribute('type', 'submit');
      formAddProject.onsubmit = (e) => {
        e.preventDefault();
        if(this.projectController.create(inputProject.value)) {
          this.doAddProjectUI(nodeProjects, inputProject.value);
        }
        domManager.removeAllChildNodes(formAddProject);
        domManager.toggleDisplayByNode(formAddProject);
        domManager.toggleDisplayByNode(btnAddProject);
      }
    })
    /* Load project to navigation path */
    domManager.addNodeChild(navProjectBar, domManager.createNodeContent('p', 'Projects'));
    domManager.addNodeChild(navProjectBar, btnAddProject);
    domManager.addNodeChild(navProjectBar, formAddProject);
    domManager.addNodeChild(navProjectBar, nodeProjects);
    return navProjectBar;
  }
}