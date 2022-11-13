/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/utilities/dom-manager.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addNodeChild": () => (/* binding */ addNodeChild),
/* harmony export */   "createAddNode": () => (/* binding */ createAddNode),
/* harmony export */   "createAddNodeImg": () => (/* binding */ createAddNodeImg),
/* harmony export */   "createNode": () => (/* binding */ createNode),
/* harmony export */   "createNodeClass": () => (/* binding */ createNodeClass),
/* harmony export */   "createNodeContent": () => (/* binding */ createNodeContent),
/* harmony export */   "createNodeID": () => (/* binding */ createNodeID),
/* harmony export */   "createNodeImg": () => (/* binding */ createNodeImg),
/* harmony export */   "createNodeImgClass": () => (/* binding */ createNodeImgClass),
/* harmony export */   "createNodeImgID": () => (/* binding */ createNodeImgID),
/* harmony export */   "createNodeLink": () => (/* binding */ createNodeLink),
/* harmony export */   "isElement": () => (/* binding */ isElement),
/* harmony export */   "isNode": () => (/* binding */ isNode),
/* harmony export */   "removeAllChildNodes": () => (/* binding */ removeAllChildNodes),
/* harmony export */   "toggleDisplay": () => (/* binding */ toggleDisplay),
/* harmony export */   "toggleDisplayByNode": () => (/* binding */ toggleDisplayByNode),
/* harmony export */   "updateNodeImg": () => (/* binding */ updateNodeImg),
/* harmony export */   "updateNodeImgBySelector": () => (/* binding */ updateNodeImgBySelector)
/* harmony export */ });

const imagePath = './images/';

//Returns true if it is a DOM node
function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}

//Returns true if it is a DOM element    
function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
  );
}

