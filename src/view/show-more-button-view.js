import AbstractClassView from './abstract-class-view';

const renderShowMoreButton = () => (
  `<button class="films-list__show-more">
    Show more
  </button>`
);

export default class ShowMoreButtonView extends AbstractClassView {
  get template() {
    return renderShowMoreButton();
  }

  setOnClickhandler = (someCallback) => {
    this._callback.showMoreButtonClick = someCallback; //создаю метод в объекте, тк это объект был
    this.element.addEventListener('click', this.#onCLickHandler);
  }

  #onCLickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showMoreButtonClick();
  }

}
