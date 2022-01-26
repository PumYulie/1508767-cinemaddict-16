import AbstractObservable from './abstract-observable.js';
import {FilterType} from '../mock/constants.js';

export default class FilterModel extends AbstractObservable {
  #currentFilter = FilterType.ALL_FILMS;

  get currentFilter() {
    return this.#currentFilter;
  }

  setCurrentFilter = (updateType, currentFilter) => {
    this.#currentFilter = currentFilter;

    this.notifyObservers(updateType, this.#currentFilter);
  }
}
