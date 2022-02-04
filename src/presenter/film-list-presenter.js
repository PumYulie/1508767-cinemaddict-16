import {render, cutOffElement, insertElement, replaceElement} from '../utils/render.js';
import {SortType, UserAction, UpdateType, FilterType} from '../mock/constants.js';
import {sortByDateFirstNewest, sortByRatingFirstHighest} from '../utils/film-functions.js';
import {filtersObjWithFilteringFuncs} from '../utils/filtersObjWithFilteringFuncs.js';
import SortItemsView from '../view/sort-view.js';
import FilmListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadingView from '../view/loading-view.js';
import FilmListItemView from '../view/films-list-item-view.js';
import PopupView from '../view/popup-view.js';

const FILMS_PER_STEP = 5;


export default class FilmListPresenter {
  #filmsModel = null;
  #filterModel = null;

  #renderedFilmCards = FILMS_PER_STEP;
  #filmIdInstance = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL_FILMS;
  #isLoading = true;
  #popupId = null;

  #filmBoardContainer = null;
  #filmComponent = null;
  #filmPopupComponent = null;

  #filmsListComponent = new FilmListView();
  #loadingComponent = new LoadingView();
  #showMoreButtonComponent = null;
  #noFilmsComponent = null;
  #sortItemsComponent = null;


  constructor(filmBoardContainer, filmsModel, filterModel) {
    this.#filmBoardContainer = filmBoardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEventComplete);
    this.#filterModel.addObserver(this.#handleModelEventComplete);
  }

  get filmsObjects () {
    this.#currentFilterType = this.#filterModel.currentFilter;
    const filmsObjects = this.#filmsModel.filmsObjects;
    const filteredFilmsArray = filtersObjWithFilteringFuncs[this.#currentFilterType](filmsObjects);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredFilmsArray.sort(sortByDateFirstNewest);
      case SortType.BY_RATING:
        return filteredFilmsArray.sort(sortByRatingFirstHighest);
    }
    //если switch не отработал, возвращаю массив в исходном порядке
    return filteredFilmsArray;
  }

  init = () => {
    this.#renderBoard();
  }

  #renderFilm = (filmObj) => {
    const prevFilmComponent = this.#filmIdInstance.get(filmObj.id);

    this.#filmComponent = new FilmListItemView(filmObj);
    this.#filmIdInstance.set(filmObj.id, this.#filmComponent);
    this.#setEListenersOnFilmComponent(filmObj);

    //пошла ПЕРЕРИСОВКА самого себя:

    //если старого не было, то рендерю с нуля
    if (!prevFilmComponent) {
      render(this.#filmsListComponent, this.#filmComponent, 'beforeend');
      return;
    }
    //если старое было в DOM(проверяю), то сначала меняю старое на новое
    if (this.#filmsListComponent.contains(prevFilmComponent.element)) {
      replaceElement(prevFilmComponent, this.#filmComponent);
    }
    //но в целом старое убираю
    cutOffElement(prevFilmComponent);

  }

  #setEListenersOnFilmComponent = (filmObject) => {
    this.#filmComponent.setOnPosterClickHandler(() => this.#renderPopup(filmObject));
    this.#filmComponent.setToWatchlistClickHandler(() => this.#handleToWatchlistClick(filmObject));
    this.#filmComponent.setToHistoryClickHandler(() => this.#handleToHistoryClick(filmObject));
    this.#filmComponent.setToFavoritesClickHandler(() => this.#handleToFavoritesClick(filmObject));
  }

