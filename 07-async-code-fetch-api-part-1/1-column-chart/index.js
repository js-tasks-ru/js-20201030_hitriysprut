import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {

  _chartHeight = 50;
  _linkName = 'View All';
  _subElements = {};
  _range = {
    from: new Date(),
    to: new Date()
  };
  static BASE_URL = 'https://course-js.javascript.ru/';

  constructor({url = "", range, data = [], label = "", value = 0, link = "", formatHeading = {}} = {}) {
    this._data = data;
    this._label = label;
    this._link = link;
    this._value = value;
    this._url = url;
    if (range) {
      this._range = range;
    }
    this._format = formatHeading;

  }

  get element() {
    if (!this._elem) {
      this._elem = document.createElement('div');
      this._elem.classList.add('column-chart');
      if (!this.data.length) this._elem.classList.add('column-chart_loading');
      this._elem.setAttribute('style', `--chart-height: ${this.chartHeight}`);
      this.render();
      if (this.data.length) {
        this.setSubElements();
      } else
        this.uploadData();
    }
    return this._elem;
  }


  render() {
    this._elem.innerHTML =
      `<div class="column-chart__title">
         ${this.label}
         ${this.linkHTML}
       </div>
       <div class="column-chart__container">
         <div data-element="header" class="column-chart__header"></div>
         <div data-element="body" class="column-chart__chart">
          </div>
       </div>
      `;
  }


  get subElements (){
    if (this._subElements.length) return this._subElements;
    const dataElements = this.element.querySelectorAll('[data-element]');
    this._subElements.header = dataElements[0];
    this._subElements.body = dataElements[1];
    return this._subElements;
  }

  get linkName() {
    return this._linkName;
  }

  get chartHeight() {
    return this._chartHeight;
  }

  get data() {
    return this._data;
  }

  get label() {
    return this._label;
  }

  get link() {
    return this._link;
  }

  get value() {
    return this._value;
  }

  get linkHTML() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">${this.linkName}</a>` : '';
  }

  async update(from, to) {
    this._range.from = from;
    this._range.to = to;
    await this.uploadData();
  }

  async uploadData() {
    const params = `?from=${this._range.from.toISOString()}&to=${this._range.to.toISOString()}`;
    this._data = await fetchJson(ColumnChart.BASE_URL + this._url + params);
    this.setSubElements();
  }

  setSubElements() {
    const scale = 50 / this.getMaxValueFromData();
    const dataElements = [];
    let sum = 0;
    for (const [key, value] of Object.entries(this._data)) {
      const newValue = String(Math.floor(value * scale));
      sum += value;
      dataElements.push(`<div style="--value: ${newValue}" data-tooltip="${this.getTooltipHTML(key, newValue)}"></div>`);
    }
    if (dataElements.length) {
      this.element.classList.remove('column-chart_loading');
      this.subElements.body.innerHTML = dataElements.join('');
      this.subElements.header.innerText = sum;
    }
  }

  getMaxValueFromData() {
    let arr = [];
    for (const [key, value] of Object.entries(this._data)) {
      arr.push(value);
    }
    return Math.max(...arr);
  }

  getTooltipHTML(date, value) {
    return `<div><small>${date}/small></div><strong>${value}</strong>`
  }

  destroy() {
    this.remove();
    this._elem = null;
  }

  remove() {
    if (this._elem) this._elem.remove();
  }

}
