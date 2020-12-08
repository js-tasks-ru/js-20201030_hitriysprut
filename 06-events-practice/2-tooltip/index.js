class Tooltip {
  static instance;
  element;

  constructor() {
    if(!Tooltip.instance)
    Tooltip.instance=this;
  }

  render(html) {
    this.element= document.createElement('div');
    this.element.classList.add('tooltip');
    this.element.innerHTML = html;
    document.body.append(this.element);
  }

  pointOver = (event) =>{
    if (event.target.dataset.tooltip !== undefined) {
      this.render(event.target.dataset.tooltip);
      this.moveTooltip(event);
    }
  };

  initialize() {
    document.addEventListener('pointerover', this.pointOver );
    document.addEventListener('pointerout', event => {
      if (event.target.dataset.tooltip !== undefined) {
        document.removeEventListener('pointermove', this.pointOver);
        this.destroy();
      }
    });
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  moveTooltip(event) {
    this.element.style.left = `${event.clientX}px`;
    this.element.style.top = `${event.clientY}px`;
  }
}

const tooltip = new Tooltip();

export default tooltip;
