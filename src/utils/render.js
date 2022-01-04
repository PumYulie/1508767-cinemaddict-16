import AbstractClassView from '../view/abstract-class-view.js';

const getElementPropIfAny = (param) => param instanceof AbstractClassView ? param.element : param;

//отрисовываю DOM-элемент в разметку
const render = (container, element, place) => {
  const parent = getElementPropIfAny(container);
  const child = getElementPropIfAny(element);

  switch(place) {
    case 'beforebegin':
      parent.before(child);
      break;
    case 'afterbegin':
      parent.prepend(child);
      break;
    case 'beforeend':
      parent.append(child);
      break;
    case 'afterend':
      parent.after(child);
      break;
  }
};

const createElement = (html) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = html;
  return newElement.firstChild;
};

const insertElement = (componentToBeChild, componentToBeParent) => {
  if (!componentToBeChild) {
    throw new Error('Tried to insert а child, but it is false');
  }

  const child = getElementPropIfAny(componentToBeChild);
  const parent = getElementPropIfAny(componentToBeParent);
  parent.appendChild(child);
};

const cutOffElement = (componentToRemove) => {
  const child = getElementPropIfAny(componentToRemove);

  child.remove();
  componentToRemove.removeElement();
};

const replaceElement = (elemToRemove, newElem) => {
  if (!elemToRemove || !newElem) {
    throw new Error('failed to replace DOM-element: some of elements don\'t exist');
  }

  const oldElement = getElementPropIfAny(elemToRemove);
  const newElement = getElementPropIfAny(newElem);

  oldElement.replaceWith(newElement);
};

export {render, createElement, cutOffElement, insertElement, replaceElement};
