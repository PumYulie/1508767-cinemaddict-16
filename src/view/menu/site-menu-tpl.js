import {FilterType} from '../../consts.js';

const createMenuItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  const menuActiveClass = 'main-navigation__item--active';
  return (`<a
      href="#${type}"
      class="main-navigation__item ${type === currentFilterType ? `${menuActiveClass}` : ''}"
      data-filter="${type}"
      >
      ${name}
      ${type !== FilterType.ALL ? `<span data-filter="${type}" class="main-navigation__item-count">${count}</span>` : ''}
    </a>`);
};

const createSiteMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createMenuItemTemplate(filter, currentFilterType))
    .join('');

  return (`<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`);
};

export {createSiteMenuTemplate};
