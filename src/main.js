import {render} from './utils/render.js';
import UserName from './view/user-name-view.js';
import SiteMenuView from './view/site-menu-view.js';
import {generateFilmObject} from './mock/generate-film-object.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilterPresenter from './presenter/filters-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';

const FILM_CARDS_COUNT = 7;

const header = document.querySelector('.header');
const main = document.querySelector('.main');

const filmsModel = new FilmsModel();
const mockFilmObjects = Array.from({length: FILM_CARDS_COUNT}, generateFilmObject);
filmsModel.filmsObjects = mockFilmObjects;
const filterModel = new FilterModel();


render(header, new UserName(), 'beforeend');
const siteMenu = new SiteMenuView();
render(main, siteMenu, 'beforeend');


const filmsPresenter = new FilmListPresenter(main, filmsModel);
const filtersPresenter = new FilterPresenter(siteMenu, filterModel, filmsModel);

filtersPresenter.init();
filmsPresenter.init();


export {FILM_CARDS_COUNT};
