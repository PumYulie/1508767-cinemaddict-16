import {renderSiteMenu} from './view/site-menu.js';
import {renderCardInList} from './view/card-in-list.js';
import {renderUserName} from './view/user-name.js';
import {renderShowMoreButton} from './view/show-more-button.js';
import {renderPopupWithoutComment} from './view/popup-without-comment.js';

const renderComponent = (container, html, placeToPutHtml) => {
  container.insertAdjacentHTML(placeToPutHtml, html);
};

const FILM_CARDS_COUNT = 5;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const filmCardsContainer = document.createElement('div');

//очень хочу, чтобы карточки построились горищонтально, а они не строятся
//что сделать?
filmCardsContainer.setAttribute('display', 'flex');
filmCardsContainer.setAttribute('justify-content', 'space-between');

renderComponent(headerElement, renderUserName(), 'beforeend');
renderComponent(mainElement, renderSiteMenu(), 'beforeend');

for (let i = 0; i <= FILM_CARDS_COUNT; i++) {
  renderComponent(filmCardsContainer, renderCardInList(), 'beforeend');
}

renderComponent(mainElement, filmCardsContainer.innerHTML, 'beforeend');
renderComponent(mainElement, renderShowMoreButton(), 'beforeend');

//работает, но пока мешает разборке с выстраиванием карточек фильма горизонтально
//renderComponent(mainElement, renderPopupWithoutComment(), 'beforeend');
