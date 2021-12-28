import FilmListItemView from '../view/films-list-item-view.js';
import PopupView from '../view/popup-view.js';
import {render, cutOffElement, insertElement} from '../utils/render.js';

export default class FilmPresenter {
  #filmComponent = null;
  #filmPopupComponent = null;
  #filmListContainer = null;
  #filmObj = null;

  constructor (filmListContainer) {
    this.#filmListContainer = filmListContainer;
  }

  init = (filmObj) => {
    this.#filmObj = filmObj;
    this.#filmComponent = new FilmListItemView(this.#filmObj);

    //В строке ниже проблема. первая из типовых проблем.
    //чтото не то я делаю с обработчикаами. этот вписан через =>, другие просто this.#onEscPopupKeyDown(), но и так и так не работает
    this.#filmComponent.setOnPosterClick(() => this.#onOpenFilmPopupClick());
    render(this.#filmListContainer, this.#filmComponent, 'beforeend');
  }

  #onOpenFilmPopupClick = () => {
    this.#filmPopupComponent = new PopupView(this.#filmObj);
    insertElement(this.#filmPopupComponent, this.#filmListContainer);
    document.body.classList.add('hide-overflow');

    this.#filmPopupComponent.setOnCloseBtnClick(this.#onCloseFilmPopupClick());
    document.addEventListener('keydown', this.#onEscPopupKeyDown());

    this.#filmComponent.element
      .querySelector('.film-card__link')
      .removeEventListener('click', this.#onOpenFilmPopupClick());
    //.removeEventListener('click', () => this.#onOpenFilmPopupClick(this.#filmObj));
  };

  #onEscPopupKeyDown = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      document.body.classList.remove('hide-overflow');
      cutOffElement(this.#filmPopupComponent);
      document.removeEventListener('click', this.#onEscPopupKeyDown());
    }
  };

  #onCloseFilmPopupClick = () => {
    document.body.classList.remove('hide-overflow');
    cutOffElement(this.#filmPopupComponent);
    document.removeEventListener('click', this.#onEscPopupKeyDown());
  };
}
