export default class SortableTable {
  sorting = '';
  subElements = {};

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
  }

  template() {
    return `
<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.getHeaderHTML()}
    </div>
    ${this.getSubElements().body.outerHTML}
  </div>
</div>`;
  }

  getSubElements() {
    const elem = document.createElement('div');
    elem.innerHTML = `<div data-element="body" class="sortable-table__body">
      ${this.getSubElementsHTML()}
    </div>`;
    this.subElements.body = elem.firstElementChild;
    return this.subElements;
  }

  getHeaderHTML() {
    let fullHeader = [];
    this.dataIds = [];
    for (const column of this.headerColumns) {
      fullHeader.push(`<div class="sortable-table__cell" data-id="${column.id}" data-sortable="${column.sortable}" data-order="${this.sorting}">
      <span>${column.title}</span>
      </div>`);
      this.dataIds.push(`${column.id}`);
    }
    return fullHeader.join('');
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
    /*const button = `<button type="button" class="button-primary-outline">Reset all filters</button>`;
    this.subElements.push(button);*/
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

  sort(fieldValue, sortingType) {
    this.sorting = sortingType;
    let valueType;
    const col = this.headerColumns.find(col => col.id === fieldValue);
    valueType = col.sortType;

    const direction = sortingType === 'asc' ? 1 : -1;
    switch (valueType) {
      case('number'):
        this.data.sort((a, b) => {return direction * (a[fieldValue] - (b[fieldValue]))} );
        break;
      case('string'):
        this.data.sort((a, b) => {return direction * a[fieldValue].localeCompare(b[fieldValue], 'ru')});
        break;
      default:
        this.data.sort((a, b) => direction * (a[fieldValue] - (b[fieldValue])));
    }
    this.render();
  }
}



