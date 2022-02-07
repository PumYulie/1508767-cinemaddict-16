import AbstractView from './abstract-view.js';

const createFilmsTemplate = () => (
  '<section class="films"></section>'
);

export default class Film extends AbstractView {
  get template(){
    return createFilmsTemplate();
  }
}
