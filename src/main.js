import {renderUserName} from './view/user-name.js';
import {renderSiteMenu} from './view/site-menu.js';
import {renderFilmsList} from './view/films-list.js';
import {renderFilmsListItem} from './view/films-list-item.js';
import {renderShowMoreButton} from './view/show-more-button.js';
//import {renderPopupWithoutComment} from './view/popup-without-comment.js';

const FILM_CARDS_COUNT = 5;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

const renderComponent = (container, html, placeToPutHtml) => {
  container.insertAdjacentHTML(placeToPutHtml, html);
};

renderComponent(headerElement, renderUserName(), 'beforeend');
renderComponent(mainElement, renderSiteMenu(), 'beforeend');
renderComponent(mainElement, renderFilmsList(), 'beforeend');

const filmsListContainer = document.querySelector('.films-list__container');
for (let i = 0; i < FILM_CARDS_COUNT; i++) {
  renderComponent(filmsListContainer, renderFilmsListItem(), 'beforeend');
}

renderComponent(mainElement, renderShowMoreButton(), 'beforeend');
//renderComponent(mainElement, renderPopupWithoutComment(), 'beforeend');
