import {render} from './utils/render.js';
import UserName from './view/user-name-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilterPresenter from './presenter/filters-presenter.js';
import CommentsPresenter from './presenter/comments-presenter.js';
import APIService from './api-service.js';
import FilmsModel from './models/films-model.js';
import FilterModel from './models/filter-model.js';
import CommentsModel from './models/comments-model.js';


const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic q4a354e5r68t79p';

const header = document.querySelector('.header');
const main = document.querySelector('.main');

const apiService = new APIService(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel(apiService);
const filterModel = new FilterModel();
const commentsModel = new CommentsModel(apiService);

const siteMenu = new SiteMenuView();

const filmsPresenter = new FilmListPresenter(main, filmsModel, filterModel, commentsModel);
const filtersPresenter = new FilterPresenter(siteMenu, filterModel, filmsModel);
//const commentsPresenter = new CommentsPresenter(commentsModel);

filtersPresenter.init();
filmsPresenter.init();
//куда commentsPresenter.init() ?

filmsModel.init().finally(() => {
  render(header, new UserName(), 'beforeend');
  render(main, siteMenu, 'afterbegin');
});
