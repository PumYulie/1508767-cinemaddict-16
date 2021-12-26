import {render, cutOffElement, insertElement} from '../utils/render.js';

import SortItemsView from '../view/sort-view.js';
import FilmListView from '../view/films-list-view.js';
import FilmListItemView from '../view/films-list-item-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import PopupView from '../view/popup-view.js';
import NoFilmsView from '../view/no-films-view.js';

const FILM_CARDS_COUNT = 6;
const FILMS_PER_STEP = 5;

export default class FilmListPresenter {
  #filmObjects = [];
  #filmBoardContainer = null;

  #filmsListComponent = new FilmListView();
  #filmsListContainer = this.#filmsListComponent.element.querySelector('.films-list__container');//или это в конструктор отправить???
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmsComponent = new NoFilmsView();
  #sortItemsComponent = new SortItemsView();

  constructor(filmBoardContainer) {
    this.#filmBoardContainer = filmBoardContainer;
  }

  init = (filmObjects) => {
    this.#filmObjects = [...filmObjects]; //взяла массив, распаковала на элементы и снова запаковала в новый массив

    if (filmObjects.length === 0) {
      this.#renderNoFilm();
    } else {
      this.#renderSort();
      this.#renderFilmListContainer();

      this.#renderFilmList(); // ПРОВЕРЬ НА АРГУМЕНТЫ!!


    }
  }

  #renderFilm = (filmListContainer, filmObj) => {
    const filmComponent = new FilmListItemView(filmObj);

    const onOpenFilmPopupClick = (filmObject) => {
      const filmPopupComponent = new PopupView(filmObject);
      insertElement(filmPopupComponent);
      document.body.classList.add('hide-overflow');

      const onEscPopupKeyDown = (evt) => {
        if(evt.key === 'Escape' || evt.key === 'Esc') {
          document.body.classList.remove('hide-overflow');
          cutOffElement(filmPopupComponent);
          document.removeEventListener('click', onEscPopupKeyDown);
        }
      };

      const onCloseFilmPopupClick = () => {
        document.body.classList.remove('hide-overflow');
        cutOffElement(filmPopupComponent);
        document.removeEventListener('click', onEscPopupKeyDown);
      };

      filmPopupComponent.setOnCloseBtnClick(onCloseFilmPopupClick);
      document.addEventListener('keydown', onEscPopupKeyDown);

      filmComponent.element.querySelector('.film-card__link')
        .removeEventListener('click', () => onOpenFilmPopupClick(filmObj));
    };

    filmComponent.setOnPosterClick(() => onOpenFilmPopupClick(filmObj));
    render(filmListContainer, filmComponent, 'beforeend');
  }

  #renderFilmsAboveButton = (from, to) => { // n-фильмов за раз рендерит. по 5 фильмов
    this.#filmObjects
      .slice(from, to)
      .forEach((item) => this.#renderFilm(this.#filmsListComponent, item));
  }

  #renderFilmList = () => { //вместо функции renderFilmBoard
    for (let i = 0; i < Math.min(FILM_CARDS_COUNT, FILMS_PER_STEP); i++) {
      this.#renderFilm(this.#filmsListContainer, this.#filmObjects[i]);
    }

    if (this.#filmObjects.length > FILMS_PER_STEP) {
      this.#renderLogicShowMoreButton();
    }
  }

  #renderFilmListContainer = () => { //рисую ul для карточек фильмов
    render(this.#filmBoardContainer, this.#filmsListComponent, 'beforeend');
  }

  #renderSort = () => {
    render(this.#filmBoardContainer, this.#sortItemsComponent, 'beforeend');
  }

  #renderShowMoreButton = () => {
    render(this.#filmBoardContainer, this.#showMoreButtonComponent, 'beforeend');
  }

  #renderLogicShowMoreButton = () => {
    let renderedFilmCards = FILMS_PER_STEP;

    this.#renderShowMoreButton();

    this.#showMoreButtonComponent.setOnClickhandler(() => {
      this.#renderFilmsAboveButton(renderedFilmCards, renderedFilmCards + FILMS_PER_STEP);

      renderedFilmCards += FILMS_PER_STEP;

      if (renderedFilmCards >= this.#filmObjects.length) {
        this.#showMoreButtonComponent.element.remove();
        this.#showMoreButtonComponent.removeElement();
      }
    });
  }

  #renderNoFilm = () => {
    render(this.#filmBoardContainer, this.#noFilmsComponent, 'beforeend');
  }

}
