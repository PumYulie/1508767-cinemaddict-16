import AbstractObservable from './abstract-observable.js';

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

  addComment = async (updateType, update, filmId) => {
    try {
      const commentsObjsFromServer = await this.#apiService.
    } catch {

    }
  };

  deleteComment = async () => {

  };
}
