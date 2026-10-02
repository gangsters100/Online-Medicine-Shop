/**
 * cart.js: Manages state for shopping cart using localStorage
 */
export const cart = {
  items: JSON.parse(localStorage.getItem('cart')) || [],

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  },

  addItem(product) {
    this.items.push(product);
    this.save();
  }
};
