const EMOJIS = ['smile', 'sleeping', 'puke', 'angry'];
const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};
const FilmBlocks = {
  main: {
    title: 'All movies. Upcoming',
    isTitleHidden: true,
  },
  topRated: {
    title: 'Top rated',
    isExtra: true,
  },
  mostCommented: {
    title: 'Most commented',
    isExtra: true,
  },
  empty: {
    title: 'There are no movies in our database',
    isEmpty: true,
  },
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};
const UpdateType = {
  DELETE: 'DELETE',
  ADD: 'ADD',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
  STATS: 'Stats',
};
const StatisticsType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const State = {
  ADDING: 'ADDING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};
export {SortType, FilmBlocks, EMOJIS, UserAction, UpdateType, FilterType, StatisticsType, State};
