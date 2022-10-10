import 'Style/style.css';
import * as domManager from 'Utilities/dom-manager.js';
import { createImageLinkButton } from 'Utilities/button.js';
import 'Assets/images/svg/menu.svg';
import 'Assets/images/svg/home-outline.svg';
import 'Assets/images/svg/calendar-blank.svg';
import 'Assets/images/svg/github.svg';
import 'Assets/images/svg/plus-circle-outline.svg';
import 'Assets/images/todo-list.gif';
import { setTimeout } from 'timers-promises';
import { ProjectController } from 'Controller/project-controller.js';

const body = document.querySelector('body');

export class UiController {
  constructor() {
    this.projectController = new ProjectController();
  }
  #doLoadHeader() {
    const header  = domManager.createNode('header');
    const imgMenu = domManager.createAddNodeImg('menu.svg', 'menu', header, 'icon');
    const imgHome = domManager.createAddNodeImg('home-outline.svg', 'home', header, 'icon');
    domManager.createAddNodeImg('todo-list.gif', 'todo-list', header, 'icon');
    domManager.createAddNode('p', header, 'main-text', null, 'TODO list');
    domManager.createAddNodeImg('calendar-blank.svg', 'today', header, 'icon');
    domManager.addNodeChild(body, header);
    imgMenu.onclick = async () => {
      await setTimeout(250);
      domManager.toggleDisplay('nav');
    }
  }
  #doLoadMainContent() {
    const nav = domManager.createNode('nav');
    const main = domManager.createNode('main');
    nav.textContent = 'nav';
    main.textContent = 'main';
    const imgAddProject = domManager.createAddNodeImg('plus-circle-outline.svg', 'add-project', nav, 'icon');
    imgAddProject.onclick = async () => {
      // Create project form overlay
      const divAddProject = domManager.createAddNode('div', nav);
      const formAddProject = domManager.createAddNode('form', divAddProject, 'projectForm');
      // Add input
      const nameTitleProject = 'projectTitle'
      const labelProject = domManager.createAddNode('label', formAddProject, null, null, 'Project title:');
      labelProject.htmlFor = nameTitleProject;
      const inputProject = domManager.createAddNode('input', formAddProject, null, nameTitleProject);
      inputProject.setAttribute('type', 'text');
      inputProject.setAttribute('name', nameTitleProject);
      inputProject.setAttribute('placeholder', 'Project name');
      const btnCancel = domManager.createAddNode('button', formAddProject, 'btnForm', null, 'Cancel');
      btnCancel.setAttribute('type', 'button');
      btnCancel.onclick = () => {
        domManager.removeAllChildNodes(divAddProject);
        nav.removeChild(divAddProject);
      }
      const btnSubmit = domManager.createAddNode('button', formAddProject, 'btnForm', null, 'Submit');
      btnSubmit.setAttribute('type', 'submit');
      formAddProject.onsubmit = (e) => {
        e.preventDefault();
        console.log('Project title: ' + inputProject.value);
      }
    }
    domManager.addNodeChild(body, nav);
    domManager.addNodeChild(body, main);

  }
  #doLoadProjectContent() {

  }
  #doLoadFooter() {
    const curYear = new Date().getFullYear();
    const footer = domManager.createNode('footer')
    domManager.createAddNode('p', footer, null, null, `Copyright © ${curYear} Alessandro Celotti`);
    domManager.addNodeChild(footer, createImageLinkButton('https://github.com/cel8', 'github.svg'));
    domManager.addNodeChild(body, footer);
  }
  doLoadUI() {
    this.#doLoadHeader();
    this.#doLoadMainContent();
    this.#doLoadFooter();
  }
}