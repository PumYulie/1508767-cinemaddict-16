import {getRandomInteger, getRandomFloat, generateValueFromArray, generateArrayFromArray, generateBoolean, generateFilmDescription} from './utils.js';
import {FILM_NAMES, ORIGINAL_NAMES, COUNTRY, POSTERS, GENRES, EMOJIS, DIRECTORS, ACTORS, WRITERS, AGE_FILTERS, COMMENT_AUTHORS, COMMENT_MESSAGES, DESCRIPTIONS} from './constants.js';
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


const generateCommentDate = () => {
  const minutesAgo = getRandomInteger(0, 719);
  const daysAgo = getRandomInteger(0, 1825);

  const commentDate = dayjs()
    .subtract(daysAgo, 'day')
    .subtract(minutesAgo, 'minute')
    .format('YYYY/MM/DD HH:mm');

  return commentDate;
};


const generateCommentsObjects = (number) => {
  const commentsArray = [];

  for (let i = 0; i < number; i++) {
    const newCommentObj = {
      emoji: generateValueFromArray(EMOJIS),
      date: generateCommentDate(), // дата  2019/12/31 23:59
      author: generateValueFromArray(COMMENT_AUTHORS),
      message: generateValueFromArray(COMMENT_MESSAGES),
    };
    commentsArray.push(newCommentObj);
  }

  return commentsArray;
};


const generateFilmObject = () => {
  const numberOfCommets = getRandomInteger(0, 5);

  return {
    name: generateValueFromArray(FILM_NAMES),
    poster: generateValueFromArray(POSTERS),
    rating: getRandomFloat(),
    releaseYear: getRandomInteger(1960, 2021),
    runTime: `${getRandomInteger(0, 5)}h ${getRandomInteger(0, 59)}m`,
    genre: generateValueFromArray(GENRES),
    shortDescription: generateFilmDescription(DESCRIPTIONS, 140),
    commentsNumber: numberOfCommets,
    comments: generateCommentsObjects(numberOfCommets),

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


export {generateFilmObject, generateReleaseDate, generateCommentDate};
