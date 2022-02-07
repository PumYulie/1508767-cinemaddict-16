import SmartView from './smart-view.js';

const renderPopup = (filmObj) => {

  const {name, poster, rating, runTime, originalName, director, writers, actors, releaseDate, country, genres, fullDescription, ageFilter, inWatchList, alreadyWatched, inFavorites} = filmObj;

  const generateGenres = () => {
    const genresContainer = document.createElement('div');
    for (const genre of genres) {
      const span = document.createElement('span');
      span.classList.add('film-details__genre');
      span.innerHTML = genre;
      genresContainer.appendChild(span);
    }
    return genresContainer.innerHTML;
  };

  const activateBtnClass = (value) => value ? 'film-details__control-button--active' : '';

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageFilter}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name}</h3>
              <p class="film-details__title-original">Original: ${originalName}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runTime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${generateGenres()}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${fullDescription}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${activateBtnClass(inWatchList)}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${activateBtnClass(alreadyWatched)}
        film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${activateBtnClass(inFavorites)}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

  </form>
</section>`;
};


export default class PopupView extends SmartView {
  #filmObject = null;

  constructor(filmObj) {
    super();
    this.#filmObject = filmObj;
    this.popupYScroll = null;
  }

  get template() {
    return renderPopup(this.#filmObject);
  }

  restoreHandlers = () => {
    this.setOnCloseBtnClick(this._callback.onCloseBtnClick);
    this.setToWatchlistClickHandler(this._callback.toWatchlistClickHandler);
    this.setToHistoryClickHandler(this._callback.toHistoryClickHandler);
    this.setToFavoritesClickHandler(this._callback.toFavoritesClickHandler);
  };


  setOnCloseBtnClick = (callback) => {
    this._callback.onCloseBtnClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onCloseBtnClick);
  }

  #onCloseBtnClick = () => {
    this._callback.onCloseBtnClick();
  }


  setToWatchlistClickHandler = (callback) => {
    this._callback.toWatchlistClickHandler = callback;
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#toWatchlistClickHandler);
  }

  #toWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.popupYScroll = this.element.scrollTop;
    this._callback.toWatchlistClickHandler(PopupView.parseStateToFilmObject(this._state), true, this.popupYScroll);
  }


  setToHistoryClickHandler = (callback) => {
    this._callback.toHistoryClickHandler = callback;
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#toHistoryClickHandler);
  }

  #toHistoryClickHandler = () => {
    this.popupYScroll = this.element.scrollTop;
    this._callback.toHistoryClickHandler(PopupView.parseStateToFilmObject(this._state), true, this.popupYScroll);
  }


  setToFavoritesClickHandler = (callback) => {
    this._callback.toFavoritesClickHandler = callback;
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#toFavoritesClickHandler);
  };

  #toFavoritesClickHandler = () => {
    this.popupYScroll = this.element.scrollTop;
    this._callback.toFavoritesClickHandler(PopupView.parseStateToFilmObject(this._state), true, this.popupYScroll);
  };
}
