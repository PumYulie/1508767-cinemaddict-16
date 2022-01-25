import {FilterType, UpdateType} from '../mock/constants.js';
import FilterView from '../view/filters-view.js';
import {filtersObjWithFilteringFuncs} from '../utils/filtersObjWithFilteringFuncs.js';
import {render, cutOffElement, replaceElement} from '../utils/render.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor (filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filterModel.addObserver(this.#handleModelEventComplete);
    this.#filmsModel.addObserver(this.#handleModelEventComplete);
  }

  //создает и возвращает массив объектов фильтров, которые соотнесены по типам фильмов и числу фильмов по каждому типу (получено из модели фильмов)
  get filtersObjects () {
    const filmsObjs = this.#filmsModel.filmsObjects;//объекты фильмов от сервера, которые модель фильмов сама получает

    return [
      {
        type: FilterType.ALL_FILMS,
        name: 'All movies',
        count: filtersObjWithFilteringFuncs[FilterType.ALL_FILMS](filmsObjs).length,
      },
      {
        type: FilterType.IN_WATCHLIST,
        name: 'Watchlist',
        count: filtersObjWithFilteringFuncs[FilterType.IN_WATCHLIST](filmsObjs).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filtersObjWithFilteringFuncs[FilterType.HISTORY](filmsObjs).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filtersObjWithFilteringFuncs[FilterType.FAVORITES](filmsObjs).length,
      }
    ];
  }

  init = () => {
    const filters = this.filtersObjects;//массив объектов фильтров по данным из модели фильмов
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.currentFilter);
    this.#filterComponent.setFiltersTypeChangeHandler(this.#handleFilterTypeChangeByUser);

    //если фильтр еще не рендерился, то рендерим с 0
    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, 'afterbegin');
      return;
    }

    //если мы тут, значит фильтр уже рендерился и надо перерендерить через подмену элемента в том же месте
    replaceElement(prevFilterComponent, this.#filterComponent);
    cutOffElement(prevFilterComponent);
  }


  #handleModelEventComplete = () => {
    this.init();
  }

  #handleFilterTypeChangeByUser = (clickedFilterType) => {
    if (clickedFilterType === this.#filterModel.currentFilter) { return; }

    this.#filterModel.setCurrentFilter(UpdateType.MAJOR, clickedFilterType);
  }
}
