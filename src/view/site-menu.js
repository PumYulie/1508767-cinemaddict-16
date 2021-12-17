
const renderFilterHTML = (filterObject) => {
  const {name, count} = filterObject;
  const nameUppercased = name[0].toUpperCase() + name.slice(1);

  return `
    <a href="#${name}" class="main-navigation__item">${nameUppercased} <span class="main-navigation__item-count">${count}</span></a>
  `;

};


const renderSiteMenu = (filtersObjects) => {
  const renderAllFiltersHTML = filtersObjects
    .map((filter) => renderFilterHTML(filter))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${renderAllFiltersHTML}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>

  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;
};

export {renderSiteMenu};
