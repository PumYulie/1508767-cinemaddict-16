import {render, cutOffElement, insertElement, replaceElement} from '../utils/render.js';
import {updateItem} from '../utils/utils.js';
import SortItemsView from '../view/sort-view.js';
import FilmListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
//import {FILM_CARDS_COUNT} from '../main.js';
//import FilmPresenter from './film-presenter.js';

import FilmListItemView from '../view/films-list-item-view.js';
import PopupView from '../view/popup-view.js';

const FILMS_PER_STEP = 5;

export default class FilmListPresenter {
  #filmObjects = [];
  #renderedFilmCards = FILMS_PER_STEP;
  #filmIdInstance = new Map();

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

    //навешиваю слушатели, чтобы по кнопкам мелкого фильма кликать
    this.#filmComponent.setOnPosterClickHandler(() => this.#handleFilmPosterClick(filmObj));
    this.#filmComponent.setToWatchlistClickHandler(() => this.#handleToWatchlistClick(filmObj));
    this.#filmComponent.setToHistoryClickHandler(() => this.#handleToHistoryClick(filmObj));
    this.#filmComponent.setToFavoritesClickHandler(() => this.#handleToFavoritesClick(filmObj));


    //перерисовка самого себя:
    //если старого не было, то рендерю с нуля
    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
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

  #deleteFilm = () => {
    cutOffElement(this.#filmComponent);
    cutOffElement(this.#filmPopupComponent);
  }

  #renderFilmsAboveButton = (from, to) => {
    this.#filmObjects
      .slice(from, to)
      .forEach((item) => this.#renderFilm(item)); //удалила первый аргумент this.#filmsListComponent
  }

  #renderFilmList = () => { //вместо функции renderFilmBoard
    this.#renderFilmsAboveButton(0, Math.min(this.#filmObjects.length, FILMS_PER_STEP));

    if (this.#filmObjects.length > FILMS_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #clearFilmList = () => { // в value у мар лежат тела отдельных компонентов фильмов, а в ключах айди этих фильмов
    this.#filmIdInstance.forEach((mapValue) => mapValue.this.#deleteFilm());
    this.#filmIdInstance.clear();//убрав сами компоненты, очищаю мар от их следов
    this.#renderedFilmCards = FILMS_PER_STEP;
    cutOffElement(this.#showMoreButtonComponent);
  };

  #renderFilmListContainer = () => { //рисую ul для карточек фильмов
    render(this.#filmBoardContainer, this.#filmsListComponent, 'beforeend');
  }

  #renderSort = () => {
    render(this.#filmBoardContainer, this.#sortItemsComponent, 'beforeend');
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

  //запускать этот метод, если ивент таргет равен 1 из 3 кнопок у ПОПАПА
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

    //пробую вставить evt сюда, но что с ним дальше делать не знаю
    //setToWatchlistClickHandler и подобные = методы у popup-view.js
    this.#filmPopupComponent.setToWatchlistClickHandler((evt) => this.#handleToWatchlistClick(filmObject));
    this.#filmPopupComponent.setToHistoryClickHandler((evt) => this.#handleToHistoryClick(filmObject));
    this.#filmPopupComponent.setToFavoritesClickHandler((evt) => this.#handleToFavoritesClick(filmObject));

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

  //божечки надеюсь оно так вообще работает...
  //выдаю актуальный после изменений массив объектов фильмов и рендерб тот фильм, что изменился
  #handleFilmChange = (updatedFilm) => {
    this.#filmObjects = updateItem(this.#filmObjects, updatedFilm);
    this.#renderFilm(updatedFilm);
  };

  //обрабатываю изменения в мелкой карточке фильма когда приходят новые данные по фильму
  #handleToWatchlistClick = (filmObject) => {
    this.#handleFilmChange({...filmObject, inWatchList: !filmObject.inWatchList});
  };

  #handleToHistoryClick = (filmObject) => {
    this.#handleFilmChange({...filmObject, alreadyWatched: !filmObject.alreadyWatched});
  };

  #handleToFavoritesClick = (filmObject) => {
    this.#handleFilmChange({...filmObject, inFavorites: !filmObject.inFavorites});
  };
}
