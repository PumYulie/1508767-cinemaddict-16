import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  addComment = async (updateType, update, filmID) => {
    try {
      const response = await this.#apiService.addComment(update, filmID);
      this.#comments = [
        response,
        ...this.#comments,
      ];
      this._notify(updateType, update);
    } catch(error) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(error) {
      throw new Error('Can\'t delete comment');
    }
  }
}
