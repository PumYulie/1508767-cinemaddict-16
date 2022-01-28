import AbstractClassView from './abstract-class-view';

const renderFilmsListItem = (filmObj) => {
  const {id, name, poster, rating, releaseYear, runTime, genre, shortDescription, commentsNumber, inWatchList, alreadyWatched, inFavorites} = filmObj;

  const activateBtnClass = (value) => value ? 'film-card__controls-item--active' : '';


  return `<article class="film-card" data-id=${id}>
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
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${activateBtnClass(inWatchList)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${activateBtnClass(alreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${activateBtnClass(inFavorites)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmListItemView extends AbstractClassView {
  #filmObj = null;

  constructor(filmObj) {
    super();
    this.#filmObj = filmObj;
  }

  get template() {
    return renderFilmsListItem(this.#filmObj);
  }

  setOnPosterClickHandler = (сallback) => {
    this._callback.onPosterClickHandler = сallback;
    this.element.querySelector('.film-card__link')
      .addEventListener('click', this.#onPosterClickHandler);
  };

  #onPosterClickHandler = () => {
    this._callback.onPosterClickHandler();
  };


  setToWatchlistClickHandler = (callback) => {
    this._callback.toWatchlistClickHandler = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#toWatchlistClickHandler);
  };

  #toWatchlistClickHandler = () => {
    this._callback.toWatchlistClickHandler();
  };


  setToHistoryClickHandler = (callback) => {
    this._callback.toHistoryClickHandler = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#toHistoryClickHandler);
  };

  #toHistoryClickHandler = () => {
    this._callback.toHistoryClickHandler();
  }


  setToFavoritesClickHandler = (callback) => {
    this._callback.toFavoritesClickHandler = callback;
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#toFavoritesClickHandler);
  };

  #toFavoritesClickHandler = () => {
    this._callback.toFavoritesClickHandler();
  };
}
