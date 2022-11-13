/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utilities/dom-manager.js":
/*!**************************************!*\
  !*** ./src/utilities/dom-manager.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************!*\
  !*** ./src/utilities/button.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createButton": () => (/* binding */ createButton),
/* harmony export */   "createImageButton": () => (/* binding */ createImageButton),
/* harmony export */   "createImageLinkButton": () => (/* binding */ createImageLinkButton),
/* harmony export */   "createTextButton": () => (/* binding */ createTextButton),
/* harmony export */   "editButtonImage": () => (/* binding */ editButtonImage),
/* harmony export */   "editButtonText": () => (/* binding */ editButtonText)
/* harmony export */ });
/* harmony import */ var Utilities_dom_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Utilities/dom-manager.js */ "./src/utilities/dom-manager.js");


function createButton(btnText = '', svgIconFileName = null, className = null, cbEvent = undefined) {
  const btn = Utilities_dom_manager_js__WEBPACK_IMPORTED_MODULE_0__.createNodeClass('button', className ? className : 'navButton');
  // Insert icon when exist
  if(svgIconFileName) {
    Utilities_dom_manager_js__WEBPACK_IMPORTED_MODULE_0__.createAddNodeImg(svgIconFileName, btnText, btn, 'icon');
  }
  // Add text when contains something
  if(btnText.length > 0) {
    Utilities_dom_manager_js__WEBPACK_IMPORTED_MODULE_0__.createAddNode('p', btn, null, null, btnText);
  }
  // Add button event
  btn.onclick = cbEvent;
  return btn;  
}

function editButtonText(btn, text = '') {
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
      Utilities_dom_manager_js__WEBPACK_IMPORTED_MODULE_0__.createAddNode('p', btn, null, null, btnText);
    }
  }
}

function editButtonImage(btn, svgIconFileName = null) {
  const btnText    = btn.querySelector('p');
  const btnImgNode = btn.querySelector('.icon');
  if(btnImgNode) {
    if(!svgIconFileName) {
      btnImgNode.remove();
    } else {
      Utilities_dom_manager_js__WEBPACK_IMPORTED_MODULE_0__.updateNodeImg(svgIconFileName, btnImgNode);
    }
  } else {
    // Insert icon when exist
    if(svgIconFileName) {
      const altText = btnText ? btnText.textContent : '';
      Utilities_dom_manager_js__WEBPACK_IMPORTED_MODULE_0__.createAddNodeImg(svgIconFileName, altText, btn, 'icon');
    }
  }
}

function createImageButton(svgIconFileName, className = null, cbEvent = undefined) {
  return createButton('', svgIconFileName, className, cbEvent)
}

function createTextButton(btnText, className = null, cbEvent = undefined) {
  return createButton(btnText, null, className, cbEvent)
}

