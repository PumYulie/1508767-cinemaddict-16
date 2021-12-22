import {createElement} from '../render.js';

const renderShowMoreButton = () => (
  `<button class="films-list__show-more">
    Show more
  </button>`
);

export default class ShowMoreButtonView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return renderShowMoreButton();
  }

  removeElement() {
    this.#element = null;
  }
}
