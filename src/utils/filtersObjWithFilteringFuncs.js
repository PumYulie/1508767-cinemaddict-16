import {FilterType} from '../mock/constants.js';

//movies = массив из объектов фильмов, подается в функцию на вход
//movie = 1 объект фильма
export const filtersObjWithFilteringFuncs = {
  [FilterType.ALL_FILMS]: (movies) => movies,
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.inFavorites),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.alreadyWatched),
  [FilterType.IN_WATCHLIST]: (movies) => movies.filter((movie) => movie.inWatchList)
};

