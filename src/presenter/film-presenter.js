import FilmListItemView from '../view/films-list-item-view.js';
import PopupView from '../view/popup-view.js';
import {render, cutOffElement, insertElement, replaceElement} from '../utils/render.js';

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

    //для задачи самообновиться. сначала фиксирую старое, если было. и затемобновляю свойство актуальным контентом
    const prevFilmComponent = this.#filmComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmListItemView(this.#filmObj);
    this.#filmComponent.setOnPosterClick(this.#onOpenFilmPopupClick);

    //если не было старого - просто рендерю, что просили
    if (prevFilmComponent === null || prevFilmPopupComponent) {
      render(this.#filmListContainer, this.#filmComponent, 'beforeend');
      return;
    }

    //если старое было в DOM(проверяю нарверняка), то сначала меняю старое на новое
    if (this.#filmListContainer.element.contains(prevFilmComponent)) {
      replaceElement(prevFilmComponent, this.#filmComponent);
    }
    // но в целом старое убираю
    cutOffElement(prevFilmComponent);
    cutOffElement(prevFilmPopupComponent);

  }

  deleteFilm = () => {
    cutOffElement(this.#filmComponent);
    cutOffElement(this.#filmPopupComponent);
  }

  #onOpenFilmPopupClick = () => {
    this.#filmPopupComponent = new PopupView(this.#filmObj);
    insertElement(this.#filmPopupComponent, this.#filmListContainer);
    document.body.classList.add('hide-overflow');

    this.#filmPopupComponent.setOnCloseBtnClick(this.#onCloseFilmPopupClick);
    document.addEventListener('keydown', this.#onEscPopupKeyDown);

    this.#filmComponent.element
      .querySelector('.film-card__link')
      .removeEventListener('click', this.#onOpenFilmPopupClick);
  };

  #onEscPopupKeyDown = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      document.body.classList.remove('hide-overflow');
      cutOffElement(this.#filmPopupComponent);
      document.removeEventListener('click', this.#onEscPopupKeyDown);
    }
  };

  #onCloseFilmPopupClick = () => {
    document.body.classList.remove('hide-overflow');
    cutOffElement(this.#filmPopupComponent);
    document.removeEventListener('click', this.#onEscPopupKeyDown);
  };
}
