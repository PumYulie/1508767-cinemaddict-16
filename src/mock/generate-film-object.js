import {getRandomInteger, getRandomFloat, generateValueFromArray, generateArrayFromArray, generateBoolean, generateFilmDescription} from './utils.js';
import {FILM_NAMES, ORIGINAL_NAMES, COUNTRY, POSTERS, GENRES, DIRECTORS, ACTORS, WRITERS, AGE_FILTERS, DESCRIPTIONS} from './constants.js';
import {generateCommentsObjects} from './generate-comments-objects.js';
import dayjs from 'dayjs';


const generateReleaseDate = () => {
  const randomOfDays = getRandomInteger(0, 30);
  const randomOfMonths = getRandomInteger(0, 12);
  const randomOfYears = getRandomInteger(0, 70);

  const releaseDate = dayjs()
    .subtract(randomOfDays, 'day')
    .subtract(randomOfMonths, 'month')
    .subtract(randomOfYears, 'year')
    .format('DD MMMM YYYY');

  return releaseDate;
};


const generateFilmObject = () => {
  const numberOfCommets = getRandomInteger(0, 5);
  const commentObjects = generateCommentsObjects(numberOfCommets);

  return {
    name: generateValueFromArray(FILM_NAMES),
    poster: generateValueFromArray(POSTERS),
    rating: getRandomFloat(),
    releaseYear: getRandomInteger(1929, 2001),
    runTime: `${getRandomInteger(0, 5)}h ${getRandomInteger(0, 59)}m`,
    genre: generateValueFromArray(GENRES),
    shortDescription: generateFilmDescription(DESCRIPTIONS, 140),
    commentsNumber: numberOfCommets,
    comments: commentObjects,

    inWatchList: generateBoolean(),
    alreadyWatched: generateBoolean(),
    inFavorites: generateBoolean(),

    originalName: generateValueFromArray(ORIGINAL_NAMES),
    director: generateValueFromArray(DIRECTORS),
    writers: generateArrayFromArray(WRITERS, 0.3),
    actors: generateArrayFromArray(ACTORS, 0.3),
    releaseDate: generateReleaseDate(),
    country: generateValueFromArray(COUNTRY),
    genres: generateArrayFromArray(GENRES, 0.4),
    fullDescription: generateFilmDescription(DESCRIPTIONS),
    ageFilter: generateValueFromArray(AGE_FILTERS),
  };
};


export {generateFilmObject, generateReleaseDate};
