import AbstractClassView from './abstract-class-view';

const renderFilterHTML = (filterObject, currentFilterType) => {
  const {name, count, type} = filterObject;
  const nameUppercased = name[0].toUpperCase() + name.slice(1);

  return `<a href="#${name}" class="main-navigation__item ${currentFilterType === type ? 'main-navigation__item--active' : ''}">${nameUppercased}<span class="main-navigation__item-count">${count}</span></a>`;
};

const renderAllFiltersHTML = (filtersObjects, currentFilterType) => {
  const allFiltersHTML = filtersObjects.map((filter) => renderFilterHTML(filter, currentFilterType)).join('');

  return `<div class="main-navigation__items">
      ${allFiltersHTML}
    </div>`;
};


export default class FilterView extends AbstractClassView {
  #filterObject = null;
  #currentFilter = null;

  constructor(filterObject, currentFilterType) {
    super();
    this.#filterObject = filterObject;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return renderAllFiltersHTML(this.#filterObject, this.#currentFilter);
  }

  setFiltersTypeChangeHandler = (callback) => {
    this._callback.filtersTypeChange = callback;
    this.element.addEventListener('click', this.#onFiltersTypeChange);
  };

  //ДОДЕЛАТЬ передачу типа фильтра из evt.target
  #onFiltersTypeChange = (evt) => {
    if (evt.target.tagName !== 'A') { return; }

    evt.preventDefault();
    //console.log(evt.target);
    this._callback.filtersTypeChange();
  };
}
