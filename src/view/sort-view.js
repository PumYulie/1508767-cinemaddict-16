import AbstractView from './abstract-view.js';
import {SortType} from '../consts.js';

const addActiveClass = (isActive) => isActive ? ' sort__button--active' : '';

const createSortContent = (currentSortType) => (
  `<ul class="sort">
  <li><a href="#" class="sort__button${addActiveClass(SortType.DEFAULT === currentSortType)}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button${addActiveClass(SortType.DATE === currentSortType)}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button${addActiveClass(SortType.RATING === currentSortType)}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();

    this.#currentSortType = currentSortType;
  }

  get template(){
    return createSortContent(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
