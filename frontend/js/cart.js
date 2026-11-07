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
    const existingItem = this.items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // Ensure every item has a quantity of at least 1
      this.items.push({ ...product, quantity: 1 });
    }
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
    return this.items.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  getItems() {
    return [...this.items];
  }
};
