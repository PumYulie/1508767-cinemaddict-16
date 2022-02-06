export default class APIService {
  #endPoint = null;
  #authorizationLine = null;

  constructor(endPoint, authorizationLine) {
    this.#endPoint = endPoint;
    this.#authorizationLine = authorizationLine;
  }


  //отправляю разные запросы и получаю ОТВЕТ от СЕРВЕРА
  // return запаршенный response-промиснутый;
  // промис резолвится в response, паршу json в js-данные
  #load = async ({
    urlEnding,
    method = 'GET',
    body = null,
    headers = new Headers()
  }) => {
    headers.append('Authorization', this.#authorizationLine );

    //отпр запрос и получаю ОТВЕТ СЕРВЕРА
    const response = await fetch(
      `${this.#endPoint}/${urlEnding}`,
      {method, body, headers}
    );

    //паршу json-ответ в js-данные
    try {
      APIService.checkResponseStatus(response);
      return response;
    } catch(err) {
      APIService.catchError(err);
    }
  };


  get filmsObjects() {
    return this.#load({urlEnding: 'movies'})
      .then(APIService.parseResponse);
  }

  //возвр промис с запаршенным response
  getCommentsObjects = async (filmId) => {
    const response = await this.#load({urlEnding: `comments/${filmId}`});
    const parsedResponse = await APIService.parseResponse(response);
    return parsedResponse;
  };


  //отправляю json 1 обновленного объекта фильма,
  //возвращаю промис с запаршенным response (там обновленный объект фильма)
  updateFilmObject = async (filmObj) => {
    const response = await this.#load({
      urlEnding: `movies/${filmObj.id}`,
      method: 'PUT',
      body: JSON.stringify(this.#adaptToServer(filmObj)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await APIService.parseResponse(response);
    return parsedResponse;
  };

  //постит 1 коммент на сервер
  addComment = async (commentObj, filmId) => {
    const response = await this.#load({
      urlEnding: `movies/${filmId}`,
      method: 'POST',
      body: JSON.stringify(commentObj),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await APIService.parseResponse(response);
    return parsedResponse;
  };


  //отпр запрос, получаю ответ промис с запаршенным response
  deleteComment = async (commentObj) => {
    const response = await this.#load({
      urlEnding: `comments/${commentObj.id}`,
      method: 'DELETE'
    });
    return response;
  };


  #adaptToServer = (filmObj) => {

    const adaptedFilmObject = {...filmObj,
      'comments': filmObj.comments, //что делать с комментс?

      'film_info': {
        'title': filmObj.name,
        'alternative_title': filmObj.originalName,
        'total_rating': filmObj.rating,
        'poster': filmObj.poster,
        'age_rating': filmObj.ageFilter,
        'director': filmObj.director,
        'writers': filmObj.writers,
        'actors': filmObj.actors,
        'release': {
          'date': filmObj.releaseDate.toISOString(),
          'release_country': filmObj.country,
        },
        'runtime': filmObj.runTime,
        'genre': filmObj.genres,
        'description': filmObj.fullDescription
      },
      'user_details': {
        'watchlist': filmObj.inWatchList,
        'already_watched': filmObj.alreadyWatched,
        'watching_date': filmObj.watchingDate,
        'favorite': filmObj.inFavorites
      }
    };

    delete adaptedFilmObject.name;
    delete adaptedFilmObject.originalName;
    delete adaptedFilmObject.rating;
    delete adaptedFilmObject.poster;
    delete adaptedFilmObject.ageFilter;
    delete adaptedFilmObject.director;
    delete adaptedFilmObject.writers;
    delete adaptedFilmObject.actors;
    delete adaptedFilmObject.releaseDate;
    delete adaptedFilmObject.country;
    delete adaptedFilmObject.runTime;
    delete adaptedFilmObject.genres;
    delete adaptedFilmObject.fullDescription;
    delete adaptedFilmObject.inWatchList;
    delete adaptedFilmObject.alreadyWatched;
    delete adaptedFilmObject.watchingDate;
    delete adaptedFilmObject.inFavorites;
    delete adaptedFilmObject.genre;
    delete adaptedFilmObject.shortDescription;
    delete adaptedFilmObject.commentsNumber;

    return adaptedFilmObject;
  };

  //.json() возвращает ПРОМИС!!  Читаю ответ сервера, чтобы юзать пришедший объект
  static parseResponse = (response) => response.json();

  static checkResponseStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  };

  static catchError = (err) => {
    throw err;
  };
}