function createImageLinkButton(link, svgIconFileName) {
  const node = Utilities_dom_manager_js__WEBPACK_IMPORTED_MODULE_0__.createNodeLink(link, null, null, null, 
    Utilities_dom_manager_js__WEBPACK_IMPORTED_MODULE_0__.createNodeImg(svgIconFileName, 'imageLink', 'icon-link')
  );
  return node;
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0EsT0FBTztBQUNQLE1BQU0sK0JBQStCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTs7Ozs7O1VDMUhBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05zRDs7QUFFL0M7QUFDUCxjQUFjLHFFQUEwQjtBQUN4QztBQUNBO0FBQ0EsSUFBSSxzRUFBMkI7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsSUFBSSxtRUFBd0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTSxtRUFBd0I7QUFDOUI7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixNQUFNLG1FQUF3QjtBQUM5QjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxNQUFNLHNFQUEyQjtBQUNqQztBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFTztBQUNQLGVBQWUsb0VBQXlCO0FBQ3hDLElBQUksbUVBQXdCO0FBQzVCO0FBQ0E7QUFDQSxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9wX3RvZG9saXN0Ly4vc3JjL3V0aWxpdGllcy9kb20tbWFuYWdlci5qcyIsIndlYnBhY2s6Ly90b3BfdG9kb2xpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9wX3RvZG9saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3BfdG9kb2xpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3BfdG9kb2xpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b3BfdG9kb2xpc3QvLi9zcmMvdXRpbGl0aWVzL2J1dHRvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmNvbnN0IGltYWdlUGF0aCA9ICcuL2ltYWdlcy8nO1xuXG4vL1JldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIERPTSBub2RlXG5leHBvcnQgZnVuY3Rpb24gaXNOb2RlKG8pe1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBOb2RlID09PSBcIm9iamVjdFwiID8gbyBpbnN0YW5jZW9mIE5vZGUgOiBcbiAgICBvICYmIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBvLm5vZGVUeXBlID09PSBcIm51bWJlclwiICYmIHR5cGVvZiBvLm5vZGVOYW1lPT09XCJzdHJpbmdcIlxuICApO1xufVxuXG4vL1JldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIERPTSBlbGVtZW50ICAgIFxuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlbWVudChvKXtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgSFRNTEVsZW1lbnQgPT09IFwib2JqZWN0XCIgPyBvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgOiAvL0RPTTJcbiAgICBvICYmIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIG8gIT09IG51bGwgJiYgby5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygby5ub2RlTmFtZT09PVwic3RyaW5nXCJcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGUodHlwZSwgY2xhc3NOYW1lID0gbnVsbCwgaWQgPSBudWxsLCBjb250ZW50ID0gbnVsbCwgY2hpbGRyZW4gPSBudWxsKSB7XG4gIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICAvLyBBZGQgY2xhc3MgbmFtZSBvciBJRFxuICBpZihjbGFzc05hbWUpIGVsZW0uY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICBpZihpZCkgZWxlbS5pZCA9IGlkO1xuICAvLyBBZGQgdGV4dCBjb250ZW50XG4gIGlmKGNvbnRlbnQpIGVsZW0udGV4dENvbnRlbnQgPSBjb250ZW50O1xuICAvLyBFdmVudHVhbGx5IGFkZCBjaGlsZCBvciBjaGlsZHJlblxuICBhZGROb2RlQ2hpbGQoZWxlbSwgY2hpbGRyZW4pO1xuICByZXR1cm4gZWxlbTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVDb250ZW50KHR5cGUsIGNvbnRlbnQsIGNsYXNzTmFtZSA9IG51bGwsIGlkID0gbnVsbCkge1xuICByZXR1cm4gY3JlYXRlTm9kZSh0eXBlLCBjbGFzc05hbWUsIGlkLCBjb250ZW50LCBudWxsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVDbGFzcyh0eXBlLCBjbGFzc05hbWUsIGlkID0gbnVsbCwgY29udGVudCA9IG51bGwpIHtcbiAgcmV0dXJuIGNyZWF0ZU5vZGUodHlwZSwgY2xhc3NOYW1lLCBpZCwgY29udGVudCwgbnVsbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOb2RlSUQodHlwZSwgaWQsIGNsYXNzTmFtZSA9IG51bGwsIGNvbnRlbnQgPSBudWxsKSB7XG4gIHJldHVybiBjcmVhdGVOb2RlKHR5cGUsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIG51bGwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTm9kZUltZyhpbWdGaWxlTmFtZSwgYWx0LCBjbGFzc05hbWUgPSBudWxsLCBpZCA9IG51bGwpIHtcbiAgY29uc3QgZmlsZUZ1bGxQYXRoID0gaW1hZ2VQYXRoICsgaW1nRmlsZU5hbWU7XG4gIGNvbnN0IG5vZGUgPSBjcmVhdGVOb2RlKCdpbWcnLCBjbGFzc05hbWUsIGlkLCBudWxsLCBudWxsKTtcbiAgbm9kZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGZpbGVGdWxsUGF0aCk7XG4gIG5vZGUuc2V0QXR0cmlidXRlKCdhbHQnLCBhbHQpO1xuICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVJbWdDbGFzcyhpbWdGaWxlTmFtZSwgYWx0LCBjbGFzc05hbWUsIGlkID0gbnVsbCkge1xuICByZXR1cm4gY3JlYXRlTm9kZUltZyhpbWdGaWxlTmFtZSwgYWx0LCBjbGFzc05hbWUsIGlkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVJbWdJRChpbWdGaWxlTmFtZSwgYWx0LCBpZCwgY2xhc3NOYW1lID0gbnVsbCkge1xuICByZXR1cm4gY3JlYXRlTm9kZUltZyhpbWdGaWxlTmFtZSwgYWx0LCBjbGFzc05hbWUsIGlkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVMaW5rKGxpbmssIGNsYXNzTmFtZSA9IG51bGwsIGlkID0gbnVsbCwgY29udGVudCA9IG51bGwsIGNoaWxkcmVuID0gbnVsbCkge1xuICBjb25zdCBub2RlID0gY3JlYXRlTm9kZSgnYScsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIGNoaWxkcmVuKTtcbiAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBsaW5rKTtcbiAgbm9kZS5zZXRBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKTtcbiAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGROb2RlQ2hpbGQoZmF0aGVyLCBjaGlsZHJlbikge1xuICBpZihjaGlsZHJlbikge1xuICAgIGlmKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7IC8vIENvbnRhaW5zIG1vcmUgdGhhbiBvbmUgY2hpbGQgaW4gQXJyYXlcbiAgICAgIGNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICBmYXRoZXIuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmKGlzRWxlbWVudChjaGlsZHJlbikpIHsgLy8gQ29udGFpbnMganVzdCBvbmUgY2hpbGRcbiAgICAgIGZhdGhlci5hcHBlbmRDaGlsZChjaGlsZHJlbik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBZGROb2RlKHR5cGUsIGZhdGhlciwgY2xhc3NOYW1lID0gbnVsbCwgaWQgPSBudWxsLCBjb250ZW50ID0gbnVsbCwgY2hpbGRyZW4gPSBudWxsKSB7XG4gIC8vIEFwcGVuZCB0aGUgbmV3IG5vZGUgaW4gZmF0aGVyXG4gIGNvbnN0IG5vZGUgPSBjcmVhdGVOb2RlKHR5cGUsIGNsYXNzTmFtZSwgaWQsIGNvbnRlbnQsIGNoaWxkcmVuKTtcbiAgZmF0aGVyLmFwcGVuZENoaWxkKG5vZGUpO1xuICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFkZE5vZGVJbWcoaW1nRmlsZU5hbWUsIGFsdCwgZmF0aGVyLCBjbGFzc05hbWUgPSBudWxsLCBpZCA9IG51bGwsIGNvbnRlbnQgPSBudWxsLCBjaGlsZHJlbiA9IG51bGwpIHtcbiAgLy8gQXBwZW5kIHRoZSBuZXcgbm9kZSBpbiBmYXRoZXJcbiAgY29uc3Qgbm9kZSA9IGNyZWF0ZU5vZGVJbWcoaW1nRmlsZU5hbWUsIGFsdCwgY2xhc3NOYW1lLCBpZCwgY29udGVudCwgY2hpbGRyZW4pO1xuICBmYXRoZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIHJldHVybiBub2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTm9kZUltZ0J5U2VsZWN0b3IoaW1nRmlsZU5hbWUsIGZhdGhlciwgc2VsZWN0b3IpIHtcbiAgY29uc3QgaW1nTm9kZSA9IGZhdGhlci5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgaWYoaW1nTm9kZSkgaW1nTm9kZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGltYWdlUGF0aCArIGltZ0ZpbGVOYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU5vZGVJbWcoaW1nRmlsZU5hbWUsIGltZ05vZGUpIHtcbiAgaWYoaW1nTm9kZSkgaW1nTm9kZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGltYWdlUGF0aCArIGltZ0ZpbGVOYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFsbENoaWxkTm9kZXMocGFyZW50KSB7XG4gIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuZmlyc3RDaGlsZCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZURpc3BsYXlCeU5vZGUobm9kZSwgbmV4dERpc3BsYXkgPSB1bmRlZmluZWQpIHtcbiAgaWYobm9kZSkge1xuICAgIGlmKG5vZGUuZGF0YXNldC5wcmV2RGlzcGxheSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBub2RlLmRhdGFzZXQucHJldkRpc3BsYXkgPSBuZXh0RGlzcGxheSA/IG5leHREaXNwbGF5IDogbm9kZS5zdHlsZS5kaXNwbGF5O1xuICAgIH1cbiAgICBjb25zdCBwcmV2RGlzcGxheSA9IG5vZGUuc3R5bGUuZGlzcGxheTtcbiAgICBub2RlLnN0eWxlLmRpc3BsYXkgPSAoJ25vbmUnICE9PSBub2RlLnN0eWxlLmRpc3BsYXkpID8gJ25vbmUnIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBub2RlLmRhdGFzZXQucHJldkRpc3BsYXk7XG4gICAgbm9kZS5kYXRhc2V0LnByZXZEaXNwbGF5ID0gcHJldkRpc3BsYXk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZURpc3BsYXkobm9kZU5hbWUsIG5leHREaXNwbGF5ID0gdW5kZWZpbmVkKSB7XG4gIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG5vZGVOYW1lKTtcbiAgdG9nZ2xlRGlzcGxheUJ5Tm9kZShub2RlLCBuZXh0RGlzcGxheSk7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgKiBhcyBkb21NYW5hZ2VyIGZyb20gJ1V0aWxpdGllcy9kb20tbWFuYWdlci5qcydcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbihidG5UZXh0ID0gJycsIHN2Z0ljb25GaWxlTmFtZSA9IG51bGwsIGNsYXNzTmFtZSA9IG51bGwsIGNiRXZlbnQgPSB1bmRlZmluZWQpIHtcbiAgY29uc3QgYnRuID0gZG9tTWFuYWdlci5jcmVhdGVOb2RlQ2xhc3MoJ2J1dHRvbicsIGNsYXNzTmFtZSA/IGNsYXNzTmFtZSA6ICduYXZCdXR0b24nKTtcbiAgLy8gSW5zZXJ0IGljb24gd2hlbiBleGlzdFxuICBpZihzdmdJY29uRmlsZU5hbWUpIHtcbiAgICBkb21NYW5hZ2VyLmNyZWF0ZUFkZE5vZGVJbWcoc3ZnSWNvbkZpbGVOYW1lLCBidG5UZXh0LCBidG4sICdpY29uJyk7XG4gIH1cbiAgLy8gQWRkIHRleHQgd2hlbiBjb250YWlucyBzb21ldGhpbmdcbiAgaWYoYnRuVGV4dC5sZW5ndGggPiAwKSB7XG4gICAgZG9tTWFuYWdlci5jcmVhdGVBZGROb2RlKCdwJywgYnRuLCBudWxsLCBudWxsLCBidG5UZXh0KTtcbiAgfVxuICAvLyBBZGQgYnV0dG9uIGV2ZW50XG4gIGJ0bi5vbmNsaWNrID0gY2JFdmVudDtcbiAgcmV0dXJuIGJ0bjsgIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZWRpdEJ1dHRvblRleHQoYnRuLCB0ZXh0ID0gJycpIHtcbiAgY29uc3QgYnRuVGV4dCA9IGJ0bi5xdWVyeVNlbGVjdG9yKCdwJyk7XG4gIGlmKGJ0blRleHQpIHtcbiAgICAvKiBSZW1vdmUgb3IgZWRpdCB0ZXh0ICovXG4gICAgaWYodGV4dCA9PT0gJycpIHtcbiAgICAgIGJ0blRleHQucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ0blRleHQudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvKiBDcmVhdGUgbm9kZSAqL1xuICAgIGlmKGJ0blRleHQubGVuZ3RoID4gMCkge1xuICAgICAgZG9tTWFuYWdlci5jcmVhdGVBZGROb2RlKCdwJywgYnRuLCBudWxsLCBudWxsLCBidG5UZXh0KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVkaXRCdXR0b25JbWFnZShidG4sIHN2Z0ljb25GaWxlTmFtZSA9IG51bGwpIHtcbiAgY29uc3QgYnRuVGV4dCAgICA9IGJ0bi5xdWVyeVNlbGVjdG9yKCdwJyk7XG4gIGNvbnN0IGJ0bkltZ05vZGUgPSBidG4ucXVlcnlTZWxlY3RvcignLmljb24nKTtcbiAgaWYoYnRuSW1nTm9kZSkge1xuICAgIGlmKCFzdmdJY29uRmlsZU5hbWUpIHtcbiAgICAgIGJ0bkltZ05vZGUucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvbU1hbmFnZXIudXBkYXRlTm9kZUltZyhzdmdJY29uRmlsZU5hbWUsIGJ0bkltZ05vZGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJbnNlcnQgaWNvbiB3aGVuIGV4aXN0XG4gICAgaWYoc3ZnSWNvbkZpbGVOYW1lKSB7XG4gICAgICBjb25zdCBhbHRUZXh0ID0gYnRuVGV4dCA/IGJ0blRleHQudGV4dENvbnRlbnQgOiAnJztcbiAgICAgIGRvbU1hbmFnZXIuY3JlYXRlQWRkTm9kZUltZyhzdmdJY29uRmlsZU5hbWUsIGFsdFRleHQsIGJ0biwgJ2ljb24nKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltYWdlQnV0dG9uKHN2Z0ljb25GaWxlTmFtZSwgY2xhc3NOYW1lID0gbnVsbCwgY2JFdmVudCA9IHVuZGVmaW5lZCkge1xuICByZXR1cm4gY3JlYXRlQnV0dG9uKCcnLCBzdmdJY29uRmlsZU5hbWUsIGNsYXNzTmFtZSwgY2JFdmVudClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRleHRCdXR0b24oYnRuVGV4dCwgY2xhc3NOYW1lID0gbnVsbCwgY2JFdmVudCA9IHVuZGVmaW5lZCkge1xuICByZXR1cm4gY3JlYXRlQnV0dG9uKGJ0blRleHQsIG51bGwsIGNsYXNzTmFtZSwgY2JFdmVudClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltYWdlTGlua0J1dHRvbihsaW5rLCBzdmdJY29uRmlsZU5hbWUpIHtcbiAgY29uc3Qgbm9kZSA9IGRvbU1hbmFnZXIuY3JlYXRlTm9kZUxpbmsobGluaywgbnVsbCwgbnVsbCwgbnVsbCwgXG4gICAgZG9tTWFuYWdlci5jcmVhdGVOb2RlSW1nKHN2Z0ljb25GaWxlTmFtZSwgJ2ltYWdlTGluaycsICdpY29uLWxpbmsnKVxuICApO1xuICByZXR1cm4gbm9kZTtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=