/**
 * app.js: Homepage Controller & Application Orchestration
 * Maintained by Member 1 (Soham Shinde) - Foundation, Homepage & UI Components
 */
import { 
  fetchMedicines, 
  fetchCategories, 
  fetchTrustFeatures, 
  fetchTestimonials, 
  fetchFaqs,
  fetchMedicineById 
} from './api.js';

import { 
  renderProducts, 
  renderCategories, 
  renderTrustFeatures, 
  renderTestimonials, 
  renderFaqs, 
  renderLoadingSkeleton, 
  showToast, 
  updateCartBadge, 
  openProductQuickView, 
  openPrescriptionUploadModal 
} from './ui.js';

import { cart } from './cart.js';

// Application state
const state = {
  allMedicines: [],
  categories: [],
  activeCategory: 'all',
  searchQuery: '',
  productType: 'all',
  inStockOnly: false,
  sortBy: 'recommended',
};

/**
 * Initialize Homepage
 */
async function initHomepage() {
  // Sync initial cart badge
  updateCartBadge(cart.getCount());

  // Listen to cart state changes
  window.addEventListener('cart:updated', (e) => {
    updateCartBadge(e.detail.count);
  });

  // Setup mobile navigation toggle
  setupMobileNav();

  // Setup Prescription upload modal triggers
  setupPrescriptionTriggers();

  // Show loading skeleton for product catalog
  renderLoadingSkeleton('#product-container', 8);

  try {
    // Parallel data fetching for fast load
    const [trustFeatures, categories, medicines, testimonials, faqs] = await Promise.all([
      fetchTrustFeatures(),
      fetchCategories(),
      fetchMedicines(),
      fetchTestimonials(),
      fetchFaqs()
    ]);

    state.allMedicines = medicines;
    state.categories = categories;

    // Render Trust Features
    renderTrustFeatures(trustFeatures, '#features-container');

    // Render Categories Showcase
    renderCategories(categories, '#categories-container', state.activeCategory);

    // Setup Category click handler
    setupCategoryCardListeners();

    // Setup Filter Pills
    setupFilterPills(categories);
    setupCatalogRefinements();

    // Render initial medicines
    renderFilteredProducts();

    // Render Testimonials
    renderTestimonials(testimonials, '#testimonials-container');

    // Render FAQs
    renderFaqs(faqs, '#faq-container');

    // Setup Search bar listeners
    setupSearchListeners();

    // Setup Product card interactions (Add to cart & Quick View)
    setupProductCardInteractions();

  } catch (error) {
    console.error('Error initializing homepage:', error);
    showToast('Failed to load healthcare catalog. Please refresh.', 'error');
  }
}

/**
 * Filter and Render Products according to state
 */
function renderFilteredProducts() {
  let filtered = [...state.allMedicines];

  if (state.activeCategory && state.activeCategory !== 'all') {
    const activeLower = state.activeCategory.toLowerCase().trim();
    filtered = filtered.filter(m => (m.category || '').toLowerCase().includes(activeLower));
  }

  if (state.searchQuery && state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(m => [m.name, m.brand, m.category, m.description, m.dosage]
      .some(value => String(value || '').toLowerCase().includes(q)));
  }

  if (state.productType === 'otc') filtered = filtered.filter(m => !m.prescriptionRequired);
  if (state.productType === 'rx') filtered = filtered.filter(m => Boolean(m.prescriptionRequired));
  if (state.inStockOnly) filtered = filtered.filter(m => m.inStock !== false && (m.stockQuantity == null || m.stockQuantity > 0));
  const sorters = {
    'name-asc': (a, b) => a.name.localeCompare(b.name),
    'price-asc': (a, b) => Number(a.price) - Number(b.price),
    'price-desc': (a, b) => Number(b.price) - Number(a.price),
  };
  if (sorters[state.sortBy]) filtered.sort(sorters[state.sortBy]);

  // Update results count indicator
  const countEl = document.getElementById('results-count-number');
  if (countEl) countEl.textContent = filtered.length;
  const totalEl = document.getElementById('results-total-number');
  if (totalEl) totalEl.textContent = state.allMedicines.length;

  renderProducts(filtered, '#product-container');

  // Wire up "View All Medicines" button in empty state if present
  const resetBtn = document.getElementById('btn-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.activeCategory = 'all';
      state.searchQuery = '';
      state.productType = 'all';
      state.inStockOnly = false;
      state.sortBy = 'recommended';
      syncCatalogControls();
      renderCategories(state.categories, '#categories-container', 'all');
      
      const searchInputs = document.querySelectorAll('.header-search-input');
      searchInputs.forEach(i => i.value = '');

      // Update pills
      document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.category === 'all');
      });

      renderFilteredProducts();
    });
  }
}

