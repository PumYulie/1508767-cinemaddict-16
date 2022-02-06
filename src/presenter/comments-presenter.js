import CommentsAndFormView from '../view/comments-view.js';
import {UserAction, UpdateType} from '../mock/constants.js';

export default class CommentsPresenter {
  #commentsModel = null;
  #popupCommentsComponent = null;

  constructor (commentsModel) {
    this.#commentsModel = commentsModel;

    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get commentsArray () {
    return this.#commentsModel.commentsObjects;
  }

  init = () => {
    const prevCommentsArray = this.#popupCommentsComponent;

    this.#popupCommentsComponent = new CommentsAndFormView(this.commentsArray);
    this.#setEListenersOnCommentsComponent(); //что аргументами???
  };

  #setEListenersOnCommentsComponent = () => {
    this.#popupCommentsComponent.setFormSubmitKeyDown(this.#onCommentSubmitKeyDown);
    this.#popupCommentsComponent.setDeleteCommentClickHandler(this.#onDeleteCommentClick);
  };

  //аргументом объект с новым состоянием
  #onCommentSubmitKeyDown = (commentObj, popupYScroll) => {
    this.#handleViewUserActions(
      UpdateType.PATCH,
      UserAction.ADD_COMMENT,
      commentObj,
      true, popupYScroll
    );
  };

  #onDeleteCommentClick = (filmObj, popupYScroll) => {
    this.#handleViewUserActions(
      UpdateType.PATCH,
      UserAction.DELETE_COMMENT,
      filmObj,
      true,
      popupYScroll
    );
  }

  #handleViewUserActions = async (updateType, actionType, commentObj, isPopup, popupYScroll) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        //addComment(updateType, commentObj, filmId)
        await this.#commentsModel.addComment(updateType, commentObj);
        break;
      case UserAction.DELETE_COMMENT:
        //deleteComment (updateType, commentObj)
        await this.#commentsModel.deleteComment(updateType, commentObj);
        break;
    }
  }

  #handleModelEvent = () => {

  };

}
