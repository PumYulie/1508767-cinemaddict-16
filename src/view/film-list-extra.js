import AbstractView from './abstract-view.js';

export const createFilmListExtra = (heading) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${heading}</h2>
  </section>`
);

export default class FilmListExtra extends AbstractView {
  #heading = null;

  constructor(heading) {
    super();
    this.#heading = heading;
  }

  get template(){
    return createFilmListExtra(this.#heading);
  }
}
