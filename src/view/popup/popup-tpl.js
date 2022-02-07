import {changeWord, addClassBySubmit} from '../../utils/common.js';
import {EMOJIS} from '../../consts.js';
import FormatTime from '../../utils/format-time.js';
import he from 'he';
const addCheckedProperty = (isChecked) => isChecked ? 'checked' : '';
const renderFilmDetailsTable = (name, value) => (
  `<tr class="film-details__row">
  <td class="film-details__term">${name}</td>
  <td class="film-details__cell">${value}</td>
</tr>`
);
const renderElementGenre = (array) => {
  if (array.length > 0) {
    const box = [];
    for (const element of array)
    {box.push(`<span class="film-details__genre">${element}</span>`);}
    return box;
  }
};
export const createControlTemplate = (data) => (`<section class="film-details__controls">
<button type="button" class="film-details__control-button ${addClassBySubmit(data.user_details.watchlist, 'film-details__control-button--active')} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
<button type="button" class="film-details__control-button ${addClassBySubmit(data.user_details.already_watched, 'film-details__control-button--active')} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
<button type="button" class="film-details__control-button ${addClassBySubmit(data.user_details.favorite, 'film-details__control-button--active')} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
</section>`);

const createCommentTemplate = (commentId, array, isDisabled) => {
  const commentBox = [];

  for (const element of array) {
    if (commentId.includes(element.id)) {
      const {id, author, comment, date, emotion} = element;
      const formatedDate = FormatTime.getDate(date, 'YYYY/MM/DD HH:mm');
      const humanizeDate = FormatTime.getHumanizeDate(date);
      commentBox.push(`<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day"  title="${formatedDate}">${humanizeDate}</span>
              <button class="film-details__comment-delete" data-comment-id="${id}"
              ${isDisabled ? 'disabled' : ''}>
              Delete</button>
            </p>
          </div>
      </li>`);
    }
  }
  return commentBox;
};

const createNewCommentTemplate = (emojiIcon, checkedEmojiItem, comment, isDisabled) => `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">${emojiIcon !== '' ? `<img src="/images/emoji/${emojiIcon}.png" width="55" height="55" alt="emoji-${emojiIcon}">` : ''}</div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"
          ${isDisabled ? 'disabled' : ''}
          >${he.encode(comment)}</textarea>
        </label>
        <div class="film-details__emoji-list">
        ${EMOJIS.map((emoji) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${addCheckedProperty(`emoji-${emoji}` === checkedEmojiItem)}>
        <label class="film-details__emoji-label" for="emoji-${emoji}">
          <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
        </label>`).join('')}
        </div>
      </div>`;
const createFilmPopupTemplate = (data, array) => {
  const {title, runtime, genre, description, poster, director, writers, actors} = data['film_info'];
  const rating = data['film_info']['total_rating'];
  const date = data['film_info']['release']['date'];
  const ageRating = data['film_info']['age_rating'];
  const alternativeTitle = data['film_info']['alternative_title'];
  const country = data['film_info']['release']['release_country'];
  const {emojiIcon, checkedEmojiItem, isDisabled, isDeleting, comment} = data;

  const dateFormat = FormatTime.getDate(date, 'D MMMM YYYY');

  const getTime = () => {
    const hours = Math.trunc(runtime/60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}м`;
  };
  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">
            <p class="film-details__age">${ageRating}+</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${alternativeTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>
            <table class="film-details__table">
              ${renderFilmDetailsTable('Director', director)}
              ${renderFilmDetailsTable('Writers', writers.join(', '))}
              ${renderFilmDetailsTable('Actors', actors.join(', '))}
              ${renderFilmDetailsTable('Release Date', dateFormat)}
              ${renderFilmDetailsTable('Runtime', getTime())}
              ${renderFilmDetailsTable('Country', country)}
              ${renderFilmDetailsTable(changeWord(genre, 'Genre'), renderElementGenre(genre).join(' '))}
            </table>
           <p class="film-details__film-description">
            ${description}
            </p>
          </div>
        </div>
        ${createControlTemplate(data)}
      </div>
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>
          <ul class="film-details__comments-list">
            ${createCommentTemplate(data.comments, array, isDisabled, isDeleting).join('')}
          </ul>
            ${createNewCommentTemplate(emojiIcon, checkedEmojiItem, comment, isDisabled)}
        </section>
      </div>
    </form>
  </section>`;
};
export {createFilmPopupTemplate};
