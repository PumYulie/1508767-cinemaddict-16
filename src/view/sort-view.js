import AbstractClassView from './abstract-class-view';
import {SortType} from '../mock/constants.js';

const renderSortItems = (selectedSort) => {

  const activateSortClass = (value) => value === selectedSort ? 'sort__button--active' : '';

  return `<ul class="sort">
    <li><a href="#" class="sort__button ${activateSortClass(SortType.DEFAULT)}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${activateSortClass(SortType.BY_DATE)}" data-sort-type='${SortType.BY_DATE}'>Sort by date</a></li>
    <li><a href="#" class="sort__button ${activateSortClass(SortType.BY_RATING)}" data-sort-type='${SortType.BY_RATING}'>Sort by rating</a></li>
  </ul>`;
};

export default class SortItemsView extends AbstractClassView {
  #selectedSort = null;

  constructor(selectedSort) {
    super();
    this.#selectedSort = selectedSort;
  }

  get template() {
    return renderSortItems(this.#selectedSort);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {return;}
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
