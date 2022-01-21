import SmartView from './smart-view.js';
import {EMOJIS_NAMES} from '../mock/constants.js';
import {generateComment} from '../mock/generate-comments-objects.js';

const renderPopup = (state) => {

  const {name, poster, rating, runTime, commentsNumber, originalName, director, writers, actors, releaseDate, country, genres, fullDescription, ageFilter, comments, inWatchList, alreadyWatched, inFavorites, selectedEmoji, commentText} = state;

  const generateGenres = (array) => {
    const genresContainer = document.createElement('div');
    for (const genre of array) {
      const span = document.createElement('span');
      span.classList.add('film-details__genre');
      span.innerHTML = genre;
      genresContainer.appendChild(span);
    }
    return genresContainer.innerHTML;
  };

  const generateEmojiRadios = () => (
    `${EMOJIS_NAMES.map((emoji) =>
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
      </label>`)
      .join('')
    }`
  );

  const activateBtnClass = (value) => value ? 'film-details__control-button--active' : '';

  const generateCommentsHTML = (commentObjs) => (
    `<ul class="film-details__comments-list">
      ${commentObjs.length > 0 ?
      commentObjs.map( ({emoji, date, author, message}) =>
        `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji-${emoji.slice(0, -4)}">
          </span>
          <div>
            <p class="film-details__comment-text">${message}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${date}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`).join('')
      : '' }
    </ul>`
  );

  const generateFormHTML = () => (
    `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        ${selectedEmoji ? `<img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">` : ''}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${generateEmojiRadios()}
      </div>
    </div>`

  );


  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

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
                ${generateGenres(genres)}
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

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsNumber}</span></h3>

        ${generateCommentsHTML(comments)}
        ${generateFormHTML()}

      </section>
    </div>
  </form>
</section>`;
};


export default class PopupView extends SmartView {
  #formInitialStateProps = null;

  constructor(filmObj) {
    super();
    this.#formInitialStateProps = {
      selectedEmoji: '',
      commentText: '',
      srollPosition: 0
    };
    //создаю объект начального состояния по данным
    this._state = PopupView.parseFilmObjectToState(filmObj, this.#formInitialStateProps);

    this.popupYScroll = null;

    this.#setInnerELHandlers();
  }

  get template() {
    return renderPopup(this._state);
  }

  //создаю начальное состояние из объекта. обогащаю полями с изначальным состоянием формы
  static parseFilmObjectToState = (filmObject, formStateProps) => ({...filmObject, ...formStateProps})

  //состояние в объект. вызываю, когда жмут кнопки для сабмита коментария
  static parseStateToFilmObject = (state) => {
    const filmObject = {...state};
    delete filmObject.selectedEmoji;
    delete filmObject.commentText;
    return filmObject;
  }

  restoreHandlers = () => {
    this.#setInnerELHandlers();
    this.setFormSubmitKeyDown(this._callback.commentSubmitHandler);//не работает

    this.setOnCloseBtnClick(this._callback.onCloseBtnClick);
    this.setToWatchlistClickHandler(this._callback.toWatchlistClickHandler);
    this.setToHistoryClickHandler(this._callback.toHistoryClickHandler);
    this.setToFavoritesClickHandler(this._callback.toFavoritesClickHandler);
  };

  //как создался попап я на его кнопки накидываю слушатели
  #setInnerELHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('change', this.#radioEmojiChangeHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentTextareaInputHandler);
  };

  #radioEmojiChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {return;}
    this.popupYScroll = this.element.scrollTop;
    this.updateStateAndRender({selectedEmoji: evt.target.value}, this.popupYScroll);
  };

  #commentTextareaInputHandler = (evt) => {
    //evt.preventDefault();//а нужно что-то дефолтное предотвращать?
    this.updateStateNoRender({
      commentText: evt.target.value,
    });
  };

  //задача метода - навесить слушатель с конкретным обработчиком-колбэком из презентера
  setFormSubmitKeyDown = (callback) => {
    this._callback.commentSubmitHandler = callback;
    document.addEventListener('keydown', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    if ( !((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') ) {
      return;
    }
    if (!this._state.selectedEmoji || !this._state.commentText) {
      return;
    }
    this.popupYScroll = this.element.scrollTop;

    const commentFromForm = generateComment(this._state.selectedEmoji, this._state.commentText);

    this.updateStateAndRender({
      ...this.#formInitialStateProps, //сброс редактируемых полей в состоянии
      comment: [...this._state.comments, commentFromForm] //припушиваю коммент
    });
    //вызываю колбэк презентера(c актуальным объектом фильма) => ререндерю постер+попап
    this._callback.commentSubmitHandler(PopupView.parseStateToFilmObject(this._state), this.popupYScroll);

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

  #toWatchlistClickHandler = () => {
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
