/**
 * ui.js: Handles DOM manipulation
 */
export function renderProducts(products) {
  const container = document.getElementById('product-container');
  if(!container) return;

  container.innerHTML = products.map(p => `
    <div class="product-card">
      <h3>${p.name}</h3>
    </div>
  `).join('');
}
