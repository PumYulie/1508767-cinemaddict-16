import AbstractObservable from './abstract-observable.js';

export default class FilmsModel extends AbstractObservable {
  #filmsObjects = [];

  get filmsObjects () {
    return this.#filmsObjects;
  }

  set filmsObjects (filmObjects) {
    this.#filmsObjects = [...filmObjects];
  }

  updateFilm = (updateType, filmToUpdate) => {
    const index = this.filmsObjects.findIndex((item) => item.id === filmToUpdate.id);

    if (index === -1) {
      throw new Error('cant update, film doesnt exist');
    }

    this.filmsObjects = [
      ...this.filmsObjects.slice(0, index),
      filmToUpdate,
      ...this.filmsObjects.slice(index + 1),
    ];

    this.notifyObservers(updateType, filmToUpdate);
  };

}
