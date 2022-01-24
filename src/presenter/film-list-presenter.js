import {render, cutOffElement, insertElement, replaceElement} from '../utils/render.js';
import {SortType, UserAction, UpdateType} from '../mock/constants.js';
import {sortByDateFirstNewest, sortByRatingFirstHighest} from '../utils/film-functions.js';
import SortItemsView from '../view/sort-view.js';
import FilmListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';

import FilmListItemView from '../view/films-list-item-view.js';
import PopupView from '../view/popup-view.js';

const FILMS_PER_STEP = 5;


export default class FilmListPresenter {
  #filmsModel = null;

  #renderedFilmCards = FILMS_PER_STEP;
  #filmIdInstance = new Map();
  #currentSortType = SortType.DEFAULT;

  #filmBoardContainer = null;
  #filmComponent = null;
  #filmPopupComponent = null;

  #filmsListComponent = new FilmListView();
  #filmsListContainer = this.#filmsListComponent.element.querySelector('.films-list__container');
  #showMoreButtonComponent = null;
  #noFilmsComponent = new NoFilmsView();
  #sortItemsComponent = null;


  constructor(filmBoardContainer, filmsModel) {
    this.#filmsModel = filmsModel;
    this.#filmBoardContainer = filmBoardContainer;

    this.#filmsModel.addObserver(this.#handleModelEventComplete);
  }

  //с 's' на конце films  - новое filmsObjects
  get filmsObjects () {
    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return [...this.#filmsModel.filmsObjects].sort(sortByDateFirstNewest);
      case SortType.BY_RATING:
        return [...this.#filmsModel.filmsObjects].sort(sortByRatingFirstHighest);
    }
    //а если switch не отработал, возвращаю массив в исходном порядке, для сортировки по дефолту
    return this.#filmsModel.filmsObjects;
  }

  init = () => {
    this.#renderBoard();
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
  }

  #renderFilmsAboveButton = (filmsObjToRender) => {
    filmsObjToRender.forEach((filmObject) => this.#renderFilm(filmObject));
  };

  #renderFilmListContainer = () => { //ul для мини-постеров
    render(this.#filmBoardContainer, this.#filmsListComponent, 'beforeend');
  };

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


  // К О Л Б Э К   В   М О Д Е Л Ь
  // его ВЫЗЫВАЕТ МОДЕЛЬ(НАБЛЮДАТЕЛЬ), когда раздуплилась с задачей
  // передадим его модели. жук updateType
  #handleModelEventComplete = (updateType, updatedObject) => {
    switch (updateType) {
      case UpdateType.PATCH:
        //this.#renderFilm(updatedObject) //или просто так???????
        this.#renderFilm(this.#filmIdInstance.get(updatedObject.id));
        //тут вызвать рендерпопап??
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
    }
  };

