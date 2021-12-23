import {createElement} from '../render.js';

const renderNoTaskHTML = () => (
  `<h2 class="films-list__title">There are no movies in our database</h2>
      <!--
        Значение отображаемого текста зависит от выбранного фильтра:
          * All movies – 'There are no movies in our database'
          * Watchlist — 'There are no movies to watch now';
          * History — 'There are no watched movies now';
          * Favorites — 'There are no favorite movies now'.
      -->`
);


export default class NoFilmsView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return renderNoTaskHTML();
  }

  removeElement() {
    this.#element = null;
  }

}
