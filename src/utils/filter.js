import {FilterType} from '../consts';

const filter = {
  [FilterType.ALL]: (films) => films.slice(),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.user_details.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.user_details.already_watched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.user_details.favorite),
};

export {filter};
