import AbstractClassView from './abstract-class-view';

const renderNoTaskHTML = () => (
  `<h2 class="films-list__title">There are no movies in our database</h2>
      <!--
        Значение отображаемого текста зависит от выбранного фильтра:
          * All movies – 'There are no movies in our database'
          * Watchlist — 'There are no movies to watch now';
          * History — 'There are no watched movies now';
          * Favorites — 'There are no favorite movies now'.
      -->`
);


export default class NoFilmsView extends AbstractClassView {
  get template() {
    return renderNoTaskHTML();
  }
}
