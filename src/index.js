import _ from 'lodash';
import { UiController } from 'Controller/ui-controller.js';

const uiController = new UiController();

window.onload = () => {  
  uiController.doLoadUI();
}