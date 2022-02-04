export default class AbstractObservable {
  #observers = new Set();

  addObserver = (observerCallback) => {
    this.#observers.add(observerCallback);
  };

  removeObserver = (observerCallback) => {
    this.#observers.delete(observerCallback);
  };

  _notifyObservers = (event, payload) => {
    this.#observers.forEach((observerCallback) => observerCallback(event, payload));
  };
}
