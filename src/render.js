//отрисовываю DOM-элемент в разметку
const render = (container, element, place) => {
  switch(place) {
    case 'beforebegin':
      container.before(element);
      break;
    case 'afterbegin':
      container.prepend(element);
      break;
    case 'beforeend':
      container.append(element);
      break;
    case 'afterend':
      container.after(element);
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

export {render, createElement};
