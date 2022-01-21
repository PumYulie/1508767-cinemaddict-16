import AbstractClassView from './abstract-class-view.js';

export default class SmartView extends AbstractClassView {
  _state = {};

  updateStateNoRender = (updateObj) => {
    if (!updateObj) { return; }
    this._state = {...this._state, ...updateObj};
  };

  updateStateAndRender = (updateObj, yScrollPosition) => {
    if (!updateObj) {return;}
    this._state = {...this._state, ...updateObj};

    this.updateElement(yScrollPosition);
  };

  updateElement = (yScrollPosition) => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement(); // this.element=null
    const newElement = this.element;//рисую по this._state из .template()
    parent.replaceChild(newElement, prevElement);
    newElement.scrollTop = yScrollPosition;
    this.restoreHandlers();
  };

  restoreHandlers = () => {
    throw new Error('Make restoreHandlers() specific to your class');
  };
}
