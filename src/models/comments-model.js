import AbstractObservable from './abstract-observable.js';
import {UpdateType} from '../mock/constants.js';

export default class CommentsModel extends AbstractObservable {
  #commentsObjects = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  set commentsObjects(commentsObjs) {
    this.#commentsObjects = [...commentsObjs];
  }

  get commentsObjects () {
    return this.#commentsObjects;
  }

  getCommentsForPopup = async (filmId) => {
    try {
      const responseWithComments = await this.#apiService.getCommentsObjects(filmId);
      this.#commentsObjects = responseWithComments.map((comment) => this.#adaptResponseToClient(comment));
    } catch(err) {
      this.#commentsObjects = [];
    }
    //console.log('2', this.#commentsObjects);
    //!!!!!!!поправь UpdateType!!!!
    //this._notifyObservers(UpdateType.COMMENTS_READY);

  }

  addComment = async (updateType, commentObj, filmId) => {
    try {
      const response = await this.#apiService.addComment(commentObj, filmId);
      this.#commentsObjects = response.comments.map((comment) => this.#adaptResponseToClient(comment));
      /* const adaptedResponse = this.#adaptResponseToClient(response);
      this.#commentsObjects = [...this.#commentsObjects, adaptedResponse]; */

      //this._notifyObservers(updateType, this.#commentsObjects);
    } catch(err) {
      throw new Error('Can\'t add a new comment');
    }
  };

  deleteComment = async (updateType, commentObj) => {
    const indexOfCommentToDelete = this.#commentsObjects.findIndex((comment) => comment.id === commentObj.id);

    if (indexOfCommentToDelete === -1) {
      throw new Error('Can\'t delete an unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(commentObj);
      this.#commentsObjects = [
        ...this.#commentsObjects(0, indexOfCommentToDelete),
        ...this.#commentsObjects(indexOfCommentToDelete + 1)
      ];
      this._notifyObservers(updateType);
    } catch(err) {
      throw new Error('Can\'t delete a comment');
    }
  };

  //получаю от сервера и обрабатываю перед рендерингом
  #adaptResponseToClient = (commentObj) => {
    const adaptedCommentObject = {
      ...commentObj,
      date: new Date(commentObj.date)
    };

    return adaptedCommentObject;
  };
}
