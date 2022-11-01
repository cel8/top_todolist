import 'Style/style.css';
import * as domManager from 'Utilities/dom-manager.js';
import * as btnManager from 'Utilities/button.js';
import 'Assets/images/svg/menu.svg';
import 'Assets/images/svg/home-outline.svg';
import 'Assets/images/svg/calendar-blank.svg';
import 'Assets/images/svg/github.svg';
import 'Assets/images/todo-list.gif';
import 'Assets/images/svg/inbox.svg';
import 'Assets/images/svg/calendar-today.svg';
import 'Assets/images/svg/calendar-week.svg';
import 'Assets/images/svg/calendar-month.svg';
import { setTimeout } from 'timers-promises';
import { UiProjectController } from 'View/ui-project-controller';
import { UiTaskController } from 'View/ui-task-controller.js';

const body = document.querySelector('body');

export class UiController {
  constructor() {
    this.uiProjectController = new UiProjectController();
    this.uiTaskController = new UiTaskController();
  }
  #doLoadHeader() {
    const header  = document.querySelector('header');
    const imgMenu = domManager.createAddNodeImg('menu.svg', 'menu', header, 'icon');
    const imgHome = domManager.createAddNodeImg('home-outline.svg', 'home', header, 'icon');
    domManager.createAddNodeImg('todo-list.gif', 'todo-list', header, 'icon');
    domManager.createAddNode('p', header, 'main-text', null, 'Task list');
    domManager.createAddNodeImg('calendar-blank.svg', 'today', header, 'icon');
    domManager.addNodeChild(header, btnManager.createButton('Create task', 'plus-circle-outline.svg', 'project-button', () => {
      this.uiTaskController.doCreateTask();
    }));
    domManager.addNodeChild(body, header);
    imgMenu.onclick = async () => {
      await setTimeout(250);
      domManager.toggleDisplay('nav');
    }
  }
  #doLoadMainContent() {
    const main = document.querySelector('main');
    this.#doCreateNavBar();
    domManager.addNodeChild(body, main);
  }
  #doCreateNavBar() {
    /* Create navigation bar */
    const nav = document.querySelector('nav');
    const nodeProjects = this.uiProjectController.doCreateProjectBar();
    domManager.addNodeChild(nav, btnManager.createButton('Inbox', 'inbox.svg', 'project-button', () => {
      this.uiTaskController.doLoadProjectTask('Inbox');
    }));
    domManager.addNodeChild(nav, btnManager.createButton('Today', 'calendar-today.svg', 'project-button'));
    domManager.addNodeChild(nav, btnManager.createButton('This week', 'calendar-week.svg', 'project-button'));
    domManager.addNodeChild(nav, btnManager.createButton('This month', 'calendar-month.svg', 'project-button'));
    domManager.addNodeChild(nav, nodeProjects);
    domManager.addNodeChild(body, nav);
  }
  #doLoadFooter() {
    const curYear = new Date().getFullYear();
    const footer = document.querySelector('footer')
    domManager.createAddNode('p', footer, null, null, `Copyright © ${curYear} Alessandro Celotti`);
    domManager.addNodeChild(footer, btnManager.createImageLinkButton('https://github.com/cel8', 'github.svg'));
    domManager.addNodeChild(body, footer);
  }
  #doLoadOverlay() {
    const overlay = document.querySelector('#overlay');
    const divOverlay = domManager.createAddNode('div', overlay);
    // Hide overlay
    domManager.toggleDisplayByNode(overlay);
    domManager.toggleDisplayByNode(domManager.createAddNode('form', divOverlay, 'manage-form-task'));
    domManager.toggleDisplayByNode(domManager.createAddNode('div', divOverlay, 'manage-details-task'));
    this.uiTaskController.doCreateTaskDetails();
  }
  doLoadUI() {
    this.#doLoadHeader();
    this.#doLoadOverlay();
    this.#doLoadMainContent();
    this.#doLoadFooter();
  }
}