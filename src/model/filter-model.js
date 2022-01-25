import AbstractObservable from './abstract-observable.js';
import {FilterType} from '../mock/constants.js';

export default class FilterModel extends AbstractObservable {
  #currentFilter = FilterType.ALL;

  get currentFilter() {
    return this.#currentFilter;
  }

  //откуда берется updateType
  setCurrentFilter = (updateType, currentFilter) => {
    this.#currentFilter = currentFilter;

    this._notify(updateType, this.#currentFilter);
  }
}
