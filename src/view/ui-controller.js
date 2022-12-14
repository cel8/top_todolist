import 'Style/style.css';
import * as domManager from 'Utilities/dom-manager.js';
import * as btnManager from 'Utilities/button.js';
import 'Assets/images/svg/menu.svg';
import 'Assets/images/svg/home-outline.svg';
import 'Assets/images/svg/github.svg';
import 'Assets/images/todo-list.gif';
import 'Assets/images/svg/calendar-today.svg';
import 'Assets/images/svg/calendar-week.svg';
import 'Assets/images/svg/calendar-month.svg';
import 'Assets/images/svg/dark-theme.svg';
import 'Assets/images/svg/light-theme.svg';
import { setTimeout } from 'timers-promises';
import { UiProjectController } from 'View/ui-project-controller';
import { UiTaskController } from 'View/ui-task-controller.js';
import { taskFetchDate } from 'Controller/task-controller.js';

const root = document.documentElement;
const body = document.querySelector('body');
const main = document.querySelector('main');

export const settings = { theme: 'dark' };

export class UiController {
  constructor() {
    this.uiProjectController = new UiProjectController();
    this.uiTaskController = UiTaskController.getInstance();
  }
  #doLoadHeader() {
    const header  = document.querySelector('header');
    domManager.addNodeChild(header, btnManager.createImageButton('menu.svg', 'header-button', async () => {
      await setTimeout(250);
      const nav = document.querySelector('nav');
      domManager.toggleDisplayByNode(nav);
      body.style.gridTemplateColumns = nav.style.display === 'none' ? '1fr' : '0fr 1fr';
    }));
    domManager.addNodeChild(header, btnManager.createImageButton('home-outline.svg', 'header-button', () => {
      this.uiTaskController.doRemoveProject();
      this.#doCreateHome();
    }));
    domManager.addNodeChild(header, btnManager.createButton('Create task', 'plus-circle-outline.svg', 'header-button', () => {
      this.uiTaskController.doCreateTask();
    }));
    const btnToggleTheme = btnManager.createImageButton(`${settings.theme}-theme.svg`, 'header-button', () => {
      settings.theme = (settings.theme !== 'dark' ? 'dark' : 'light');
      btnManager.editButtonImage(btnToggleTheme, `${settings.theme}-theme.svg`);
      root.className = settings.theme;
    });
    domManager.addNodeChild(header, btnToggleTheme);
  }
  #doCreateHome() {
    // Style the flexbox
    main.style.justifyContent = 'center';
    const divHome = domManager.createAddNode('div', main, 'home');
    domManager.createAddNode('h1', divHome, 'main-text', null, 'ToDo.Tme');
    domManager.createAddNode('h2', divHome, 'main-text', null, 'Edit your daily task with notes or checklist.');
    domManager.createAddNodeImg('todo-list.gif', 'todo-list', divHome, 'big-icon');
  }
  #doLoadMainContent() {
    this.#doCreateNavBar();
    this.#doCreateHome();
  }
  #doCreateNavBar() {
    /* Create navigation bar */
    const nav = document.querySelector('nav');
    // Load project from storage
    this.uiProjectController.doLoadProjects();
    this.uiProjectController.doCreateInbox();
    domManager.addNodeChild(nav, btnManager.createButton('Today', 'calendar-today.svg', 'project-button', () => {
      this.uiTaskController.doLoadTasksByDueDate(taskFetchDate.today);
    }));
    domManager.addNodeChild(nav, btnManager.createButton('This week', 'calendar-week.svg', 'project-button', () => {
      this.uiTaskController.doLoadTasksByDueDate(taskFetchDate.week);
    }));
    domManager.addNodeChild(nav, btnManager.createButton('This month', 'calendar-month.svg', 'project-button', () => {
      this.uiTaskController.doLoadTasksByDueDate(taskFetchDate.month);
    }));
    // Create project bar
    this.uiProjectController.doCreateProjectBar();
  }
  #doLoadFooter() {
    const curYear = new Date().getFullYear();
    const footer = document.querySelector('footer')
    domManager.createAddNode('p', footer, null, null, `Copyright ?? ${curYear} Alessandro Celotti`);
    domManager.addNodeChild(footer, btnManager.createImageLinkButton('https://github.com/cel8', 'github.svg'));
  }
  #doLoadOverlay() {
    const overlay = document.querySelector('#overlay');
    const divOverlay = domManager.createAddNode('div', overlay, 'overlay-popup');
    const formOverlay = domManager.createAddNode('form', divOverlay, 'manage-form-task');
    const displayOverlay = domManager.createAddNode('div', divOverlay, 'manage-details-task');
    // Hide overlay
    domManager.toggleDisplayByNode(overlay);
    domManager.toggleDisplayByNode(formOverlay);
    domManager.toggleDisplayByNode(displayOverlay);
    this.uiTaskController.doCreateTaskDetails();
    document.addEventListener('click', (e) => {
      if(e.target.id === 'overlay') { // Close overlay
        domManager.toggleDisplayByNode(overlay);
        if(formOverlay.style.display !== 'none') domManager.toggleDisplayByNode(formOverlay);
        if(displayOverlay.style.display !== 'none') domManager.toggleDisplayByNode(displayOverlay);
      }
    })
  }
  doLoadUI() {
    // Set main root theme
    root.className = settings.theme;
    this.#doLoadHeader();
    this.#doLoadOverlay();
    this.#doLoadMainContent();
    this.#doLoadFooter();
  }
}