import {createElement} from '../utils/render.js';

export default class AbstractClassView {
  #element = null;
  _callback = {};

  constructor() {
    if(new.target === AbstractClassView) {
      throw new Error('oh no, oh no. oh nononononono. dont new AbstractClass');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    throw new Error('AbstractClass method used. write down ur specific .template');
  }

  removeElement() {
    this.#element = null;
  }
}
