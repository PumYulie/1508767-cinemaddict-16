import {renderUserName} from './view/user-name.js';
import {renderSiteMenu} from './view/site-menu.js';
import {renderFilmsList} from './view/films-list.js';
import {renderFilmsListItem} from './view/films-list-item.js';
import {renderShowMoreButton} from './view/show-more-button.js';
import {renderPopup} from './view/popup.js';
import {generateFilmObject} from './mock/generate-film-object.js';
import {generateFilterObject} from './mock/generate-filters.js';

const FILM_CARDS_COUNT = 18;
const FILMS_PER_STEP = 5;

const mockFilmObjects = Array.from({length: FILM_CARDS_COUNT}, generateFilmObject);
const mockFilterObjects = generateFilterObject(mockFilmObjects);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

const renderComponent = (container, html, placeToPutHtml) => {
  container.insertAdjacentHTML(placeToPutHtml, html);
};

renderComponent(headerElement, renderUserName(), 'beforeend');
renderComponent(mainElement, renderSiteMenu(mockFilterObjects), 'beforeend');
renderComponent(mainElement, renderFilmsList(), 'beforeend');

const filmsListContainer = document.querySelector('.films-list__container');

for (let i = 0; i < Math.min(FILM_CARDS_COUNT, FILMS_PER_STEP); i++) {
  renderComponent(filmsListContainer, renderFilmsListItem(mockFilmObjects[i]), 'beforeend');
}

if (mockFilmObjects.length > FILMS_PER_STEP) {
  let renderedFilmCards = FILMS_PER_STEP;

  renderComponent(mainElement, renderShowMoreButton(), 'beforeend');

  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    mockFilmObjects
      .slice(renderedFilmCards, renderedFilmCards+FILMS_PER_STEP)
      .forEach((item) => renderComponent(filmsListContainer, renderFilmsListItem(item), 'beforeend'));

    renderedFilmCards += FILMS_PER_STEP;

    if (renderedFilmCards >= mockFilmObjects.length) {
      showMoreButton.remove();
    }
  });
}


renderComponent(mainElement, renderPopup(mockFilmObjects[0]), 'beforeend');
