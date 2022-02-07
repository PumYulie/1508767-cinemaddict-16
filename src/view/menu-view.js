import AbstractView from './abstract-view.js';
const createStats = () => (
  `<nav class="main-navigation">
  <a href="#stats" class="main-navigation__additional" data-filter="Stats">Stats</a>
</nav>`
);

export default class MenuView extends AbstractView {
  get template() {
    return createStats();
  }

  setMenuClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.click(evt.target);
  }
}
