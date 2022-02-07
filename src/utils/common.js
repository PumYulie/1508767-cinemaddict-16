import FormatTime from './format-time.js';

const NUMBER_MINUTES_PER_HOUR = 60;
const changeWord = (array, word) => array.length === 1 ? word : `${word}s`;

const addClassBySubmit = (submit, className) => submit ? className : '';

const sortDate = (filmA, filmB) => FormatTime.getDate(filmB.film_info.release.date, 'YYYY') - FormatTime.getDate(filmA.film_info.release.date, 'YYYY');

const sortRating = (filmA, filmB) => filmB.film_info.total_rating - filmA.film_info.total_rating;
const sortComments = (filmA, filmB) => filmB.comments.length - filmA.comments.length;
const onEscKeyDown = (evt, cb) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    cb(evt);
  }
};
const getHourFromMin = (mins) => ({
  hours: Math.trunc(mins / NUMBER_MINUTES_PER_HOUR),
  mins: mins % NUMBER_MINUTES_PER_HOUR,
});

export {changeWord, addClassBySubmit, sortDate, sortRating, sortComments, onEscKeyDown, getHourFromMin};