  //передадим его вьюхам
  //говорил что в filmObjectToUpdate только ЧАСТЬ объекта, который обновился
  #handleViewUserActions = (updateType, actionType, filmObjectToUpdate, isPopup, popupYScroll) => {

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, filmObjectToUpdate);
        //надо это сюда???? или это надо в другом месте вообще
        //if (isPopup) {this.#renderPopup(filmObjectToUpdate, popupYScroll);}
        break;

      //нужен ли отдельный метод в модели на сортировку фильмов?
      //получаем порядок фильмов от модели ведь. или нам нафиг не надо ее дергатб по этому поводу
      //case UserAction.UPDATE_FILM_LIST:
        //this.

    }

  };

  // Р Е Р Е Н Д Е Р  - вместо #handleFilmChange теперь #handleViewUserActions
  //ререндерю постер и/или попап. Передавать колбэком во view
  /*   #handleFilmChange = (updatedFilm, isPopup, popupYScroll) => {
    this.#renderFilm(updatedFilm);
    if (isPopup) {
      this.#renderPopup(updatedFilm, popupYScroll);
    }
  }; */


  #onCommentSubmitKeyDown = (filmObj, popupYScroll) => {//аргументом объект с новым состоянием
    //теперь перерисовываю мелкий постер и попап
    this.#handleViewUserActions(UpdateType.PATCH, UserAction.UPDATE_FILM, filmObj, true, popupYScroll);//true тк только на попапе могу сабмитить комент
  };

  #renderSort = () => {
    this.#sortItemsComponent = new SortItemsView(this.#currentSortType);
    this.#sortItemsComponent.setSortTypeChangeHandler(this.#handleSortTypeChanging);
    render(this.#filmBoardContainer, this.#sortItemsComponent, 'beforeend');
  };

  //sortType берется из sort-view.js в #sortTypeChangeHandler из evt в this._callback.sortTypeChange(evt.target.dataset.sortType)
  #handleSortTypeChanging = (sortType) => {
    if (sortType === this.#currentSortType) {return;}

    //почему не работает this.#sortItemsComponent.removeElement();
    //засунуть 4 строки ниже в метод #renderSort по аналогии с рендерфильм
    //const prevSortComponent = this.#sortItemsComponent;
    //this.#sortItemsComponent = new SortItemsView(sortType);
    //replaceElement(prevSortComponent, this.#sortItemsComponent);
    //this.#sortItemsComponent.setSortTypeChangeHandler(this.#handleSortTypeChanging);


    this.#currentSortType = sortType;
    //this.#clearFilmList();
    //this.#renderFilmList();
    this.#clearBoard({resetRenderedFilmCards: true});
    this.#renderBoard();

    //cutOffElement(prevSortComponent);
  };

  #clearBoard = ({resetRenderedFilmCards = false, resetSortType = false} = {}) => {
    const filmsAmount = this.filmsObjects.length;
    this.#filmIdInstance.forEach((mapValue) => cutOffElement(mapValue));
    this.#filmIdInstance.clear();

    cutOffElement(this.#showMoreButtonComponent);
    cutOffElement(this.#noFilmsComponent);
    cutOffElement(this.#sortItemsComponent);

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
    const films = this.filmsObjects;
    const filmsAmount = films.length;

    if (this.filmsObjects.length === 0) {
      this.#renderNoFilm();
      return;
    }

    this.#renderSort();
    this.#renderFilmListContainer();//ul для мини-постеров

    this.#renderFilmsAboveButton(films.slice(0, Math.min(filmsAmount, this.#renderedFilmCards)));

    if (filmsAmount > this.#renderedFilmCards) {
      this.#renderShowMoreButton();
    }
  }

  //проверь доп условие в их #renderBoard в board-presenter
  #renderNoFilm = () => {
    render(this.#filmBoardContainer, this.#noFilmsComponent, 'beforeend');
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
    this.#handleViewUserActions(UpdateType.MAJOR, UserAction.UPDATE_FILM, updatedObject, isPopup, popupYScroll);
  };

  #handleToHistoryClick = (filmObject, isPopup, popupYScroll) => {
    const updatedObject = {...filmObject, alreadyWatched: !filmObject.alreadyWatched};
    this.#handleViewUserActions(UpdateType.MAJOR, UserAction.UPDATE_FILM, updatedObject, isPopup, popupYScroll);
  };

  #handleToFavoritesClick = (filmObject, isPopup, popupYScroll) => {
    const updatedObject = {...filmObject, inFavorites: !filmObject.inFavorites};
    this.#handleViewUserActions(UpdateType.MAJOR, UserAction.UPDATE_FILM, updatedObject, isPopup, popupYScroll);
  };


  /*   #deleteFilm = (filmObject) => { //у них называется destroy в film-presenter
    cutOffElement(this.#filmIdInstance.get(filmObj.id));
    cutOffElement(this.#filmPopupComponent);//надо ли удалять?как привязать поап к фильмлистайтему?
  } */
}
