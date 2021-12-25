import AbstractClassView from './abstract-class-view';

const renderFilterHTML = (filterObject) => {
  const {name, count} = filterObject;
  const nameUppercased = name[0].toUpperCase() + name.slice(1);

  return `
    <a href="#${name}" class="main-navigation__item">${nameUppercased} <span class="main-navigation__item-count">${count}</span></a>
  `;

};

export default class FilterView extends AbstractClassView {
  #filterObject = null;

  constructor(filterObject) {
    super();
    this.#filterObject = filterObject;
  }

  get template() {
    return renderFilterHTML(this.#filterObject);
  }
}
