export default class NotificationMessage {

  static message_exists = false;
  static element;

  constructor(text = 'text', {duration = 2000, type = 'success'} = {}) {
    if (this.message_exists_in_dom) {
      this.remove();
    }
    this._duration = duration;
    this._type = type;
    this._text = text;
    this.render();
  }

  set message_exists_in_dom(value) {
    NotificationMessage.message_exists = value;
  }

  get message_exists_in_dom() {
    return NotificationMessage.message_exists;
  }

  get text() {
    return this._text;
  }

  get duration() {
    return this._duration;
  }

  get durationInSec() {
    return this.duration/1000;
  }

  get type() {
    return this._type;
  }

  get element() {
    return NotificationMessage.element;
  }

  set element(element) {
    NotificationMessage.element = element;
  }

  textHTML() {
    return `<div class="notification-body">${this.text}</div>`
  }

  typeHTML() {
    return `<div class="notification-header">${this.type}</div>`;
  }

  timerHTML() {
    const timer = document.createElement('div');
    timer.classList.add(`timer`);
    return timer.outerHTML;
  }

  template() {
    return `
  <div class="notification" style="--value:${this.durationInSec}s">
     ${this.timerHTML()}
     <div class="inner-wrapper">
      ${this.typeHTML()}
      ${this.textHTML()}
     </div>
  </div>
    `
  }

  render() {
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.element = elem.firstElementChild;
    this.element.classList.add(`${this.type}`);
  }

  show(parentElement=document.body) {
    this.render();
    parentElement.append(NotificationMessage.element);
    this.message_exists_in_dom = true;
    setTimeout(() => this.remove(), this.duration);

  }

  remove() {
    if(this.element)this.element.remove();
    this.message_exists_in_dom = false;
  }

  destroy() {
    this.remove();
    this.element = null;
  }

}
