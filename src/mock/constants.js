export const FILM_NAMES = [
  'Made for Each Other',
  'Popeye the Sailor Meets Sinbad the Sailor',
  'Sagebrush Trail',
  'Santa Claus Conquers the Martians',
  'The Dance of Life',
  'The Great Flamarion',
  'The Man with the Golden Arm'
];

export const ORIGINAL_NAMES = [
  'Созданы друг для друга',
  'Танцы жизни',
  'Моряк встречает моряка',
  'Парень с золотой рукой',
  'Супер-фламарион'
];

export const COUNTRY = [
  'USA',
  'Great Britain',
  'Spain',
  'Italy',
  'Bosnia'
];

export const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

export const GENRES = [
  'Musical', 'Western', 'Drama', 'Comedy', 'Cartoon', 'Mystery', 'Film-Noir'
];

export const EMOJIS = [
  'angry.png',
  'puke.png',
  'sleeping.png',
  'smile.png'
];

export const EMOJIS_NAMES = [
  'angry',
  'puke',
  'sleeping',
  'smile'
];

export const DIRECTORS = [
  'John Cromwell',
  'Adolf Zukor',
  'Armand Schaefer',
  'Nicolas Webster',
  'A.Edward Sutherland',
  'Anthony Mann',
  'Otto Preminger'
];

export const ACTORS = [
  'James Stewart',
  'Carole Lombard',
  'Charles Coburn',
  'John Wayne',
  'Joseph E. Levine',
  'Hal Skelly',
  'Nancy Carroll',
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Dureya',
  'Stephan Barclay',
  'Frank sinatra',
  'Kim Novak',
  'Eleanor Parker'
];

export const WRITERS = [
  'Joe Swerling',
  'Max Fleischer',
  'Lindsley Parsons',
  'Paul Malvern',
  'Glenville Mareth',
  'Benjamin Glazer',
  'Anne Wigton',
  'Heinzs Herald',
  'Richard Weil'
];

export const AGE_FILTERS = [
  '6+',
  '12+',
  '16+',
  '18+'
];

export const COMMENT_AUTHORS = [
  'Tim Macoveev',
  'John Doe',
  'Yulie',
  'You-mama-cinema-fan'
];

export const COMMENT_MESSAGES = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
  'hahahaha',
  'I think it is a nice movie',
  'Someone had to say smth good'
];

export const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RATING: 'by-rating'
};

export const UserAction = {
  ADD_FILM_TO: 'ADD_FILM_TO',
  SORT_FILMS: 'SORT_FILMS', //уточнять вид: по дате по рейтингу по дефолту?
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT'
};

export const UpdateType = {
  PATCH: 'PATCH',//только карточку и попап(если был)
  MINOR: 'MINOR',//список постеров (и попап если был) и сортировка
  MAJOR: 'MAJOR'//ререндер строки Watchlist/History/Favorites, сортировки(?????), списка постеров(если стою в фаворитах и удаляю из фаворитов), сам изменившийся постер и попап(если открыт)
};

export const FilterType = {
  ALL_FILMS: 'all',
  FAVORITES: 'favorites',
  IN_WATCHLIST: 'watchlist',
  HISTORY: 'history'
};
