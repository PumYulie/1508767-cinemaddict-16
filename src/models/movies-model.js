import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../consts.js';

export default class MoviesModel extends AbstractObservable {
  #films = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films;
    } catch(error) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);

      this.#films = [
        ...this.#films.slice(0, index),
        response,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, update);
    }
    catch(error) {
      throw new Error('Can\'t update film');
    }
  }
}
