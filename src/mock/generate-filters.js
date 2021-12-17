//movies = массив из объектов фильмов
//movie = 1 объект фильма
// нужен чтобы посчитать числа и собрать все типы фильтра
const filtersCounts = {
  watchlist: (movies) => movies.filter((movie) => movie.inWatchList).length,
  history: (movies) => movies.filter((movie) => movie.alreadyWatched).length,
  favorites: (movies) => movies.filter((movie) => movie.inFavorites).length
};

//на вход массив из всех сгенерированных объектов фильмов
//возвращаю массив объектов фильтров с нужными цифрами внутри фильтров
const generateFilterObject = (movies) => Object.entries(filtersCounts)
  .map(([filterName, movieCount]) => ({
    name: filterName,
    count: movieCount(movies),
  })
  );


export {generateFilterObject};
