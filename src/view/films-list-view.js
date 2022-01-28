import AbstractClassView from './abstract-class-view';

const renderFilmsList = () => (
  `<section class="films">
    <section class="films-list">
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
