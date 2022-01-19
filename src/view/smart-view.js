import AbstractClassView from './abstract-class-view.js';

export default class SmartView extends AbstractClassView {
  _state = {};

  updateState = (updateObj, onlyStateUpdate) => {
    if (!updateObj) {return;}
    this._state = {...this._state, ...updateObj}; //обогащаю состояние накликом от юзера

    if (onlyStateUpdate) {return;}//чтобы текстареа не перерисовывалась до отправки комм

    this.updateElement();
  };

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement(); // this.element=null
    const newElement = this.element;//рисую по this._state из .template()
    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  };

  restoreHandlers = () => {
    throw new Error('Make restoreHandlers() specific to the class where it\'s used');
  };
}
