import {render, cutOffElement} from '../utils/render.js';
import SortItemsView from '../view/sort-view.js';
import FilmListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmPresenter from './film-presenter.js';

const FILMS_PER_STEP = 3;

export default class FilmListPresenter {
  #filmObjects = [];
  #renderedFilmCards = FILMS_PER_STEP;

  #filmBoardContainer = null;

  #filmsListComponent = new FilmListView();
  #filmsListContainer = this.#filmsListComponent.element.querySelector('.films-list__container');
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmsComponent = new NoFilmsView();
  #sortItemsComponent = new SortItemsView();

  #filmPresenter = new Map();

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


  #renderFilm = (filmListContainer, filmObj) => {
    const filmPresenter = new FilmPresenter(filmListContainer);
    filmPresenter.init(filmObj);
    //докидываю в общий Map(this.#filmPresenter)в формате { id: filmPresenter, id: filmPresenter, ...}
    this.#filmPresenter.set(filmObj.id, filmPresenter);
  }

  //проверить мб this.#filmsListContainer достаточно и без #filmsListComponent
  #renderFilmsAboveButton = (from, to) => {
    this.#filmObjects
      .slice(from, to)
      .forEach((item) => this.#renderFilm(this.#filmsListContainer, item));
  }

  #renderFilmList = () => { //вместо renderFilmBoard. вставляю li-шки фильмов
    this.#renderFilmsAboveButton(0, Math.min(this.#filmObjects.length, FILMS_PER_STEP));

    if (this.#filmObjects.length > FILMS_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((value) => value.deleteFilm());//удаляю из DOM
    this.#filmPresenter.clear(); //чищу мар от начинки
    this.#renderedFilmCards = FILMS_PER_STEP;
    cutOffElement(this.#showMoreButtonComponent);
  };

  #renderFilmListContainer = () => { //рисую ul для карточек фильмов
    render(this.#filmBoardContainer, this.#filmsListComponent, 'beforeend');
  }

  #renderSort = () => {
    render(this.#filmBoardContainer, this.#sortItemsComponent, 'beforeend');
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

  #renderNoFilm = () => {
    render(this.#filmBoardContainer, this.#noFilmsComponent, 'beforeend');
  }

}
