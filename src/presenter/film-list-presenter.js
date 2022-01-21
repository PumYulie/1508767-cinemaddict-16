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
  #sortItemsComponent = new SortItemsView(this.#currentSortType);


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

  #renderFilm = (filmObj) => {
    //для задачи самообновиться. сначала фиксирую старое, если было. и затем обновляю свойствa актуальным контентом
    const prevFilmComponent = this.#filmIdInstance.get(filmObj.id);
    //const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmListItemView(filmObj);
    this.#filmIdInstance.set(filmObj.id, this.#filmComponent);
    this.#setEListenersOnFilmComponent(filmObj);

    //пошла ПЕРЕРИСОВКА самого себя:

    //если старого не было, то рендерю с нуля
    if (!prevFilmComponent) { //|| prevFilmPopupComponent === null
      render(this.#filmsListContainer, this.#filmComponent, 'beforeend');
      return;
    }
    //если старое было в DOM(проверяю), то сначала меняю старое на новое
    if (this.#filmsListContainer.contains(prevFilmComponent.element)) {
      replaceElement(prevFilmComponent, this.#filmComponent);
    }
    //но в целом старое убираю
    cutOffElement(prevFilmComponent);
    //cutOffElement(prevFilmPopupComponent);

  }

  #setEListenersOnFilmComponent = (filmObject) => {
    //вызываю методы #filmComponent-а(view) и передаю в них КОЛБЭКАМИ методы самого презентера
    this.#filmComponent.setOnPosterClickHandler(() => this.#renderPopup(filmObject));
    this.#filmComponent.setToWatchlistClickHandler(() => this.#handleToWatchlistClick(filmObject));
    this.#filmComponent.setToHistoryClickHandler(() => this.#handleToHistoryClick(filmObject));
    this.#filmComponent.setToFavoritesClickHandler(() => this.#handleToFavoritesClick(filmObject));
  };

  #renderFilmsAboveButton = (from, to) => {
    this.#filmObjects
      .slice(from, to)
      .forEach((item) => this.#renderFilm(item));
  }

  #renderFilmListContainer = () => { //ul для мини-постеров
    render(this.#filmBoardContainer, this.#filmsListComponent, 'beforeend');
  }

  #renderFilmList = () => {
    this.#renderFilmsAboveButton(0, Math.min(this.#filmObjects.length, FILMS_PER_STEP));

    if (this.#filmObjects.length > FILMS_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderPopup = (filmObject, scrollYPosition) => {

    if (this.#filmPopupComponent) {
      cutOffElement(this.#filmPopupComponent);
    }

    this.#filmPopupComponent = new PopupView(filmObject);
    insertElement(this.#filmPopupComponent, this.#filmsListComponent, scrollYPosition);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscPopupKeyDown);
    this.#setEListenersOnPopupComponent();

    this.#filmComponent.element.querySelector('.film-card__link')
    //как проверить, снимается ли этот обработчик без аргумента??та же ли функция??
      .removeEventListener('click', this.#renderPopup);
  };

  #setEListenersOnPopupComponent = () => {
    this.#filmPopupComponent.setOnCloseBtnClick(this.#onCloseFilmPopupClick);
    this.#filmPopupComponent.setFormSubmitKeyDown(this.#onCommentSubmitKeyDown);

    this.#filmPopupComponent.setToWatchlistClickHandler(this.#handleToWatchlistClick);
    this.#filmPopupComponent.setToHistoryClickHandler(this.#handleToHistoryClick);
    this.#filmPopupComponent.setToFavoritesClickHandler(this.#handleToFavoritesClick);
  };


  // Р Е Р Е Н Д Е Р
  //ререндерю постер и/или попап. Передавать колбэком во view

  #handleFilmChange = (updatedFilm, isPopup, popupYScroll) => {
    //актуализирую массив объектов фильмов
    this.#filmObjects = updateItem(this.#filmObjects, updatedFilm);
    this.#initialFilmObjects = updateItem(this.#initialFilmObjects, updatedFilm);

    //ререндерю тот фильм(+попап если был), что изменился
    this.#renderFilm(updatedFilm);
    if (isPopup) {
      this.#renderPopup(updatedFilm, popupYScroll);
    }
  };


  #onCommentSubmitKeyDown = (filmObj, popupYScroll) => {//аргументом объект с новым состоянием
    //теперь перерисовываю мелкий постер и попап
    this.#handleFilmChange(filmObj, true, popupYScroll);//true тк только на попапе могу сабмитить комент
  };

  #renderSort = () => {
    render(this.#filmBoardContainer, this.#sortItemsComponent, 'beforeend');
    this.#sortItemsComponent.setSortTypeChangeHandler(this.#handleSortTypeChanging);
  }

  //sortType берется из sort-view.js в #sortTypeChangeHandler из evt в this._callback.sortTypeChange(evt.target.dataset.sortType)
  #handleSortTypeChanging = (sortType) => {
    if (sortType === this.#currentSortType) {return;}

    //почему не работает this.#sortItemsComponent.removeElement();
    const prevSortComponent = this.#sortItemsComponent;
    this.#sortItemsComponent = new SortItemsView(sortType);
    replaceElement(prevSortComponent, this.#sortItemsComponent);
    this.#sortItemsComponent.setSortTypeChangeHandler(this.#handleSortTypeChanging);

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderFilmList();

    cutOffElement(prevSortComponent);
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


  #clearFilmList = () => {
    //mapValue.element.remove(). но почему mapValue.removeElement() не работало?
    this.#filmIdInstance.forEach((mapValue) => cutOffElement(mapValue));
    this.#filmIdInstance.clear();
    this.#renderedFilmCards = FILMS_PER_STEP;
    cutOffElement(this.#showMoreButtonComponent);
  };

  //проверь доп условие в их #renderBoard в board-presenter
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


  //3 обработчика на мелкий постер и ПОПАП
  #handleToWatchlistClick = (filmObject, isPopup, popupYScroll) => {
    const updatedObject = {...filmObject, inWatchList: !filmObject.inWatchList};
    this.#handleFilmChange(updatedObject, isPopup, popupYScroll);
  };

  #handleToHistoryClick = (filmObject, isPopup, popupYScroll) => {
    const updatedObject = {...filmObject, alreadyWatched: !filmObject.alreadyWatched};
    this.#handleFilmChange(updatedObject, isPopup, popupYScroll);
  };

  #handleToFavoritesClick = (filmObject, isPopup, popupYScroll) => {
    const updatedObject = {...filmObject, inFavorites: !filmObject.inFavorites};
    this.#handleFilmChange(updatedObject, isPopup, popupYScroll);
  };


  /*   #deleteFilm = (filmObject) => { //у них называется destroy в film-presenter
    cutOffElement(this.#filmIdInstance.get(filmObj.id));
    cutOffElement(this.#filmPopupComponent);//надо ли удалять?как привязать поап к фильмлистайтему?
  } */
}