  #renderPopup = (filmObject, scrollYPosition) => {
    //|| this.#filmPopupComponent.element.dataset.id !== this.#popupId
    if (this.#filmPopupComponent) {
      cutOffElement(this.#filmPopupComponent);
      this.#popupId = null;
    }

    this.#filmPopupComponent = new PopupView(filmObject);
    this.#popupId = this.#filmComponent.element.dataset.id;

    insertElement(this.#filmPopupComponent, this.#filmsListComponent, scrollYPosition);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscPopupKeyDown);
    this.#setEListenersOnPopupComponent(filmObject, true, scrollYPosition);

    this.#filmComponent.element.querySelector('.film-card__link')
    //как проверить, снимается ли этот обработчик без аргумента??та же ли функция??
      .removeEventListener('click', this.#renderPopup);
  };

  #setEListenersOnPopupComponent = () => {
    this.#filmPopupComponent.setFormSubmitKeyDown(this.#onCommentSubmitKeyDown);
    this.#filmPopupComponent.setOnCloseBtnClick(this.#onCloseFilmPopupClick);
    this.#filmPopupComponent.setDeleteCommentClickHandler(this.#onDeleteCommentClick);

    this.#filmPopupComponent.setToWatchlistClickHandler(this.#handleToWatchlistClick);
    this.#filmPopupComponent.setToHistoryClickHandler(this.#handleToHistoryClick);
    this.#filmPopupComponent.setToFavoritesClickHandler(this.#handleToFavoritesClick);
  };


  // К О Л Б Э К   В   М О Д Е Л Ь  (в addObserver)
  #handleModelEventComplete = (updateType, updatedObject) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#renderFilm(updatedObject);
        break;
      case UpdateType.MINOR:
        //список постеров и ссылки сортировки при сортировке
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        //все перерисовать, связано с фильтрацией
        this.#clearBoard({resetRenderedFilmCards: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        cutOffElement(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleViewUserActions = (updateType, actionType, filmObjectToUpdate, isPopup, popupYScroll) => {

    switch (actionType) {
      case UserAction.ADD_FILM_TO:
        this.#filmsModel.updateFilm(updateType, filmObjectToUpdate);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.updateFilm(updateType, filmObjectToUpdate);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.updateFilm(updateType, filmObjectToUpdate);
        break;
      //нужен ли отдельный тип действия и метод в модели на сортировку фильмов?
    }

    if (isPopup && this.#popupId === this.#filmComponent.element.dataset.id) {
      this.#renderPopup(filmObjectToUpdate, popupYScroll);
    }
  };


