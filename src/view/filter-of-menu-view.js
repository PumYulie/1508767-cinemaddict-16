import {createElement} from '../render.js';

const renderFilterHTML = (filterObject) => {
  const {name, count} = filterObject;
  const nameUppercased = name[0].toUpperCase() + name.slice(1);

  return `
    <a href="#${name}" class="main-navigation__item">${nameUppercased} <span class="main-navigation__item-count">${count}</span></a>
  `;

};

export default class FilterView {
  #element = null;
  #filterObject = null;

  constructor(filterObject) {
    this.#filterObject = filterObject;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return renderFilterHTML(this.#filterObject);
  }

  removeElement() {
    this.#element = null;
  }
}