function syncCatalogControls() {
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.category?.toLowerCase() === state.activeCategory.toLowerCase());
  });
  const type = document.getElementById('catalog-type');
  const stock = document.getElementById('catalog-in-stock');
  const sort = document.getElementById('catalog-sort');
  if (type) type.value = state.productType;
  if (stock) stock.checked = state.inStockOnly;
  if (sort) sort.value = state.sortBy;
}

function setupCatalogRefinements() {
  const sort = document.getElementById('catalog-sort');
  const type = document.getElementById('catalog-type');
  const stock = document.getElementById('catalog-in-stock');
  const reset = document.getElementById('catalog-reset');
  sort?.addEventListener('change', () => { state.sortBy = sort.value; renderFilteredProducts(); });
  type?.addEventListener('change', () => { state.productType = type.value; renderFilteredProducts(); });
  stock?.addEventListener('change', () => { state.inStockOnly = stock.checked; renderFilteredProducts(); });
  reset?.addEventListener('click', () => {
    state.activeCategory = 'all';
    state.searchQuery = '';
    state.productType = 'all';
    state.inStockOnly = false;
    state.sortBy = 'recommended';
    document.querySelectorAll('.header-search-input').forEach(input => { input.value = ''; });
    syncCatalogControls();
    renderCategories(state.categories, '#categories-container', 'all');
    renderFilteredProducts();
  });
}

/**
 * Category Card click handlers
 */
function setupCategoryCardListeners() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const card = e.target.closest('.category-card');
    if (!card) return;

    const catName = card.dataset.categoryName;
    if (catName) {
      state.activeCategory = catName;

      // Update pill states
      syncCatalogControls();

      renderFilteredProducts();

      // Scroll smoothly to medicines section
      const targetSection = document.getElementById('medicines-section');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.category-card');
    if (!card) return;
    e.preventDefault();
    card.click();
  });
}

/**
 * Dynamic Filter Pills setup
 */
function setupFilterPills(categories) {
  const container = document.getElementById('filter-pills-container');
  if (!container) return;

  const pillsHtml = `
    <button type="button" class="filter-pill active" data-category="all">All Medicines</button>
    ${categories.map(c => `
      <button type="button" class="filter-pill" data-category="${c.name}">${c.name}</button>
    `).join('')}
  `;

  container.innerHTML = pillsHtml;

  container.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;

    container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    state.activeCategory = pill.dataset.category;
    renderCategories(state.categories, '#categories-container', state.activeCategory);
    syncCatalogControls();
    renderFilteredProducts();
  });
}

/**
 * Header and Hero Search Listeners
 */
function setupSearchListeners() {
  const searchForms = document.querySelectorAll('.header-search-form');

  searchForms.forEach(form => {
    const input = form.querySelector('.header-search-input');
    if (!input) return;

    // Real-time debounce search
    let debounceTimer;
    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value;
        document.querySelectorAll('.header-search-input').forEach(other => { if (other !== input) other.value = input.value; });
        renderFilteredProducts();
      }, 180);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      state.searchQuery = input.value;
      renderFilteredProducts();

      const medicinesSection = document.getElementById('medicines-section');
      if (medicinesSection) {
        medicinesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Product Card interaction: Add to Cart and Quick View Modal
 */
function setupProductCardInteractions() {
  const container = document.getElementById('product-container');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-cart');
    const card = e.target.closest('.product-card');

    if (addBtn) {
      e.stopPropagation();
      const productId = Number(addBtn.dataset.productId);
      const product = state.allMedicines.find(m => m.id === productId);

      if (product) {
        // Add to cart state
        cart.addItem(product);

        // Visual feedback on button
        const originalContent = addBtn.innerHTML;
        addBtn.innerHTML = `<span>✓ Added</span>`;
        addBtn.style.backgroundColor = 'var(--accent-hover)';
        setTimeout(() => {
          addBtn.innerHTML = originalContent;
          addBtn.style.backgroundColor = '';
        }, 1200);

        // Toast feedback
        if (product.isScheduleH1 || product.isScheduleH || product.prescriptionRequired) {
          showToast(`Added "${product.name}" to cart. Note: Schedule H/H1 Doctor's prescription (RMP) required at checkout.`, 'warning', 4500);
        } else {
          showToast(`Added "${product.name}" to cart!`, 'success');
        }
      }
      return;
    }

    // Card click triggers Quick View
    if (card) {
      const productId = Number(card.dataset.productId);
      const product = state.allMedicines.find(m => m.id === productId);
      if (product) {
        openProductQuickView(product, (p) => {
          cart.addItem(p);
          showToast(`Added "${p.name}" to cart!`, 'success');
        });
      }
    }
  });
}

/**
 * Prescription upload triggers
 */
function setupPrescriptionTriggers() {
  const triggers = document.querySelectorAll('[data-action="upload-prescription"]');
  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPrescriptionUploadModal();
    });
  });
}

/**
 * Mobile Navigation Menu
 */
function setupMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('main-nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close when clicking a nav link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomepage);
} else {
  initHomepage();
}