  #onCommentSubmitKeyDown = (filmObj, popupYScroll) => {//аргументом объект с новым состоянием
    //теперь перерисовываю мелкий постер и попап
    this.#handleViewUserActions(
      UpdateType.PATCH,
      UserAction.ADD_COMMENT,
      filmObj,
      true, popupYScroll
    );
  };

  #onDeleteCommentClick = (filmObj, popupYScroll) => {
    this.#handleViewUserActions(
      UpdateType.PATCH,
      UserAction.DELETE_COMMENT,
      filmObj,
      true, popupYScroll
    );
  }

  #renderSort = () => {
    this.#sortItemsComponent = new SortItemsView(this.#currentSortType);
    this.#sortItemsComponent.setSortTypeChangeHandler(this.#handleSortTypeChanging);
    render(this.#filmBoardContainer, this.#sortItemsComponent, 'beforeend');
  };

  #handleSortTypeChanging = (sortType) => {
    if (sortType === this.#currentSortType) {return;}
    this.#currentSortType = sortType;

    this.#clearBoard({resetRenderedFilmCards: true});
    this.#renderBoard();
  };

  #clearBoard = ({resetRenderedFilmCards = false, resetSortType = false} = {}) => {
    const filmsAmount = this.filmsObjects.length;
    this.#filmIdInstance.forEach((mapValue) => cutOffElement(mapValue));
    this.#filmIdInstance.clear();

    cutOffElement(this.#sortItemsComponent);
    cutOffElement(this.#filmsListComponent);

    if (this.#showMoreButtonComponent) {
      cutOffElement(this.#showMoreButtonComponent);
    }

    if (this.#noFilmsComponent) {
      cutOffElement(this.#noFilmsComponent);
    }

    if(this.#loadingComponent) {
      cutOffElement(this.#loadingComponent);
    }

    if (resetRenderedFilmCards) {
      this.#renderedFilmCards = FILMS_PER_STEP;
    } else { //если перерисовка доски вызвана уменьшением числа фильмов(архив или удаление из списка), корректирую число отрисованных задач
      this.#renderedFilmCards = Math.min(filmsAmount, this.#renderedFilmCards);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.filmsObjects;
    const filmsAmount = films.length;

    if (this.filmsObjects.length === 0) {
      this.#renderNoFilm();
      return;
    }

    this.#renderSort();
    this.#renderFilmListComponent();
    this.#renderFilmsAboveButton(films.slice(0, Math.min(filmsAmount, this.#renderedFilmCards)));

    if (filmsAmount > this.#renderedFilmCards) {
      this.#renderShowMoreButton();
    }
  };

  #renderLoading = () => {
    render(this.#filmBoardContainer, this.#loadingComponent, 'beforeend');
  };

  #renderNoFilm = () => {
    this.#noFilmsComponent = new NoFilmsView(this.#currentFilterType);
    render(this.#filmBoardContainer, this.#noFilmsComponent, 'beforeend');
  };

  #renderFilmsAboveButton = (filmsObjToRender) => {
    filmsObjToRender.forEach((filmObject) => this.#renderFilm(filmObject));
  };

  #renderFilmListComponent = () => { //ul для фильмов
    render(this.#filmBoardContainer, this.#filmsListComponent, 'beforeend');
  };


  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setOnClickhandler(this.#onShowMoreButtonClick);
    render(this.#filmBoardContainer, this.#showMoreButtonComponent, 'beforeend');
  };

  #onShowMoreButtonClick = () => {
    const filmsAmount = this.filmsObjects.length;
    const newRenderedFilmCards = Math.min(this.#renderedFilmCards + FILMS_PER_STEP, filmsAmount);
    const filmsToRender = this.filmsObjects.slice(this.#renderedFilmCards, newRenderedFilmCards);

    this.#renderFilmsAboveButton(filmsToRender);
    this.#renderedFilmCards = newRenderedFilmCards;

    if (this.#renderedFilmCards >= filmsAmount) {
      cutOffElement(this.#showMoreButtonComponent);
    }
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


  //3 обработчика на мелкий постер и ПОПАП
  #handleToWatchlistClick = (filmObject, isPopup, popupYScroll) => {
    const updatedObject = {...filmObject, inWatchList: !filmObject.inWatchList};

    if (this.#popupId === this.#filmComponent.element.dataset.id) {
      popupYScroll = this.#filmPopupComponent.element.scrollTop;
      isPopup = true;
    }

    this.#handleViewUserActions(
      UpdateType.MAJOR,
      UserAction.ADD_FILM_TO,
      updatedObject,
      isPopup, popupYScroll
    );
  };

  #handleToHistoryClick = (filmObject, isPopup, popupYScroll) => {
    const updatedObject = {...filmObject, alreadyWatched: !filmObject.alreadyWatched};

    if (this.#popupId === this.#filmComponent.element.dataset.id) {
      popupYScroll = this.#filmPopupComponent.element.scrollTop;
      isPopup = true;
    }

    this.#handleViewUserActions(
      UpdateType.MAJOR,
      UserAction.ADD_FILM_TO,
      updatedObject,
      isPopup, popupYScroll
    );
  };

  #handleToFavoritesClick = (filmObject, isPopup, popupYScroll) => {
    const updatedObject = {...filmObject, inFavorites: !filmObject.inFavorites};

    //почему не работает? см ниже метод
    //this.#checkIfPopupIsOpen(popupYScroll, isPopup);

    if (this.#popupId === this.#filmComponent.element.dataset.id) {
      popupYScroll = this.#filmPopupComponent.element.scrollTop;
      isPopup = true;
    }

    this.#handleViewUserActions(
      UpdateType.MAJOR,
      UserAction.ADD_FILM_TO,
      updatedObject,
      isPopup, popupYScroll
    );
  };

  //почему не работает?
  /*   #checkIfPopupIsOpen = (popupYScroll, isPopup) => {
    if (this.#popupId === this.#filmComponent.element.dataset.id) {
      popupYScroll = this.#filmPopupComponent.element.scrollTop;
      isPopup = true;
    }
  }; */

}
