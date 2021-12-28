import {render, cutOffElement} from '../utils/render.js';
import SortItemsView from '../view/sort-view.js';
import FilmListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmsView from '../view/no-films-view.js';
import {FILM_CARDS_COUNT} from '../main.js';
import FilmPresenter from './film-presenter.js';

const FILMS_PER_STEP = 5;

export default class FilmListPresenter {
  #filmObjects = [];
  #filmBoardContainer = null;

  #filmsListComponent = new FilmListView();
  #filmsListContainer = this.#filmsListComponent.element.querySelector('.films-list__container');
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmsComponent = new NoFilmsView();
  #sortItemsComponent = new SortItemsView();
  #renderedFilmCards = FILMS_PER_STEP;

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
    //const filmPresenter = new FilmPresenter(this.#filmsListComponent); - или так??
    const filmPresenter = new FilmPresenter(filmListContainer);
    filmPresenter.init(filmObj);
  }
  //#renderFilm = (filmListContainer, filmObj) => {
  /*const filmComponent = new FilmListItemView(filmObj);

    const onOpenFilmPopupClick = (filmObject) => {
      const filmPopupComponent = new PopupView(filmObject);
      insertElement(filmPopupComponent, filmListContainer);
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
    render(filmListContainer, filmComponent, 'beforeend'); */
  //}


  #renderFilmsAboveButton = (from, to) => {
    this.#filmObjects
      .slice(from, to)
      .forEach((item) => this.#renderFilm(this.#filmsListComponent, item));
  }

  #renderFilmList = () => { //вместо функции renderFilmBoard
    for (let i = 0; i < Math.min(FILM_CARDS_COUNT, FILMS_PER_STEP); i++) {
      this.#renderFilm(this.#filmsListContainer, this.#filmObjects[i]);
    }

    if (this.#filmObjects.length > FILMS_PER_STEP) {
      this.#renderShowMoreButton();
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
    this.#showMoreButtonComponent.setOnClickhandler(() =>  this.#onShowMoreButtonClick());
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
