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
 * Check if user is logged in and update header login/profile button
 */
function checkAuthState() {
  let userData = JSON.parse(sessionStorage.getItem('userData'));
  const authToken = sessionStorage.getItem('authToken');
  const userName = sessionStorage.getItem('userName');

  if (!userData && (authToken || userName)) {
    userData = {
      name: userName || 'Ashish Sharma',
      phone: sessionStorage.getItem('userPhone') || '9876543210',
      email: sessionStorage.getItem('userEmail') || 'ashish.sharma@example.com'
    };
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }

  const profileBtn = document.querySelector('.profile-btn') || document.querySelector('a[href="pages/login.html"]');
  if (!profileBtn) return;

  if (userData && userData.name) {
    const firstName = userData.name.split(' ')[0];
    profileBtn.title = 'View your profile and orders';
    profileBtn.innerHTML = `
      <span style="font-size: 14px; margin-right: 4px;">👤</span>
      <span>${firstName}</span>
    `;
  } else {
    profileBtn.title = 'Please login or sign up';
    profileBtn.innerHTML = `
      <span style="font-size: 14px; margin-right: 4px;">👤</span>
      <span>Profile</span>
    `;
  }
}

/**
 * Initialize Homepage
 */
async function initHomepage() {
  // Remove active state from nav links on homepage
  cleanupNavActiveState();

  // Sync initial cart badge
  updateCartBadge(cart.getCount());

  // Listen to cart state changes
  window.addEventListener('cart:updated', (e) => {
    updateCartBadge(e.detail.count);
  });

  // Setup mobile navigation toggle
  setupMobileNav();

  // Setup cart button to go to checkout
  setupCartButton();

  // Check auth state for header button
  checkAuthState();

  // Setup Prescription upload modal triggers
  setupPrescriptionTriggers();

  // Setup Profile button authentication check
  setupProfileButton();

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

      // Check if user is logged in
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      if (!userData || !userData.phone) {
        showToast('Please login or signup first to add items to cart', 'warning');

        // Show redirect dialog with countdown
        showRedirectDialog('Login Required', 'Redirecting to login page...', 'pages/login.html', 5500);
        return;
      }

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
      // Check if user is logged in before showing quick view
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      if (!userData || !userData.phone) {
        showToast('Please login or signup first to add items to cart', 'warning');

        // Show redirect dialog with countdown
        showRedirectDialog('Login Required', 'Redirecting to login page...', 'pages/login.html', 5500);
        return;
      }

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
 * Show redirect dialog with countdown
 */
function showRedirectDialog(title, message, redirectUrl, delayMs) {
  // Remove existing redirect dialog if any
  const existing = document.getElementById('redirect-dialog-overlay');
  if (existing) existing.remove();

  // If redirecting to login, ensure cart is cleared on logout
  if (redirectUrl.includes('login.html')) {
    const originalGoNowBtn = document.getElementById('redirect-now-btn');
    if (originalGoNowBtn) {
      originalGoNowBtn.addEventListener('click', () => {
        localStorage.removeItem('cart');
        localStorage.removeItem('orderHistory');
      });
    }
  }

  const overlay = document.createElement('div');
  overlay.id = 'redirect-dialog-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
  `;

  const remaining = document.createElement('div');
  remaining.id = 'redirect-countdown';
  remaining.textContent = Math.ceil(delayMs / 1000);

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: white;
    border-radius: 16px;
    padding: 40px;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease-out;
  `;
  dialog.innerHTML = `
    <div style="margin-bottom: 24px;">
      <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--primary-color)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto; display: block;">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm.5-8H9v-2h3.5v5z"></path>
      </svg>
    </div>
    <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 12px 0; color: var(--text-main);">${title}</h2>
    <p style="font-size: 14px; color: var(--text-light); margin: 0 0 24px 0;">${message}</p>
    <div style="display: flex; gap: 12px; align-items: center; justify-content: center; margin-bottom: 24px;">
      <div style="
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
        color: white;
        min-width: 60px;
      " id="redirect-countdown">5</div>
      <span style="font-size: 14px; color: var(--text-light);">seconds</span>
    </div>
    <button type="button" style="
      width: 100%;
      padding: 12px 24px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    " id="redirect-now-btn">Go to Login Now</button>
  `;

  dialog.style.animation = 'slideUp 0.3s ease-out';
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Countdown timer
  let remainingMs = delayMs;
  const countdownInterval = setInterval(() => {
    remainingMs -= 100;
    const seconds = Math.ceil(remainingMs / 1000);
    const countdownEl = document.getElementById('redirect-countdown');
    if (countdownEl) {
      countdownEl.textContent = Math.max(0, seconds);
    }

    if (remainingMs <= 0) {
      clearInterval(countdownInterval);
      window.location.href = redirectUrl;
    }
  }, 100);

  // "Go Now" button click
  const goNowBtn = dialog.querySelector('#redirect-now-btn');
  if (goNowBtn) {
    goNowBtn.addEventListener('click', () => {
      clearInterval(countdownInterval);
      window.location.href = redirectUrl;
    });
  }
}

/**
 * Cart button click handler - navigate to checkout
 */
function setupCartButton() {
  const cartBtn = document.getElementById('btn-cart');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      window.location.href = 'pages/checkout.html';
    });
  }
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

/**
 * Remove active state from nav links on homepage
 * Nav links should only be highlighted when navigating between different pages
 */
function cleanupNavActiveState() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
}

// Setup Profile button after homepage initialization
function setupProfileButton() {
  const profileBtn = document.querySelector('.profile-btn') || document.querySelector('a[href="pages/login.html"]');
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Check if user is logged in
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      if (!userData || !userData.name) {
        // Show redirect dialog with countdown - only if function exists
        if (typeof showRedirectDialog === 'function') {
          showRedirectDialog(
            'Login Required',
            'Redirecting to login page to view your profile...',
            'pages/login.html',
            5000
          );
        } else {
          showToast('Please login or sign up to view your profile', 'warning');
          setTimeout(() => window.location.href = 'pages/login.html', 1500);
        }
        return;
      }

      // User is logged in, navigate to profile page
      window.location.href = 'pages/profile.html';
    });
  }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomepage);
} else {
  // Ensure auth state is set before initHomepage runs
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  if (!userData || !userData.name) {
    // Redirect to login if user is not authenticated
    window.location.href = 'pages/login.html';
  } else {
    initHomepage();
  }
}
