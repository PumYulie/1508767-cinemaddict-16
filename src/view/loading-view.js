import AbstractClassView from './abstract-class-view';

const renderLoadingHTML = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>
  </section>`
);


export default class LoadingView extends AbstractClassView {
  get template() {
    return renderLoadingHTML();
  }
}
