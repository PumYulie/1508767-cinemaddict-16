import AbstractView from './abstract-view.js';
import {FilterType} from '../consts.js';

const NoFilmTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite tasks now',
};

const createFilmListContainerTemplate = (filterType) => {
  const noFilmTextValue = NoFilmTextType[filterType];

  return `<section class="films-list">
    <h2 class="films-list__title ">${noFilmTextValue}</h2>
  </section>`;
};

export default class NoFilm extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFilmListContainerTemplate(this.#films);
  }

  get container() {
    return this.element.querySelector('.films-list__container');
  }
}
