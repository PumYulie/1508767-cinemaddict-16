import {render} from './utils/render.js';
import UserName from './view/user-name-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilterPresenter from './presenter/filters-presenter.js';
import APIService from './api-service.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';


const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/';
const AUTHORIZATION = 'Basic q4a354e5r68t79p';

const header = document.querySelector('.header');
const main = document.querySelector('.main');

const filmsModel = new FilmsModel(new APIService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();


render(header, new UserName(), 'beforeend');
const siteMenu = new SiteMenuView();
render(main, siteMenu, 'beforeend');


const filmsPresenter = new FilmListPresenter(main, filmsModel, filterModel);
const filtersPresenter = new FilterPresenter(siteMenu, filterModel, filmsModel);

filtersPresenter.init();
filmsPresenter.init();

filmsModel.init();
