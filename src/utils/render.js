import AbstractClassView from '../view/abstract-class-view.js';

//отрисовываю DOM-элемент в разметку
const render = (container, element, place) => {
  //если делала от абстрактного класса, то лежит какая-то хрень, а DOM-элемент из нее можно получить по свойству .element как раз
  const parent = container instanceof AbstractClassView ? container.element : container;
  const child = element instanceof AbstractClassView ? element.element : element;

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

//превращаю разметку в элемент и возвращаю ЭЛЕМЕНТ!
//вспомогательная для render, тк ей нужен DOM-элемент!!!
const createElement = (html) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = html;
  return newElement.firstChild;
};

const insertElement = (componentToBeChild) => {
//filmListContainer.appendChild(filmPopupComponent.element);
  if (!componentToBeChild) {
    throw new Error('Tried to insert а child, but it is false');
  }

  const child = componentToBeChild instanceof AbstractClassView
    ? componentToBeChild.element
    : componentToBeChild;

  const parent = child.parentElement;
  if (!parent) {
    throw new Error('Tried to insert а child, but its parent is false');
  }

  parent.appendChild(child);

};

const cutOffElement = (componentToRemove) => {
  //filmListContainer.removeChild(filmPopupComponent.element); образец
  const child = componentToRemove instanceof AbstractClassView
    ? componentToRemove.element
    : componentToRemove;

  const parent = child.parentElement;

  if (!parent) {
    throw new Error('Tried cuting off DOM а child, but there is no parent element');
  }

  parent.removeChild(child);
  componentToRemove.removeElement();

};

export {render, createElement, cutOffElement, insertElement};
