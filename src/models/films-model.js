import AbstractObservable from './abstract-observable.js';
import {UpdateType} from '../mock/constants.js';


export default class FilmsModel extends AbstractObservable {
  #filmsObjects = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get filmsObjects () {
    return this.#filmsObjects;
  }

  init = async () => {
    try {
      const filmsObjsFromServer = await this.#apiService.filmsObjects;
      this.#filmsObjects = filmsObjsFromServer.map(this.#adaptResponseToClient);
    } catch (err) {
      this.#filmsObjects = [];
    }
    //console.log(this.#filmsObjects);
    this._notifyObservers(UpdateType.INIT);
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

    this._notifyObservers(updateType, filmToUpdate);
  };

  #adaptResponseToClient = (filmObj) => {
    const adaptedFilmObject = {...filmObj,
      name: filmObj.film_info.title,
      poster: filmObj.film_info.poster,
      rating: filmObj.film_info.total_rating,
      releaseDate: new Date(filmObj.film_info.release.date),
      runTime: filmObj.film_info.runtime,

      commentsNumber: filmObj.comments.length,
      comments: filmObj.comments, //дб commentObjects прямо тут

      inWatchList: filmObj.user_details.already_watched,
      alreadyWatched: filmObj.user_details.watchlist,
      inFavorites: filmObj.user_details.watchlist,
      watchingDate: new Date(filmObj.user_details.watching_date),

      originalName: filmObj.film_info.alternative_title,
      director: filmObj.film_info.director,
      writers: filmObj.film_info.writers,
      actors: filmObj.film_info.actors,
      country: filmObj.film_info.release.release_country,
      genres: filmObj.film_info.genre,
      fullDescription: filmObj.film_info.description,
      ageFilter: filmObj.film_info.age_rating
    };

    delete adaptedFilmObject.film_info;
    delete adaptedFilmObject.user_details;
    //что делать с adaptedFilmObject.comments ??

    return adaptedFilmObject;
  }

}
