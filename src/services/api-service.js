const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};
export default class ApiService {
  #endPoint = null;
  #authorization = null;
  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'});
  }

  getComments = async (filmId) => await this.#load({ url: `comments/${filmId}` });


  updateFilm = async (film) => await this.#load({
    url: `movies/${film.id}`,
    method: Method.PUT,
    body: JSON.stringify(film),
    headers: new Headers({'Content-Type': 'application/json'}),
  });

  addComment = async (comment, filmId) => {
    await this.#load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
  }

  deleteComment = async (comment) => {
    await this.#load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);
    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );
    try {
      ApiService.checkStatus(response);
      return ApiService.parseResponse(response);
    } catch (error) {
      ApiService.catchError(error);
    }
  }

  static parseResponse = (response) => response.json();
  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (error) => {
    throw error;
  }
}
