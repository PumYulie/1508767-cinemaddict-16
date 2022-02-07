import SiteMenu from '../view/menu/site-menu.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../consts.js';
export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #moviesModel = null;
  #filterComponent = null;
  constructor(filterContainer, filterModel, moviesModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.init();
  }

  get filters() {
    const films = this.#moviesModel.films;
    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      }
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new SiteMenu(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
