import {render} from './utils/render.js';
import UserName from './view/user-name-view.js';
import SiteMenuView from './view/site-menu-view.js';
import {generateFilmObject} from './mock/generate-film-object.js';
import {generateFilterObject} from './mock/generate-filters.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilmsModel from './model/films-model.js';

const FILM_CARDS_COUNT = 6;

const header = document.querySelector('.header');
const main = document.querySelector('.main');

const mockFilmObjects = Array.from({length: FILM_CARDS_COUNT}, generateFilmObject);
const mockFilterObjects = generateFilterObject(mockFilmObjects);

const filmsModel = new FilmsModel();
filmsModel.filmsObjects = mockFilmObjects;

const filmsPresenter = new FilmListPresenter(main, filmsModel);

render(header, new UserName(), 'beforeend');
render(main, new SiteMenuView(mockFilterObjects), 'beforeend');

filmsPresenter.init();


export {FILM_CARDS_COUNT};
