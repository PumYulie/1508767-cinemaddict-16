import {render} from './render.js';
import UserName from './view/user-name-view.js';
import SiteMenuView from './view/site-menu-view.js';
import SortItemsView from './view/sort-view.js';
import FilmListView from './view/films-list-view.js';
import FilmListItemView from './view/films-list-item-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import PopupView from './view/popup-view.js';
import NoFilmsView from './view/no-films-view.js';
import {generateFilmObject} from './mock/generate-film-object.js';
import {generateFilterObject} from './mock/generate-filters.js';

const FILM_CARDS_COUNT = 0;
const FILMS_PER_STEP = 5;

const header = document.querySelector('.header');
const main = document.querySelector('.main');

const mockFilmObjects = Array.from({length: FILM_CARDS_COUNT}, generateFilmObject);
const mockFilterObjects = generateFilterObject(mockFilmObjects);

const renderFilm = (filmListContainer, filmObj) => {
  const filmComponent = new FilmListItemView(filmObj);

  const onOpenFilmPopupClick = (filmObject) => {
    const filmPopupComponent = new PopupView(filmObject);
    document.body.classList.add('hide-overflow');
    filmListContainer.appendChild(filmPopupComponent.element);

    const onEscPopupKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc') {
        document.body.classList.remove('hide-overflow');
        filmListContainer.removeChild(filmPopupComponent.element);

        document.removeEventListener('click', onEscPopupKeyDown);
      }
    };

    const onCloseFilmPopupClick = () => {
      document.body.classList.remove('hide-overflow');
      document
        .removeEventListener('click', onEscPopupKeyDown);

      filmListContainer.removeChild(filmPopupComponent.element);
    };

    filmPopupComponent.element.querySelector('.film-details__close-btn')
      .addEventListener('click', onCloseFilmPopupClick);
    document
      .addEventListener('keydown', onEscPopupKeyDown);

    filmComponent.element.querySelector('.film-card__link')
      .removeEventListener('click', () => onOpenFilmPopupClick(filmObj));
  };

  filmComponent.element.querySelector('.film-card__link')
    .addEventListener('click', () => onOpenFilmPopupClick(filmObj));

  render(filmListContainer, filmComponent.element, 'beforeend');
};

const renderFilmBoard = (filmBoardContainer, filmObjects) => {
  const filmsListComponent = new FilmListView();
  const showMoreButtonComponent = new ShowMoreButtonView();

  if (filmObjects.length === 0) {
    render(filmBoardContainer, new NoFilmsView().element, 'beforeend');
  } else {
    render(filmBoardContainer, new SortItemsView().element, 'beforeend');
    render(filmBoardContainer, filmsListComponent.element, 'beforeend');

    for (let i = 0; i < Math.min(FILM_CARDS_COUNT, FILMS_PER_STEP); i++) {
      renderFilm(filmsListComponent.element.querySelector('.films-list__container'), filmObjects[i]);
    }

    if (filmObjects.length > FILMS_PER_STEP) {
      let renderedFilmCards = FILMS_PER_STEP;

      render(filmBoardContainer, showMoreButtonComponent.element, 'beforeend');

      showMoreButtonComponent.element.addEventListener('click', (evt) => {
        evt.preventDefault();
        filmObjects
          .slice(renderedFilmCards, renderedFilmCards + FILMS_PER_STEP)
          .forEach((item) => renderFilm(filmsListComponent.element, item));

        renderedFilmCards += FILMS_PER_STEP;

        if (renderedFilmCards >= filmObjects.length) {
          showMoreButtonComponent.element.remove();
          showMoreButtonComponent.removeElement();
        }
      });
    }
  }
};

render(header, new UserName().element, 'beforeend');
render(main, new SiteMenuView(mockFilterObjects).element, 'beforeend');

renderFilmBoard(main, mockFilmObjects);
