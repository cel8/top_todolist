
const imagePath = './images/';

//Returns true if it is a DOM node
export function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}

//Returns true if it is a DOM element    
export function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
  );
}

export function createNode(type, className = null, id = null, content = null, children = null) {
  const elem = document.createElement(type);
  // Add class name or ID
  if(className) elem.className = className;
  if(id) elem.id = id;
  // Add text content
  if(content) elem.textContent = content;
  // Eventually add child or children
  addNodeChild(elem, children);
  return elem;
}

export function createNodeContent(type, content, className = null, id = null) {
  return createNode(type, className, id, content, null);
}

export function createNodeClass(type, className, id = null, content = null) {
  return createNode(type, className, id, content, null);
}

export function createNodeID(type, id, className = null, content = null) {
  return createNode(type, className, id, content, null);
}

export function createNodeImg(imgFileName, alt, className = null, id = null) {
  const fileFullPath = imagePath + imgFileName;
  const node = createNode('img', className, id, null, null);
  node.setAttribute('src', fileFullPath);
  node.setAttribute('alt', alt);
  return node;
}

export function createNodeImgClass(imgFileName, alt, className, id = null) {
  return createNodeImg(imgFileName, alt, className, id);
}

export function createNodeImgID(imgFileName, alt, id, className = null) {
  return createNodeImg(imgFileName, alt, className, id);
}

export function createNodeLink(link, className = null, id = null, content = null, children = null) {
  const node = createNode('a', className, id, content, children);
  node.setAttribute('href', link);
  node.setAttribute('target', '_blank');
  return node;
}

export function addNodeChild(father, children) {
  if(children) {
    if(Array.isArray(children)) { // Contains more than one child in Array
      children.forEach(child => {
        father.appendChild(child);
      });
    } else if(isElement(children)) { // Contains just one child
      father.appendChild(children);
    }
  }
}

export function createAddNode(type, father, className = null, id = null, content = null, children = null) {
  // Append the new node in father
  const node = createNode(type, className, id, content, children);
  father.appendChild(node);
  return node;
}

export function createAddNodeImg(imgFileName, alt, father, className = null, id = null, content = null, children = null) {
  // Append the new node in father
  const node = createNodeImg(imgFileName, alt, className, id, content, children);
  father.appendChild(node);
  return node;
}

export function updateNodeImg(imgFileName, father, selector) {
  const imgNode = father.querySelector(selector);
  if(imgNode) imgNode.setAttribute('src', imagePath + imgFileName);
}

export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function toggleDisplayByNode(node, nextDisplay = undefined) {
  if(node) {
    if(node.dataset.prevDisplay === undefined) {
      node.dataset.prevDisplay = nextDisplay ? nextDisplay : node.style.display;
    }
    const prevDisplay = node.style.display;
    node.style.display = ('none' !== node.style.display) ? 'none' 
                                                         : node.dataset.prevDisplay;
    node.dataset.prevDisplay = prevDisplay;
  }
}

export function toggleDisplay(nodeName, nextDisplay = undefined) {
  const node = document.querySelector(nodeName);
  toggleDisplayByNode(node, nextDisplay);
}