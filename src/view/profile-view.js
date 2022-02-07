import {getUserRank} from '../utils/statistics.js';
import AbstractView from './abstract-view.js';

const createProfileTemplate = (films) => (
  `<section class="header__profile profile">
  <p class="profile__rating">${getUserRank(films)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createProfileTemplate(this.#films);
  }
}
