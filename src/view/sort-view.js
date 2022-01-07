import AbstractClassView from './abstract-class-view';
import {SortType} from '../mock/constants.js';

const renderSortItems = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type='${SortType.BY_DATE}'>Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type='${SortType.BY_RATING}'>Sort by rating</a></li>
  </ul>`
);

export default class SortItemsView extends AbstractClassView {
  get template() {
    return renderSortItems();
  }

  //скажи что, и я это повешу обработчиком и вызову с аргументом evt.target.dataset.sortType
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
