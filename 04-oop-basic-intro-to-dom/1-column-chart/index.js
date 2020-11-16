export default class ColumnChart {

  _chartHeight=50;
  _linkName='View All';

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
    return this.link? `<a class="column-chart__link" href="${this.link}">${this.linkName}</a>`:'';
  }

  get valueHTML() {
    return `<div data-element="header" class="column-chart__header">${this.value}</div>`;
  }

  get dataElementsHTML() {
    const dataElements = [];
    if(this.data.length){
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;
    for( const dataValue of this.data) {
      const value =String(Math.floor(dataValue * scale));
      const percent =( dataValue / maxValue * 100).toFixed(0) + '%';
      dataElements.push(`<div style="--value: ${value}" data-tooltip="${percent}"></div>`);
    }}
    return dataElements.join('');

  }

  get element() {
    if(!this._elem){
    this._elem = document.createElement('div');
    this._elem.classList.add('column-chart');
    if(!this.data.length) this._elem.classList.add('column-chart_loading');
    this._elem.setAttribute('style', `--chart-height: ${this.chartHeight}`);
    this.render();
    }
    return this._elem;
  }

  constructor({data = [], label = "", value = 0, link = ""}={}) {
    this._data = data;
    this._label = label;
    this._link = link;
    this._value = value;
  }

  render(){
    this._elem.innerHTML =
      `<div class="column-chart__title">
         ${this.label}
         ${this.linkHTML}
       </div>
       <div class="column-chart__container">
         ${this.valueHTML}
         <div data-element="body" class="column-chart__chart">
           ${this.dataElementsHTML}
          </div>
       </div>
      `;
  }

  update(newData=[]) {
    this._data=newData;
    this.render();
  }

  destroy() {
    this._elem=null;
  }

  remove() {
    if(this._elem) this._elem.remove();
  }

}
