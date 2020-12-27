export default class SortableTable {
  sorting='asc';
  subElements = {};
  customSort = (a, b) => {return direction * (a[fieldValue] - (b[fieldValue]))};

  constructor(headerColumns = [], {data = []} = {}) {
    this._headerColumnsArr = headerColumns;
    this._data = data;
    this.render();
    this.initEventListener();
    this.sort(this.getSubElements(this.element).header.querySelector(`.sortable-table__cell[data-sortable='true']`)
      .getAttribute('data-id'),this.sorting);
  }

  get data() {
    return this._data;
  }

  get headerColumnsArr() {
    return this._headerColumnsArr;
  }

  get element(){
    if(this._element) return this._element;
    this.render();
    return this._element;
  }

  set element(element){
    this._element=element;
  }

  render() {
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this._element = elem.firstElementChild;
  }

  template() {
    return `
<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.getHeaderHTML()}
    </div>
    ${this.getSubElementsBodyHTML()}
  </div>
</div>`;
  }


  getArrow(){
    if(this.arrow) return this.arrow;
    const elem = document.createElement('div');
    elem.innerHTML = `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`;
    return this.arrow = elem.firstElementChild;
  }
  getSubElementsBodyHTML() {
    return `<div data-element="body" class="sortable-table__body">
      ${this.getSubElementsHTML()}
    </div>`;
  }

  getHeaderHTML() {
    let fullHeader = [];
    this.dataIds = [];
    for (const column of this.headerColumnsArr) {
      let html =`<div class="sortable-table__cell" data-id="${column.id}" data-sortable="${column.sortable}" data-order="${this.sorting}">
      <span>${column.title}</span>
      </div>`;
      fullHeader.push(html);
      this.dataIds.push(`${column.id}`);
    }
    return fullHeader.join('');
  }

  getHeader() {
    if(this.header) return this.header;
    return this.header = this.element.querySelector(`[data-element='header']`);
  }

  getHeaderColumns() {
    if(this.headerColumns) return this.headerColumns;
    return this.headerColumns = this.getHeader().querySelectorAll(`.sortable-table__cell`);
  }

  getSubElementsHTML() {
    this.subRows = [];
    if (this.data.length !== 0) {
      for (const row of this.data) {
        const elem = document.createElement('div');
        elem.innerHTML = `<a href="products/${row.id}" class="sortable-table__row">
                      ${this.addCellsHTML(row)}
                      </a>`;
        this.subRows.push(elem.firstElementChild);
      }
    } else {
      const elem = document.createElement('div');
      elem.innerHTML = `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
      <p>No products satisfies your filter criteria</p>`;
      this.subRows.push({element: elem.firstElementChild, id: `${id}`});
    }
    const subElemHtmls = [];
    for (const el of this.subRows) {
      subElemHtmls.push(el.outerHTML);
    }
    return subElemHtmls.join('');
  }

  remove() {
    if (this.element) this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
  }

  addCellsHTML(row) {
    let rowCells = [];
    for (const id of this.dataIds) {
      if (id === 'images') rowCells.push(`<div class="sortable-table__cell"><img class="sortable-table-image" alt="Image" src="${row.images[0].url}"></div>`);
      else rowCells.push(`<div class="sortable-table__cell">${row[`${id}`]}</div>`);
    }
    return rowCells.join('');
  }

  initEventListener(){
    this.element.querySelectorAll(`[data-element='header'] .sortable-table__cell[data-sortable='true']`)
      .forEach((item)=>{item.addEventListener('pointerdown',(event)=>{
        if(this.getArrow().parentElement===event.currentTarget&&this.sorting==='asc')this.sorting='desc';
        else this.sorting='asc';
      this.sort(event.currentTarget.getAttribute('data-id'),this.sorting);
    })})
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    this.subElements = [...elements].reduce((acc, item) => {
      acc[item.dataset.element] = item;
      return acc;
    }, {});
    return this.subElements;
  }

  sort(fieldValue, sorting) {
    const direction = sorting === 'asc' ? 1 : -1;
    const col = this.headerColumnsArr.find(col => col.id === fieldValue);
    switch (col.sortType) {
      case('number'):
        this.data.sort((a, b) => {return direction * (a[fieldValue] - (b[fieldValue]))} );
        break;
      case('string'):
        this.data.sort((a, b) => {return direction * a[fieldValue].localeCompare(b[fieldValue], 'ru')});
        break;
      case('custom'):
        this.data.sort(this.customSort);
        break;
      default:
        this.data.sort((a, b) => direction * (a[fieldValue] - (b[fieldValue])));
    }
    for ( let column of this.getHeaderColumns()){
      if(column.getAttribute('data-id')===fieldValue)
      {
        column.setAttribute('data-order',sorting);
        column.appendChild(this.getArrow());
        break;}
    }
    this.getSubElements(this.element).body.innerHTML=this.getSubElementsBodyHTML();
  }
}
