import {changeWord, addClassBySubmit} from '../../utils/common.js';
import FormatTime from '../../utils/format-time.js';
import {getHourFromMin} from '../../utils/common.js';

const DESCRIPTION_LENGTH = 139;

const createFilmCardTemplate = (film) => {
  const {title, runtime, genre, description, poster} = film['film_info'];
  const rating = film['film_info']['total_rating'];
  const date = film['film_info']['release']['date'];
  const {watchlist, favorite} = film['user_details'];
  const watchFilm = film['user_details']['already_watched'];

  const year = FormatTime.getDate(date, 'YYYY');

  const getDescription = () => {
    const correctText = description.length > DESCRIPTION_LENGTH ? `${description.slice(0, DESCRIPTION_LENGTH)}...` : description;
    return correctText;
  };

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${getHourFromMin(runtime).hours}h ${getHourFromMin(runtime).mins}m</span>
      <span class="film-card__genre">${genre[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${getDescription()}</p>
    <span class="film-card__comments">${film.comments.length} ${changeWord(film.comments, 'comment')}</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addClassBySubmit(watchlist, 'film-card__controls-item--active')} type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${addClassBySubmit(watchFilm, 'film-card__controls-item--active')}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${addClassBySubmit(favorite, 'film-card__controls-item--active')}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export {createFilmCardTemplate};
