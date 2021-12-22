import {render} from './render.js';
import UserName from './view/user-name-view.js';
import SiteMenuView from './view/site-menu.js';
import FilmListView from './view/films-list.js';
import FilmListItemView from './view/films-list-item.js';
import ShowMoreButtonView from './view/show-more-button.js';
import PopupView from './view/popup.js';
import {generateFilmObject} from './mock/generate-film-object.js';
import {generateFilterObject} from './mock/generate-filters.js';


const FILM_CARDS_COUNT = 9;
const FILMS_PER_STEP = 5;

const header = document.querySelector('.header');
const main = document.querySelector('.main');

const mockFilmObjects = Array.from({length: FILM_CARDS_COUNT}, generateFilmObject);
const mockFilterObjects = generateFilterObject(mockFilmObjects);

render(header, new UserName().element, 'beforeend');
render(main, new SiteMenuView(mockFilterObjects).element, 'beforeend');

const filmsListComponent = new FilmListView();
render(main, filmsListComponent.element, 'beforeend');


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

      filmPopupComponent.element.querySelector('.film-details__close-btn')
        .removeEventListener('click', onCloseFilmPopupClick);
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


for (let i = 0; i < Math.min(FILM_CARDS_COUNT, FILMS_PER_STEP); i++) {
  renderFilm(filmsListComponent.element, mockFilmObjects[i]);
}

if (mockFilmObjects.length > FILMS_PER_STEP) {
  let renderedFilmCards = FILMS_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  render(main, showMoreButtonComponent.element, 'beforeend');

  showMoreButtonComponent.element.addEventListener('click', (evt) => {
    evt.preventDefault();
    mockFilmObjects
      .slice(renderedFilmCards, renderedFilmCards + FILMS_PER_STEP)
      .forEach((item) => renderFilm(filmsListComponent.element, item));

    renderedFilmCards += FILMS_PER_STEP;

    if (renderedFilmCards >= mockFilmObjects.length) {
      showMoreButtonComponent.element.remove();
    }
  });
}

//render(main, new PopupView(mockFilmObjects[0]).element, 'beforeend');
