import AbstractView from './abstract-view.js';

const createFilmListTemplate = () => '<section class="films-list"></section>';

export default class FilmList extends AbstractView {
  get template(){
    return createFilmListTemplate();
  }

}
