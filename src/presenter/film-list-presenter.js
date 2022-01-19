import {render, cutOffElement, insertElement, replaceElement} from '../utils/render.js';
import {updateItem} from '../utils/utils.js';
import {SortType} from '../mock/constants.js';
import {sortByDateFirstNewest, sortByRatingFirstHighest} from '../utils/film-functions.js';
import SortItemsView from '../view/sort-view.js';
import FilmListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';

import FilmListItemView from '../view/films-list-item-view.js';
import PopupView from '../view/popup-view.js';

const FILMS_PER_STEP = 5;

export default class FilmListPresenter {
  #filmObjects = [];
  #renderedFilmCards = FILMS_PER_STEP;
  #filmIdInstance = new Map();
  #currentSortType = SortType.DEFAULT;
  #initialFilmObjects = [];

  #filmBoardContainer = null;
  #filmComponent = null;
  #filmPopupComponent = null;

  #filmsListComponent = new FilmListView();
  #filmsListContainer = this.#filmsListComponent.element.querySelector('.films-list__container');
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmsComponent = new NoFilmsView();
  #sortItemsComponent = new SortItemsView();


  constructor(filmBoardContainer) {
    this.#filmBoardContainer = filmBoardContainer;
  }

  init = (filmObjects) => {
    this.#filmObjects = [...filmObjects];
    this.#initialFilmObjects = [...filmObjects];//сохранила массив объектов ДО сортировки

    if (this.#filmObjects.length === 0) {
      this.#renderNoFilm();
    } else {
      this.#renderSort();
      this.#renderFilmListContainer();

      this.#renderFilmList();
    }
  }

  //#renderFilm = (filmListContainer, filmObj) => { //удалить filmListContainer
  //const filmPresenter = new FilmPresenter(filmListContainer);
  //filmPresenter.init(filmObj);

  #renderFilm = (filmObj) => {
    //для задачи самообновиться. сначала фиксирую старое, если было. и затем обновляю свойствa актуальным контентом
    const prevFilmComponent = this.#filmComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmListItemView(filmObj);
    this.#filmIdInstance.set(filmObj.id, this.#filmComponent);

    this.#filmComponent.setOnPosterClickHandler(() => this.#handleFilmPosterClick(filmObj));
    this.#filmComponent.setToWatchlistClickHandler(() => this.#handleToWatchlistClick(filmObj));
    this.#filmComponent.setToHistoryClickHandler(() => this.#handleToHistoryClick(filmObj));
    this.#filmComponent.setToFavoritesClickHandler(() => this.#handleToFavoritesClick(filmObj));

