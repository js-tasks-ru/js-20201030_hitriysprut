const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
import fetchJson from './utils/fetch-json.js';
import escapeHtml from './utils/escape-html.js';

export default class ProductForm {
  subElements = {};
  defaultFormData = {
    title: '',
    description: '',
    quantity: 1,
    subcategory: '',
    status: 1,
    images: [],
    price: 100,
    discount: 0
  };

  constructor(productId) {
    this.productId = productId;
  }

  get element() {
    if (this._element) return this._element;
    return this.render();
  }

  set element(element) {
    this._element = element;
  }

  async render() {
    const categoriesPromise = this.getCategories();

    const productPromise = this.productId
      ? this.getProductData(this.productId)
      : [this.defaultFormData];

    const [categoriesData, productResponse] = await Promise.all([categoriesPromise, productPromise]);

    const [productData] = productResponse;

    this.formData = productData;
    this.categories = categoriesData;

    const elem = document.createElement('div');
    elem.innerHTML = this.template();
    this._element = elem.firstElementChild;
    this.getSubElements(this._element);
    this.setFormData();
    this.initEventListeners();
    return this._element;
  }

  template() {
    return `<div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" id='title' name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control"  id='description' name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer"><ul class="sortable-list"></ul>${this.getImageList()}</div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
         ${this.getCategoriesHTML()}
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number"  id='price' name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number"  id='discount' name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number"  id='quantity' class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control"   id='status' name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>
</div>
    `
  }

  getImageList() {
    return this.formData.images.map(item => {
      return this.getImage(item.url, item.source).outerHTML;
    }).join('');
  }

  async getCategories() {
    return await fetchJson(`${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`);
  }

  async getProductData(productId) {
    return await fetchJson(`${BACKEND_URL}/api/rest/products?id=${productId}`);
  }

  getCategoriesHTML(){
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `<select class="form-control" id="subcategory" name="subcategory"></select>`;

    const select = wrapper.firstElementChild;

    for (const category of this.categories) {
      for (const child of category.subcategories) {
        select.append(new Option(`${category.title} > ${child.title}`, child.id));
      }
    }

    return select.outerHTML;
  }


  getSubElements(element) {
    //if (this.subElements.length) return this.subElements;
    this.subElements.submitBtn = element.querySelector('[name="save"]');
    const dataElements=element.querySelectorAll('.form-group');
    this.subElements.nameForm = dataElements[0];
    this.subElements.description = dataElements[1];
    this.subElements.imageListContainer = dataElements[2];
    this.subElements.uploadImage = this.subElements.imageListContainer.querySelector('[name="uploadImage"]');
    this.subElements.category = dataElements[3];
    this.subElements.price = dataElements[4];
    this.subElements.quantity = dataElements[5];
    this.subElements.status = dataElements[6];
    this.subElements.productForm= element.querySelector('[data-element="productForm"]');



    return this.subElements;
  }

  initEventListeners(){
    this.subElements.uploadImage
      .addEventListener('click',this.onUploadImage);
    this.subElements.submitBtn
      .addEventListener('click',this.onSubmit);
  }

  onUploadImage = (e)=> {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async () => {
      const [file] = fileInput.files;

      if (file) {
        const formData = new FormData();
        const {uploadImage,imageListContainer} = this.subElements;

        formData.append('image', file);

        uploadImage.classList.add('is-loading');
        uploadImage.disabled = true;

        const result = await fetchJson('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          },
          body: formData
        });

        imageListContainer.append(this.getImage(result.data.link, file.name));

        uploadImage.classList.remove('is-loading');
        uploadImage.disabled = false;

      }

    };
    fileInput.click();
  };
  getImage(url, name) {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <li class="products-edit__imagelist-item sortable-list__item">
        <span>
          <img src="./icon-grab.svg" data-grab-handle alt="grab">
          <img class="sortable-table__cell-img" alt="${escapeHtml(name)}" src="${escapeHtml(url)}">
          <span>${escapeHtml(name)}</span>
        </span>
        <button type="button">
          <img src="./icon-trash.svg" alt="delete" data-delete-handle>
        </button>
      </li>`;

    return wrapper.firstElementChild;
  }
  onSubmit = async(e)=>{
    e.preventDefault();
    this.save();
  };

  async save(){
    this.subElements.productForm = this.getFormData();
    const result = await fetchJson(`${BACKEND_URL}/api/rest/products`, {
      method: this.productId ? 'PATCH' : 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.subElements.productForm)
    });
    if(this.productId){
      this.element.dispatchEvent(new CustomEvent('product-updated'));
    }
    else this.element.dispatchEvent(new CustomEvent('product-saved'));
  }

  setFormData(){
    const { productForm } = this.subElements;
    const excludedFields = ['images'];
    const fields = Object.keys(this.defaultFormData).filter(item => !excludedFields.includes(item));

    fields.forEach(item => {
      const element = productForm.querySelector(`#${item}`);

      element.value = this.formData[item] || this.defaultFormData[item];
    });
  }
  getFormData(){
  this.formData.title = this.getSubElements(this.element).nameForm.querySelector('input').value;
    this.formData.description = this.getSubElements(this.element).description.querySelector('textarea').value;
    this.formData.quantity = parseInt(this.getSubElements(this.element).quantity.querySelector('input').value);
    this.formData.subcategory = this.getSubElements(this.element).category.querySelector('select').value;
    this.formData.status = parseInt(this.getSubElements(this.element).status.querySelector('select').value);
    this.formData.price = parseInt(this.getSubElements(this.element).price.querySelector('input').value);
    this.formData.discount = parseInt(this.getSubElements(this.element).price.querySelectorAll('input')[1].value);

    const imagesHTMLCollection = this.getSubElements(this.element).imageListContainer.querySelectorAll('.sortable-table__cell-img');

    this.formData.images = [];
    this.formData.id = this.productId;

    for (const image of imagesHTMLCollection) {
      this.formData.images.push({
        url: image.src,
        source: image.alt
      });
    }
    return this.formData;
  }

  remove() {
    if (this.element) this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
  }

}
