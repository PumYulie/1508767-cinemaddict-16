import AbstractClassView from './abstract-class-view';

const renderFilterHTML = (filterObject, currentFilterType) => {
  const {name, count, type} = filterObject;

  return `<a href="#${name}" class="main-navigation__item ${currentFilterType === type ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">${name}<span class="main-navigation__item-count">${count}</span></a>`;
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
    this._callback.filtersTypeChange(evt.target.dataset.filterType);
  };
}