    console.log('filmObj', filmObj);
    //перерисовка самого себя: если старого не было, то рендерю с нуля
    if (prevFilmComponent === null || !prevFilmComponent.element.querySelector('#filmObj.id') || prevFilmPopupComponent === null) {
    //раньше это условие было if (prevFilmComponent === null || prevFilmPopupComponent === null) {}
      render(this.#filmsListContainer, this.#filmComponent, 'beforeend');
      return;
    }
    //если старое было в DOM(проверяю), то сначала меняю старое на новое
    if (this.#filmsListContainer.contains(prevFilmComponent.element)) {
      replaceElement(prevFilmComponent, this.#filmComponent);
    }
    //но в целом старое убираю
    cutOffElement(prevFilmComponent);
    cutOffElement(prevFilmPopupComponent);

  }

  /*   #deleteFilm = () => {
    cutOffElement(this.#filmComponent);
    cutOffElement(this.#filmPopupComponent);
  } */

  #renderFilmsAboveButton = (from, to) => {
    this.#filmObjects
      .slice(from, to)
      .forEach((item) => this.#renderFilm(item));
  }

  #renderFilmList = () => {
    this.#renderFilmsAboveButton(0, Math.min(this.#filmObjects.length, FILMS_PER_STEP));

    if (this.#filmObjects.length > FILMS_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #clearFilmList = () => {
    this.#filmIdInstance.forEach((mapValue) => mapValue.element.remove());
    this.#filmIdInstance.clear();
    this.#renderedFilmCards = FILMS_PER_STEP;
    cutOffElement(this.#showMoreButtonComponent);
  };

  #renderFilmListContainer = () => { //ul для постеров
    render(this.#filmBoardContainer, this.#filmsListComponent, 'beforeend');
  }

  #renderSort = () => {
    render(this.#filmBoardContainer, this.#sortItemsComponent, 'beforeend');
    this.#sortItemsComponent.setSortTypeChangeHandler(this.#handleSortTypeChanging);
  }

  #renderNoFilm = () => {
    render(this.#filmBoardContainer, this.#noFilmsComponent, 'beforeend');
  }

  #renderShowMoreButton = () => {
    render(this.#filmBoardContainer, this.#showMoreButtonComponent, 'beforeend');
    this.#showMoreButtonComponent.setOnClickhandler(this.#onShowMoreButtonClick);
  }

  #onShowMoreButtonClick = () => {
    this.#renderFilmsAboveButton(this.#renderedFilmCards, this.#renderedFilmCards + FILMS_PER_STEP);
    this.#renderedFilmCards += FILMS_PER_STEP;

    if (this.#renderedFilmCards >= this.#filmObjects.length) {
      cutOffElement(this.#showMoreButtonComponent);
    }
  }

  #handleFilmPosterClick = (filmObject) => {

    if (this.#filmPopupComponent) {
      //console.log('закрываю попап');//ПОЧЕМУ БЕЗ IF ДАЕТ ОШИБКУ??, хотя консль срабатывает в 100% случаев, т.е.this.#filmPopupComponent всегда существует
      cutOffElement(this.#filmPopupComponent);
    }

    this.#filmPopupComponent = new PopupView(filmObject);
    insertElement(this.#filmPopupComponent, this.#filmsListComponent);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscPopupKeyDown);
    this.#filmPopupComponent.setOnCloseBtnClick(this.#onCloseFilmPopupClick);

    //нужен ли аргумент в this.#onCommentSubmitKeyDown ??
    this.#filmPopupComponent.setCommentSubmitKeyDown(this.#onCommentSubmitKeyDown);

    this.#filmPopupComponent.setToWatchlistClickHandler(() => this.#handleToWatchlistClick(filmObject, true));
    this.#filmPopupComponent.setToHistoryClickHandler(() => this.#handleToHistoryClick(filmObject, true));
    this.#filmPopupComponent.setToFavoritesClickHandler(() => this.#handleToFavoritesClick(filmObject, true));

    this.#filmComponent.element.querySelector('.film-card__link')
    //как проверить, снимается ли этот обработчик без аргумента??та же ли функция??
      .removeEventListener('click', this.#handleFilmPosterClick);
  };

  #onCloseFilmPopupClick = () => {
    document.body.classList.remove('hide-overflow');
    cutOffElement(this.#filmPopupComponent);
    document.removeEventListener('click', this.#onEscPopupKeyDown);
  };

  #onEscPopupKeyDown = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      document.body.classList.remove('hide-overflow');
      cutOffElement(this.#filmPopupComponent);
      document.removeEventListener('click', this.#onEscPopupKeyDown);
    }
  };

  //ДОДЕЛАТЬ
  #onCommentSubmitKeyDown = (filmObj) => {
    //получила объект с новым состоянием. теперь надо перерисовать попап
    this.#handleFilmChange(filmObj, true);

    console.log(filmObj);

      //console.log('#onCommentSubmitKeyDown works');// no
      //this.#filmPopupComponent.element.querySelector('.film-details__comment-input').value = то что юзер напечатал в поле;
      //ОТПРАВЛЯЮ новый объект фильма по новому состоянию, чтобы менять модель??

  };

  //актуализирую массив объектов фильмов и рендерю тот фильм(+попап если был), что изменился
  #handleFilmChange = (updatedFilm, isPopup) => {
    this.#filmObjects = updateItem(this.#filmObjects, updatedFilm);
    this.#initialFilmObjects = updateItem(this.#initialFilmObjects, updatedFilm);
    this.#renderFilm(updatedFilm);
    if (isPopup) { this.#handleFilmPosterClick(updatedFilm); }
  };

  #handleToWatchlistClick = (filmObject, isPopup) => {
    const updatedObject = {...filmObject, inWatchList: !filmObject.inWatchList};
    this.#handleFilmChange(updatedObject, isPopup);
  };

  #handleToHistoryClick = (filmObject, isPopup) => {
    const updatedObject = {...filmObject, alreadyWatched: !filmObject.alreadyWatched};
    this.#handleFilmChange(updatedObject, isPopup);
  };

  #handleToFavoritesClick = (filmObject, isPopup) => {
    const updatedObject = {...filmObject, inFavorites: !filmObject.inFavorites};
    this.#handleFilmChange(updatedObject, isPopup);
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.BY_DATE:
        this.#filmObjects.sort(sortByDateFirstNewest);// метод массивов sort
        break;
      case SortType.BY_RATING:
        this.#filmObjects.sort(sortByRatingFirstHighest);
        break;
      default:
        this.#filmObjects = [...this.#initialFilmObjects];
    }
    this.#currentSortType = sortType;
  };

  //sortType берется из sort-view.js в #sortTypeChangeHandler из evt в this._callback.sortTypeChange(evt.target.dataset.sortType)
  #handleSortTypeChanging = (sortType) => {
    if (sortType === this.#currentSortType) {return;}
    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderFilmList();
  };
}
