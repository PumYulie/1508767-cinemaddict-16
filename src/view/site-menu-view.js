import {createElement} from '../render.js';
import FilterView from './filter-of-menu-view.js';


const renderSiteMenu = (filtersObjects) => {
  const renderAllFiltersHTML = filtersObjects
    .map((filter) => new FilterView(filter).template)
    .join('');

  return `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${renderAllFiltersHTML}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
};


export default class SiteMenuView {
  #element = null;
  #filtersObjects = null;

  constructor(filtersObjects) {
    this.#filtersObjects = filtersObjects;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return renderSiteMenu(this.#filtersObjects);
  }

  removeElement() {
    this.#element = null;
  }
}
