export default class APIService {
  #endPoint = null;
  #authorizationLine = null;

  constructor(endPoint, authorizationLine) {
    this.#endPoint = endPoint;
    this.#authorizationLine = authorizationLine;
  }

  get filmsObjects () {
    return this.#load({urlEnding: 'movies'})
      .then(APIService.parseResponse);
  }

  //отправляю серверу json 1 обновленного объекта фильма
  updateFilmObject = async (filmObj) => {
    const response = await this.#load({
      urlEnding: `movies/${filmObj.id}`,
      method: 'PUT',
      body: JSON.stringify(this.#adaptToServer(filmObj)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await APIService.parseResponse(response);
    return parsedResponse;
  }

  //стрелки - это сокращенный function expression
  //получаю ОТВЕТ от СЕРВЕРА
  //return response; промис резолвится в response
  #load = async ({
    urlEnding,
    method = 'GET',
    body = null,
    headers = new Headers()
  }) => {
    headers.append('Authorization', this.#authorizationLine );

    //получаю ОТВЕТ СЕРВЕРА
    const response = await fetch(`${this.#endPoint}/${urlEnding}`, {method, body, headers});

    try {
      APIService.checkResponseStatus(response);
      return response;
    } catch(err) {
      APIService.catchError(err);
    }
  }

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

  //.json() возвращает ПРОМИС!!
  static parseResponse = (response) => response.json();

  static checkResponseStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
