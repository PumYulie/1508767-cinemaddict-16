import AbstractView from './abstract-view.js';

const createFilmTop = () => (
  '<div class="films-list__container"></div>'
);

export default class FilmTop extends AbstractView {
  get template(){
    return createFilmTop();
  }
}