function createNode(type, className = null, id = null, content = null, children = null) {
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

function createNodeContent(type, content, className = null, id = null) {
  return createNode(type, className, id, content, null);
}

function createNodeClass(type, className, id = null, content = null) {
  return createNode(type, className, id, content, null);
}

function createNodeID(type, id, className = null, content = null) {
  return createNode(type, className, id, content, null);
}

function createNodeImg(imgFileName, alt, className = null, id = null) {
  const fileFullPath = imagePath + imgFileName;
  const node = createNode('img', className, id, null, null);
  node.setAttribute('src', fileFullPath);
  node.setAttribute('alt', alt);
  return node;
}

function createNodeImgClass(imgFileName, alt, className, id = null) {
  return createNodeImg(imgFileName, alt, className, id);
}

function createNodeImgID(imgFileName, alt, id, className = null) {
  return createNodeImg(imgFileName, alt, className, id);
}

function createNodeLink(link, className = null, id = null, content = null, children = null) {
  const node = createNode('a', className, id, content, children);
  node.setAttribute('href', link);
  node.setAttribute('target', '_blank');
  return node;
}

function addNodeChild(father, children) {
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

function createAddNode(type, father, className = null, id = null, content = null, children = null) {
  // Append the new node in father
  const node = createNode(type, className, id, content, children);
  father.appendChild(node);
  return node;
}

function createAddNodeImg(imgFileName, alt, father, className = null, id = null, content = null, children = null) {
  // Append the new node in father
  const node = createNodeImg(imgFileName, alt, className, id, content, children);
  father.appendChild(node);
  return node;
}

function updateNodeImgBySelector(imgFileName, father, selector) {
  const imgNode = father.querySelector(selector);
  if(imgNode) imgNode.setAttribute('src', imagePath + imgFileName);
}

function updateNodeImg(imgFileName, imgNode) {
  if(imgNode) imgNode.setAttribute('src', imagePath + imgFileName);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function toggleDisplayByNode(node, nextDisplay = undefined) {
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

function toggleDisplay(nodeName, nextDisplay = undefined) {
  const node = document.querySelector(nodeName);
  toggleDisplayByNode(node, nextDisplay);
}
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tTWFuYWdlci5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMQTs7QUFFQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBLE9BQU87QUFDUCxNQUFNLCtCQUErQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0EsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvcF90b2RvbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b3BfdG9kb2xpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvcF90b2RvbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcF90b2RvbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvcF90b2RvbGlzdC8uL3NyYy91dGlsaXRpZXMvZG9tLW1hbmFnZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJcbmNvbnN0IGltYWdlUGF0aCA9ICcuL2ltYWdlcy8nO1xuXG4vL1JldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIERPTSBub2RlXG5leHBvcnQgZnVuY3Rpb24gaXNOb2RlKG8pe1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBOb2RlID09PSBcIm9iamVjdFwiID8gbyBpbnN0YW5jZW9mIE5vZGUgOiBcbiAgICBvICYmIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBvLm5vZGVUeXBlID09PSBcIm51bWJlclwiICYmIHR5cGVvZiBvLm5vZGVOYW1lPT09XCJzdHJpbmdcIlxuICApO1xufVxuXG4vL1JldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIERPTSBlbGVtZW50ICAgIFxuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlbWVudChvKXtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgSFRNTEVsZW1lbnQgPT09IFwib2JqZWN0XCIgPyBvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgOiAvL0RPTTJcbiAgICBvICYmIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIG8gIT09IG51bGwgJiYgby5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygby5ub2RlTmFtZT09PVwic3RyaW5nXCJcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGUodHlwZSwgY2xhc3NOYW1lID0gbnVsbCwgaWQgPSBudWxsLCBjb250ZW50ID0gbnVsbCwgY2hpbGRyZW4gPSBudWxsKSB7XG4gIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICAvLyBBZGQgY2xhc3MgbmFtZSBvciBJRFxuICBpZihjbGFzc05hbWUpIGVsZW0uY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICBpZihpZCkgZWxlbS5pZCA9IGlkO1xuICAvLyBBZGQgdGV4dCBjb250ZW50XG4gIGlmKGNvbnRlbnQpIGVsZW0udGV4dENvbnRlbnQgPSBjb250ZW50O1xuICAvLyBFdmVudHVhbGx5IGFkZCBjaGlsZCBvciBjaGlsZHJlblxuICBhZGROb2RlQ2hpbGQoZWxlbSwgY2hpbGRyZW4pO1xuICByZXR1cm4gZWxlbTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVDb250ZW50KHR5cGUsIGNvbnRlbnQsIGNsYXNzTmFtZSA9IG51bGwsIGlkID0gbnVsbCkge1xuICByZXR1cm4gY3JlYXRlTm9kZSh0eXBlLCBjbGFzc05hbWUsIGlkLCBjb250ZW50LCBudWxsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVDbGFzcyh0eXBlLCBjbGFzc05hbWUsIGlkID0gbnVsbCwgY29udGVudCA9IG51bGwpIHtcbiAgcmV0dXJuIGNyZWF0ZU5vZGUodHlwZSwgY2xhc3NOYW1lLCBpZCwgY29udGVudCwgbnVsbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOb2RlSUQodHlwZSwgaWQsIGNsYXNzTmFtZSA9IG51bGwsIGNvbnRlbnQgPSBudWxsKSB7XG4gIHJldHVybiBjcmVhdGVOb2RlKHR5cGUsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIG51bGwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTm9kZUltZyhpbWdGaWxlTmFtZSwgYWx0LCBjbGFzc05hbWUgPSBudWxsLCBpZCA9IG51bGwpIHtcbiAgY29uc3QgZmlsZUZ1bGxQYXRoID0gaW1hZ2VQYXRoICsgaW1nRmlsZU5hbWU7XG4gIGNvbnN0IG5vZGUgPSBjcmVhdGVOb2RlKCdpbWcnLCBjbGFzc05hbWUsIGlkLCBudWxsLCBudWxsKTtcbiAgbm9kZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGZpbGVGdWxsUGF0aCk7XG4gIG5vZGUuc2V0QXR0cmlidXRlKCdhbHQnLCBhbHQpO1xuICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVJbWdDbGFzcyhpbWdGaWxlTmFtZSwgYWx0LCBjbGFzc05hbWUsIGlkID0gbnVsbCkge1xuICByZXR1cm4gY3JlYXRlTm9kZUltZyhpbWdGaWxlTmFtZSwgYWx0LCBjbGFzc05hbWUsIGlkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVJbWdJRChpbWdGaWxlTmFtZSwgYWx0LCBpZCwgY2xhc3NOYW1lID0gbnVsbCkge1xuICByZXR1cm4gY3JlYXRlTm9kZUltZyhpbWdGaWxlTmFtZSwgYWx0LCBjbGFzc05hbWUsIGlkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVMaW5rKGxpbmssIGNsYXNzTmFtZSA9IG51bGwsIGlkID0gbnVsbCwgY29udGVudCA9IG51bGwsIGNoaWxkcmVuID0gbnVsbCkge1xuICBjb25zdCBub2RlID0gY3JlYXRlTm9kZSgnYScsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIGNoaWxkcmVuKTtcbiAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBsaW5rKTtcbiAgbm9kZS5zZXRBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKTtcbiAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGROb2RlQ2hpbGQoZmF0aGVyLCBjaGlsZHJlbikge1xuICBpZihjaGlsZHJlbikge1xuICAgIGlmKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7IC8vIENvbnRhaW5zIG1vcmUgdGhhbiBvbmUgY2hpbGQgaW4gQXJyYXlcbiAgICAgIGNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICBmYXRoZXIuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmKGlzRWxlbWVudChjaGlsZHJlbikpIHsgLy8gQ29udGFpbnMganVzdCBvbmUgY2hpbGRcbiAgICAgIGZhdGhlci5hcHBlbmRDaGlsZChjaGlsZHJlbik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBZGROb2RlKHR5cGUsIGZhdGhlciwgY2xhc3NOYW1lID0gbnVsbCwgaWQgPSBudWxsLCBjb250ZW50ID0gbnVsbCwgY2hpbGRyZW4gPSBudWxsKSB7XG4gIC8vIEFwcGVuZCB0aGUgbmV3IG5vZGUgaW4gZmF0aGVyXG4gIGNvbnN0IG5vZGUgPSBjcmVhdGVOb2RlKHR5cGUsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIGNoaWxkcmVuKTtcbiAgZmF0aGVyLmFwcGVuZENoaWxkKG5vZGUpO1xuICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFkZE5vZGVJbWcoaW1nRmlsZU5hbWUsIGFsdCwgZmF0aGVyLCBjbGFzc05hbWUgPSBudWxsLCBpZCA9IG51bGwsIGNvbnRlbnQgPSBudWxsLCBjaGlsZHJlbiA9IG51bGwpIHtcbiAgLy8gQXBwZW5kIHRoZSBuZXcgbm9kZSBpbiBmYXRoZXJcbiAgY29uc3Qgbm9kZSA9IGNyZWF0ZU5vZGVJbWcoaW1nRmlsZU5hbWUsIGFsdCwgY2xhc3NOYW1lLCBpZCwgY29udGVudCwgY2hpbGRyZW4pO1xuICBmYXRoZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIHJldHVybiBub2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTm9kZUltZ0J5U2VsZWN0b3IoaW1nRmlsZU5hbWUsIGZhdGhlciwgc2VsZWN0b3IpIHtcbiAgY29uc3QgaW1nTm9kZSA9IGZhdGhlci5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgaWYoaW1nTm9kZSkgaW1nTm9kZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGltYWdlUGF0aCArIGltZ0ZpbGVOYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU5vZGVJbWcoaW1nRmlsZU5hbWUsIGltZ05vZGUpIHtcbiAgaWYoaW1nTm9kZSkgaW1nTm9kZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGltYWdlUGF0aCArIGltZ0ZpbGVOYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFsbENoaWxkTm9kZXMocGFyZW50KSB7XG4gIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuZmlyc3RDaGlsZCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZURpc3BsYXlCeU5vZGUobm9kZSwgbmV4dERpc3BsYXkgPSB1bmRlZmluZWQpIHtcbiAgaWYobm9kZSkge1xuICAgIGlmKG5vZGUuZGF0YXNldC5wcmV2RGlzcGxheSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBub2RlLmRhdGFzZXQucHJldkRpc3BsYXkgPSBuZXh0RGlzcGxheSA/IG5leHREaXNwbGF5IDogbm9kZS5zdHlsZS5kaXNwbGF5O1xuICAgIH1cbiAgICBjb25zdCBwcmV2RGlzcGxheSA9IG5vZGUuc3R5bGUuZGlzcGxheTtcbiAgICBub2RlLnN0eWxlLmRpc3BsYXkgPSAoJ25vbmUnICE9PSBub2RlLnN0eWxlLmRpc3BsYXkpID8gJ25vbmUnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBub2RlLmRhdGFzZXQucHJldkRpc3BsYXk7XG4gICAgbm9kZS5kYXRhc2V0LnByZXZEaXNwbGF5ID0gcHJldkRpc3BsYXk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZURpc3BsYXkobm9kZU5hbWUsIG5leHREaXNwbGF5ID0gdW5kZWZpbmVkKSB7XG4gIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG5vZGVOYW1lKTtcbiAgdG9nZ2xlRGlzcGxheUJ5Tm9kZShub2RlLCBuZXh0RGlzcGxheSk7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9