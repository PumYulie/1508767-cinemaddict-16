import {createElement} from '../render.js';

const renderFilmsListItem = (filmObj) => {
  const {name, poster, rating, releaseYear, runTime, genre, shortDescription, commentsNumber} = filmObj;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${runTime}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <span class="film-card__comments">${commentsNumber} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmListItemView {
  #element = null;
  #filmObj = null;

  constructor(filmObj) {
    this.#filmObj = filmObj;
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return renderFilmsListItem(this.#filmObj);
  }

  removeElement() {
    this.#element = null;
  }

}