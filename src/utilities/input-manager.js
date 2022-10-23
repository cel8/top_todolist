import * as domManager from 'Utilities/dom-manager.js';

export function createEditText(editTextID, labelText, placeHolderText, required = true) {
  const label = domManager.createNodeContent('label', labelText);
  const input = domManager.createNodeID('input', editTextID);
  label.htmlFor = editTextID;
  input.setAttribute('type', 'text');
  input.setAttribute('name', editTextID);
  input.setAttribute('placeholder', placeHolderText);
  input.required = required;
  return { label: label, input: input };
}
