import {createSiteMenuTemplate} from './site-menu-tpl.js';
import AbstractView from '../abstract-view.js';

export default class SiteMenu extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #filterElements = null;
  #statsElement = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#filterElements = this.element.querySelectorAll('.main-navigation__item');
    this.#statsElement = this.element.querySelector('.main-navigation__additional');
  }

  get template() {
    return createSiteMenuTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }
}
