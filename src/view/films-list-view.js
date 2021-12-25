import AbstractClassView from './abstract-class-view';

const renderFilmsList = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>
    </section>
  </section>`
);

export default class FilmListView extends AbstractClassView {
  get template() {
    return renderFilmsList();
  }
}
