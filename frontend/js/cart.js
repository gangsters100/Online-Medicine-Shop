/**
 * cart.js: Manages state for shopping cart using localStorage
 * Core persistence logic maintained by Member 3 (Adithya H K)
 */
export const cart = {
  items: JSON.parse(localStorage.getItem('cart')) || [],

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items: this.items, count: this.getCount() } }));
  },

  addItem(product) {
    this.items.push(product);
    this.save();
  },

  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.save();
    }
  },

  setItems(items) {
    this.items = items || [];
    this.save();
  },

  getCount() {
    return this.items.length;
  },

  getItems() {
    return [...this.items];
  }
};

