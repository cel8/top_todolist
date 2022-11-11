import * as domManager from 'Utilities/dom-manager.js';
import * as btnManager from 'Utilities/button.js';
import { format } from 'date-fns'

export function createEditText(editTextID, placeHolderText, labelText = null, required = true) {
  const label = labelText ? domManager.createNodeContent('label', labelText) : null;
  const input = domManager.createNodeID('input', editTextID);
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', placeHolderText);
  input.required = required;
  /* Set label when node exists */
  if(label) {
    if(required) {
      domManager.createAddNode('span', label, 'required', null, '*');
    }
    label.htmlFor = editTextID;
    input.setAttribute('name', editTextID);
  }
  return { label: label, input: input };
}

export function createDate(dateID, labelText = null, startFromToday = true, required = true) {
  const label = labelText ? domManager.createNodeContent('label', labelText) : null;
  const input = domManager.createNodeID('input', dateID);
  input.setAttribute('type', 'date');
  input.required = required;
  /* Set minimum date */
  if(startFromToday) {
    input.setAttribute('min', format(new Date(), 'yyyy-MM-dd'));
  }
  /* Set label when node exists */
  if(label) {
    label.htmlFor = dateID;
    input.setAttribute('name', dateID);
  }
  return { label: label, input: input };
}

export function createCheckBox(checkBoxID, labelText = null, cbEvent = undefined, isChecked = false, required = false) {
  const label = labelText ? domManager.createNodeContent('label', labelText) : null;
  const input = domManager.createNodeID('input', checkBoxID);
  input.setAttribute('type', 'checkbox');
  input.required = required;
  input.checked = isChecked;
  /* Set label when node exists */
  if(label) {
    label.htmlFor = checkBoxID;
    input.setAttribute('name', checkBoxID);
  }
  /* Add cb event */
  if(cbEvent) {
    input.onclick = cbEvent;
  }
  return { label: label, input: input };
}

export function createButton(btnID, btnText = '', svgIconFileName = null, className = null, 
                             cbEvent = undefined, formItem = null, labelText = null, required = false) {
  const label = labelText ? domManager.createNodeContent('label', labelText) : null;
  const input = btnManager.createButton(btnText, svgIconFileName, className, (!formItem ? cbEvent : undefined));
  input.setAttribute('type', (!formItem ? 'button' : 'submit'));
  input.required = required;
  /* Set onsubmit for submit button */
  if((formItem) && (cbEvent)) {
    formItem.onsubmit = cbEvent;
  }
  /* Set label when node exists */
  if(label) {
    label.htmlFor = btnID;
    input.setAttribute('name', btnID);
  }
  return { label: label, input: input };
}

export function createImageButton(btnID, svgIconFileName, className = null, cbEvent = undefined, 
                                  formItem = null, labelText = null, required = false) {
  return createButton(btnID, '', svgIconFileName, className, cbEvent, formItem, labelText, required);
}

export function createTextButton(btnID, btnText, className = null, cbEvent = undefined, 
                                 formItem = null, labelText = null, required = false) {
  return createButton(btnID, btnText, null, className, cbEvent, formItem, labelText, required);
}

export function createSwitchButton(switchID, isRoundSwitch = false, labelText = null, 
                                   cbEvent = undefined, isChecked = false, required = false) {
  const labelSwitch = domManager.createNode('label', 'switch');
  const checkBox = createCheckBox(switchID, labelText, cbEvent, isChecked, required);
  domManager.addNodeChild(labelSwitch, checkBox.input);      
  domManager.createAddNode('span', labelSwitch, (isRoundSwitch ? 'slider round' : 'slider'));
  return { label: checkBox.label, input: labelSwitch, checkbox: checkBox.input };
}

export function createRadio(radioID, value, labelText = null, cbEvent = undefined, isChecked = false, required = false) {
  const label = labelText ? domManager.createNodeContent('label', labelText) : null;
  const input = domManager.createNodeID('input', radioID);
  input.setAttribute('type', 'radio');
  input.setAttribute('value', value);
  input.required = required;
  input.checked = isChecked;
  /* Set label when node exists */
  if(label) {
    label.htmlFor = radioID;
    input.setAttribute('name', radioID);
  }
  /* Add cb event */
  if(cbEvent) {
    input.onclick = cbEvent;
  }
  return { label: label, input: input };
}

export function createRadioButton(radioID, value, labelText = null, cbEvent = undefined, isChecked = false, required = false) {
  const label = labelText ? domManager.createNodeContent('label', labelText) : null;
  const radioBtn = domManager.createNode('div', 'radio-btn');
  const radio = createRadio(radioID, value, value, cbEvent, isChecked, required);
  domManager.addNodeChild(radioBtn, radio.input);  
  domManager.addNodeChild(radioBtn, radio.label);  
  /* Set label when node exists */
  if(label) {
    label.htmlFor = radioID;
  }
  return { label: label, input: radioBtn, radio: radio.input };
}

export function createSelect(selectID, values, selectedValue = null, labelText = null, required = false) {
  const label = labelText ? domManager.createNodeContent('label', labelText) : null;
  const input = domManager.createNodeID('select', selectID);
  input.setAttribute('type', 'radio');
  values.forEach(v => {
    const option = domManager.createNodeContent('option', v);
    option.setAttribute('value', v);
    if(selectedValue && v === selectedValue) {
      option.setAttribute('selected', true);
    }
    domManager.addNodeChild(input, option);
  })
  input.required = required;
  input.disabled = !(values.length > 1);
  /* Set label when node exists */
  if(label) {
    label.htmlFor = selectID;
    input.setAttribute('name', selectID);
  }
  return { label: label, input: input };
}