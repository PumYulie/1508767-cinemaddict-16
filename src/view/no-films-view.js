import AbstractClassView from './abstract-class-view';
import {FilterType} from '../mock/constants.js';

const noFilmsTexting = {
  [FilterType.ALL_FILMS]: 'There are no movies in our database',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
  [FilterType.IN_WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now'
};

const renderNoTaskHTML = (currentFilterType) => {
  const pageText = noFilmsTexting[currentFilterType];
  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${pageText}</h2>
    </section>
  </section>`;
};

export default class NoFilmsView extends AbstractClassView {

  constructor(selectedFilter) {
    super();
    this._state = selectedFilter;
  }

  get template() {
    return renderNoTaskHTML(this._state);
  }
}
