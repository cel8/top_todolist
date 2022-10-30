import * as domManager from 'Utilities/dom-manager.js'

export function createButton(btnText = '', svgIconFileName = null, className = null, cbEvent = undefined) {
  const btn = domManager.createNodeClass('button', className ? className : 'navButton');
  // Insert icon when exist
  if(svgIconFileName) {
    domManager.createAddNodeImg(svgIconFileName, btnText, btn, 'icon');
  }
  // Add text when contains something
  if(btnText.length > 0) {
    domManager.createAddNode('p', btn, null, null, btnText);
  }
  // Add button event
  btn.onclick = cbEvent;
  return btn;  
}

export function editButtonText(btn, text = '') {
  const btnText = btn.querySelector('p');
  if(btnText) {
    /* Remove or edit text */
    if(text === '') {
      btnText.remove();
    } else {
      btnText.textContent = text;
    }
  } else {
    /* Create node */
    if(btnText.length > 0) {
      domManager.createAddNode('p', btn, null, null, btnText);
    }
  }
}

export function createImageButton(svgIconFileName, className = null, cbEvent = undefined) {
  return createButton('', svgIconFileName, className, cbEvent)
}

export function createTextButton(btnText, className = null, cbEvent = undefined) {
  return createButton(btnText, null, className, cbEvent)
}

export function createImageLinkButton(link, svgIconFileName) {
  const node = domManager.createNodeLink(link, null, null, null, 
    domManager.createNodeImg(svgIconFileName, 'imageLink', 'icon-link')
  );
  return node;
}