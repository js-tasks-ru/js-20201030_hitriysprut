export default class SortableTable {


  constructor(headerColumns = [], {data = []} = {}) {
    this._headerColumns = headerColumns;
    this._data = data;
    this.render();
  }

  get data() {
    return this._data;
  }

  get headerColumns() {
    return this._headerColumns;
  }

  render() {
    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this.element = elem.firstElementChild;
    //console.log(elem.outerHTML);
    console.log(this.element.outerHTML);
  }

  template() {
    return `
<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.getHeaderHTML()}
    </div>
    <div data-element="body" class="sortable-table__body">
      ${this.getBodyHTML()}
    </div>
  </div>
</div>`;
  }

  getHeaderHTML() {
    let fullHeader = [];
    for (const column of this.headerColumns) {
      fullHeader.push(`<div class="sortable-table__cell" data-id="${column.id}" data-sortable="${column.sortable}" data-order="asc">
      <span>${column.title}</span>
      </div>`);
    }
    return fullHeader.join('');
  }

  getBodyHTML() {
    let fullBody = [];
    if (this.data.length !== 0) {
      for (const row of this.data) {
        fullBody.push(`<a href="products/${row.id}" class="sortable-table__row">
     ${this.addCellsHTML(row)}
      </a>`);
      }
    } else {
      const loading = `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
      <p>No products satisfies your filter criteria</p>`;
      fullBody.push(loading);
    }
    const button = `<button type="button" class="button-primary-outline">Reset all filters</button>`;
    fullBody.push(button);
    return fullBody.join('');
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
    if(row.images) rowCells.push(`<div class="sortable-table__cell"><img class="sortable-table-image" alt="Image" src="${row.images[0].url}"></div>`);
    if(row.title) rowCells.push(`<div class="sortable-table__cell">${row.title}</div>`);
    if(row.quantity) rowCells.push(`<div class="sortable-table__cell">${row.quantity}</div>`);
    if(row.price) rowCells.push(`<div class="sortable-table__cell">${row.price}</div>`);
    if(row.sales) rowCells.push(`<div class="sortable-table__cell">${row.sales}</div>`);
    return rowCells.join('');
  }
}



