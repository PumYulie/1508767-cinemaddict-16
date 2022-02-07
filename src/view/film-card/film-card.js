import {createFilmCardTemplate} from './film-card-tpl.js';
import {createElement} from '../../utils/render.js';
import AbstractView from '../abstract-view.js';

export default class FilmCard extends AbstractView {
  #film = null;
  #renderedFilms = [];
  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get renderedFilms() {
    return this.#renderedFilms;
  }

  createCopy() {
    const copy = createElement(this.template);
    copy.querySelector('.film-card__link').addEventListener('click', this.#filmClickHandler);
    copy.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
    copy.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#historyClickHandler);
    copy.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.#renderedFilms.push(copy);
    return copy;
  }

  setFilmClickHandler = (callback) => {
    this._callback.filmClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#filmClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setHistoryClickHandler = (callback) => {
    this._callback.historyClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#historyClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #filmClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filmClick();
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

    #historyClickHandler = (evt) => {
      evt.preventDefault();
      this._callback.historyClick();
    }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
