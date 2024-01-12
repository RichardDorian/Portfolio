class SVGIconElement extends HTMLElement {
  static domParser = new DOMParser();

  connectedCallback() {
    this.src = this.getAttribute('src');
    this.color = this.getAttribute('color');
    this.replaceWithIcon();
  }

  async replaceWithIcon() {
    const source = await this.getSource();
    const svg = SVGIconElement.domParser.parseFromString(
      source,
      'image/svg+xml'
    ).documentElement;
    svg.style.fill = this.color;

    this.replaceWith(svg);
  }

  async getSource() {
    const response = await fetch(this.src);
    return await response.text();
  }
}

customElements.define('svg-icon', SVGIconElement);
