import AbstractClassView from './abstract-class-view';


const renderSiteMenu = () => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);


export default class SiteMenuView extends AbstractClassView {
  get template() {
    return renderSiteMenu();
  }
}
