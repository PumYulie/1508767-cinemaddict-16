import SmartView from './smart-view.js';
import {EMOJIS_NAMES} from '../mock/constants.js';
import {generateComment} from '../mock/generate-comments-objects.js';
import he from 'he';


const renderCommentsAndForm = (state) => {
  const {comments, commentsNumber, selectedEmotion, commentText} = state;

  const generateOneEmojiHTML = (emotionName) => (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotionName}" value="${emotionName}">
      <label class="film-details__emoji-label" for="emoji-${emotionName}">
        <img src="./images/emoji/${emotionName}.png" width="30" height="30" alt="${emotionName}">
      </label>`
  );

  const generateEmojiRadiosHTML = () => EMOJIS_NAMES.map((emotion) => generateOneEmojiHTML(emotion)).join('');

  const generateCommentsHTML = (commentsObjs) => (
    `<ul class="film-details__comments-list">
      ${commentsObjs.length > 0 ?
      commentsObjs.map( ({id, emotion, date, author, comment}) =>
        `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${date}</span>
              <button class="film-details__comment-delete" data-id=${id}>Delete</button>
            </p>
          </div>
        </li>`).join('')
      : '' }
    </ul>`
  );

  const generateFormHTML = () => (
    `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        ${selectedEmotion ? `<img src="images/emoji/${selectedEmotion}.png" width="55" height="55" alt="emoji-${selectedEmotion}">` : ''}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(commentText)}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${generateEmojiRadiosHTML()}
      </div>
    </div>`
  );

  return `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsNumber}</span></h3>
      ${generateCommentsHTML(comments)}
      ${generateFormHTML()}
    </section>
  </div>`;
};

//на вход массив из комментариев под этот попап.
export default class CommentsAndFormView extends SmartView {
  #formInitialStateProps = null;

  constructor(commentsObjsArray) {
    super();
    this.#formInitialStateProps = {
      selectedEmotion: '',
      commentText: '',
      srollPosition: 0
    };

    this._state = CommentsAndFormView.parseArrayToState(
      {
        comments: commentsObjsArray,
        commentsNumber: commentsObjsArray.length
      },
      this.#formInitialStateProps
    );

    this.popupYScroll = null;

    this.#setInnerELHandlers();

  }

  get template() {
    return renderCommentsAndForm(this._state);
  }

  #setInnerELHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('change', this.#radioEmojiChangeHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentTextareaInputHandler);
  };

  restoreHandlers = () => {
    this.#setInnerELHandlers();
    this.setFormSubmitKeyDown(this._callback.commentSubmitHandler);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentHandler);
  };

  #radioEmojiChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {return;}
    evt.stopPropagation();
    this.popupYScroll = this.element.scrollTop;
    this.updateStateAndRender({selectedEmoji: evt.target.value}, this.popupYScroll);
  };

  #commentTextareaInputHandler = (evt) => {
    evt.preventDefault();//а нужно что-то дефолтное предотвращать?
    evt.stopPropagation();
    this.updateStateNoRender({
      commentText: evt.target.value,
    });
  };


  setFormSubmitKeyDown = (callback) => {
    this._callback.commentSubmitHandler = callback;
    document.addEventListener('keydown', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    if ( !((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') ) {
      return;
    }
    if (!this._state.selectedEmoji || !this._state.commentText) {
      return;
    }
    evt.stopPropagation();
    this.popupYScroll = this.element.scrollTop;

    const commentFromForm = {
      emotion: this._state.selectedEmotion,
      comment: this._state.commentText
    };

    //сразу пользователю интерфейс меняю
    this.updateStateAndRender({
      ...this.#formInitialStateProps, //сброс редактируемых полей в состоянии
      comments: [...this._state.comments, commentFromForm], //припуш коммента
      commentsNumber: this._state.comments.length + 1
    }, this.popupYScroll);
    //и уже след шагом отправляю новые данные в модель для апдейта модели
    this._callback.commentSubmitHandler(CommentsAndFormView.parseStateToFilmObject(this._state), this.popupYScroll);

  };


  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteCommentHandler = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteCommentClickHandler);
  };

  #deleteCommentClickHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON' || !evt.target.dataset.id) {return;}

    evt.preventDefault();
    this.popupYScroll = this.element.scrollTop;

    const updatedCommentsArray = this._state.comments.filter((comment) => comment.id !== evt.target.dataset.id);

    //сначала сразу меняю юзеру интерфейс
    this.updateStateAndRender({
      comments: updatedCommentsArray,
      commentsNumber: updatedCommentsArray.length
    }, this.popupYScroll);

    //а затем отправляю данные в модель для актуализации данных модели
    this._callback.deleteCommentHandler(PopupView.parseStateToFilmObject(this._state), this.popupYScroll);
  };


  static parseArrayToState = (Obj, formStateProps) => ({...Obj, ...formStateProps});

  static parseStateToArray = (state) => state.comments; //вытащила массив объектов комментов

}
