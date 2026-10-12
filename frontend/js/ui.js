/**
 * ui.js: UI Component Renderer and DOM Manipulation Layer
 * Maintained by Member 1 (Soham Shinde) - Foundation, Homepage & UI Components
 * Adheres strictly to docs/API_CONTRACT.md and docs/DESIGN_SYSTEM.md
 */

/**
 * Format currency helper
 */
/**
 * Format currency helper (Indian Rupee ₹)
 */
export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Fallback SVG image for product when image URL fails to load
 */
const DEFAULT_PRODUCT_IMAGE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225" fill="%23f8fafc"><rect width="300" height="225" fill="%23f8fafc"/><rect x="85" y="45" width="130" height="135" rx="10" fill="%23ffffff" stroke="%230d9488" stroke-width="2"/><path d="M150 85v40M130 105h40" stroke="%230d9488" stroke-width="5" stroke-linecap="round"/><circle cx="150" cy="105" r="32" stroke="%230d9488" stroke-width="2" fill="none"/><text x="150" y="160" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle" font-weight="700">MEDICINE PACK</text></svg>`;

/**
 * Render Product Grid
 * Adheres strictly to docs/API_CONTRACT.md schema:
 * { id, name, brand, price, category, prescriptionRequired, description, imageUrl, stockQuantity, rating, reviewsCount }
 */
export function renderProducts(products, containerSelector = '#product-container') {
  const container = typeof containerSelector === 'string' 
    ? document.querySelector(containerSelector) 
    : containerSelector;

  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; background: #ffffff; border-radius: 16px; border: 1px dashed var(--border-color);">
        <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin: 0 auto 16px; display: block;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">No Medicines Found</h3>
        <p style="color: var(--text-light); max-width: 400px; margin: 0 auto 16px;">Try searching for generic salt names (e.g. Paracetamol, Metformin) or popular Indian brands (Dolo 650, Crocin, Becosules).</p>
        <button class="btn btn-outline-primary btn-sm" id="btn-reset-filters">View All Medicines</button>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => {
    const isRx = Boolean(product.prescriptionRequired);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 0;

    let badgeMarkup = '';
    if (product.isScheduleH1) {
      badgeMarkup += `<span class="badge badge-schedule-h" title="Schedule H1 Drug - Doctor Prescription Mandatory">Schedule H1 Rx</span>`;
    } else if (product.isScheduleH) {
      badgeMarkup += `<span class="badge badge-schedule-h" title="Schedule H Drug - Doctor Prescription Mandatory">Schedule H Rx</span>`;
    } else if (isRx) {
      badgeMarkup += `<span class="badge badge-rx" title="Doctor Prescription Required">Rx Required</span>`;
    } else if (product.isAyurvedic) {
      badgeMarkup += `<span class="badge badge-ayurvedic">100% Ayurvedic</span>`;
    } else {
      badgeMarkup += `<span class="badge badge-otc">OTC Medicine</span>`;
    }

    if (hasDiscount) {
      badgeMarkup += `<span class="badge badge-discount">-${discountPercent}% OFF</span>`;
    }

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-img-wrap">
          <img 
            src="${product.imageUrl || DEFAULT_PRODUCT_IMAGE_SVG}" 
            alt="${escapeHtml(product.name)}" 
            class="product-img"
            loading="lazy"
            onerror="this.onerror=null; this.src='${DEFAULT_PRODUCT_IMAGE_SVG}';"
          />
          <div class="product-badges">
            ${badgeMarkup}
          </div>
        </div>

        <div class="product-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="product-brand">${escapeHtml(product.brand || 'Generic')}</span>
            <span class="badge badge-category" style="font-size: 11px;">${escapeHtml(product.category)}</span>
          </div>

          <h3 class="product-title" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>
          
          <div class="product-dosage">${escapeHtml(product.dosage || 'Standard Pack')}</div>

          <div class="product-rating">
            <span>★</span>
            <span style="font-weight: 700; color: var(--text-main);">${product.rating || '4.8'}</span>
            <span class="rating-count">(${product.reviewsCount || '100+'} verified)</span>
          </div>

          <div class="product-footer">
            <div class="price-box">
              <span class="price-current">${formatCurrency(product.price)}</span>
              ${hasDiscount ? `<span class="price-original">MRP ${formatCurrency(product.originalPrice)}</span>` : ''}
            </div>

            <button 
              type="button" 
              class="btn btn-primary btn-add-cart" 
              data-product-id="${product.id}"
              aria-label="Add ${escapeHtml(product.name)} to cart"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <span>Add</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Render Categories Grid
 */
export function renderCategories(categories, containerSelector = '#categories-container', activeCategoryId = 'all') {
  const container = typeof containerSelector === 'string'
    ? document.querySelector(containerSelector)
    : containerSelector;

  if (!container || !categories) return;

  container.innerHTML = categories.map(cat => {
    const isActive = activeCategoryId !== 'all' &&
      (cat.id === activeCategoryId || cat.name.toLowerCase() === String(activeCategoryId).toLowerCase());
    return `
      <div 
        class="category-card ${isActive ? 'active' : ''}" 
        data-category-name="${escapeHtml(cat.name)}"
        data-category-id="${cat.id}"
        role="button"
        tabindex="0"
      >
        <div class="category-card-top">
          <div class="category-icon-box">
            ${cat.icon}
          </div>
          ${cat.badge ? `<span class="badge badge-category">${cat.badge}</span>` : ''}
        </div>
        <h4 class="category-name">${escapeHtml(cat.name)}</h4>
        <p class="category-desc">${escapeHtml(cat.description)}</p>
        <div class="category-footer">
          <span>${cat.itemCount}+ Products</span>
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render Trust / Value Proposition Features
 */
export function renderTrustFeatures(features, containerSelector = '#features-container') {
  const container = typeof containerSelector === 'string'
    ? document.querySelector(containerSelector)
    : containerSelector;

  if (!container || !features) return;

  container.innerHTML = features.map(item => `
    <div class="feature-item">
      <div class="feature-icon-wrap">
        ${item.icon}
      </div>
      <div class="feature-text">
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </div>
  `).join('');
}

/**
 * Render Customer Testimonials
 */
export function renderTestimonials(testimonials, containerSelector = '#testimonials-container') {
  const container = typeof containerSelector === 'string'
    ? document.querySelector(containerSelector)
    : containerSelector;

  if (!container || !testimonials) return;

  container.innerHTML = testimonials.map(item => `
    <div class="testimonial-card">
      <div style="color: #f59e0b; margin-bottom: 12px; font-size: 14px;">
        ${'★'.repeat(item.rating || 5)}
      </div>
      <p class="testimonial-quote">"${escapeHtml(item.comment)}"</p>
      <div class="testimonial-user">
        <img src="${item.avatar}" alt="${escapeHtml(item.name)}" class="testimonial-avatar" loading="lazy" />
        <div class="user-info">
          <h4>${escapeHtml(item.name)}</h4>
          <p>${escapeHtml(item.role)}</p>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render Collapsible FAQs
 */
export function renderFaqs(faqs, containerSelector = '#faq-container') {
  const container = typeof containerSelector === 'string'
    ? document.querySelector(containerSelector)
    : containerSelector;

  if (!container || !faqs) return;

  container.innerHTML = faqs.map((faq, index) => `
    <div class="faq-item ${index === 0 ? 'active' : ''}">
      <button type="button" class="faq-question">
        <span>${escapeHtml(faq.question)}</span>
        <svg class="faq-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="faq-answer">
        <p>${escapeHtml(faq.answer)}</p>
      </div>
    </div>
  `).join('');

  // Attach toggle listeners
  container.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item');
      if (parent) {
        parent.classList.toggle('active');
      }
    });
  });
}

/**
 * Loading Skeleton state
 */
export function renderLoadingSkeleton(containerSelector = '#product-container', count = 4) {
  const container = typeof containerSelector === 'string'
    ? document.querySelector(containerSelector)
    : containerSelector;

  if (!container) return;

  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="skeleton-card">
      <div style="height: 180px; background: #e2e8f0; border-radius: 8px; margin-bottom: 16px;"></div>
      <div style="height: 16px; width: 40%; background: #e2e8f0; border-radius: 4px; margin-bottom: 12px;"></div>
      <div style="height: 22px; width: 85%; background: #e2e8f0; border-radius: 4px; margin-bottom: 12px;"></div>
      <div style="height: 14px; width: 60%; background: #e2e8f0; border-radius: 4px; margin-bottom: 24px;"></div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="height: 24px; width: 70px; background: #e2e8f0; border-radius: 4px;"></div>
        <div style="height: 36px; width: 80px; background: #e2e8f0; border-radius: 8px;"></div>
      </div>
    </div>
  `).join('');
}

/**
 * Toast Notification Component
 */
export function showToast(message, type = 'success', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success' 
    ? `<svg viewBox="0 0 24 24" width="18" height="18" stroke="var(--success-color)" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>`
    : type === 'warning'
    ? `<svg viewBox="0 0 24 24" width="18" height="18" stroke="var(--warning-color)" stroke-width="2.5" fill="none"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    : `<svg viewBox="0 0 24 24" width="18" height="18" stroke="var(--primary-color)" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
      ${iconSvg}
      <span>${escapeHtml(message)}</span>
    </div>
    <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const removeToast = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  };

  toast.querySelector('.toast-close').addEventListener('click', removeToast);

  setTimeout(removeToast, duration);
}

/**
 * Update Cart Badge counter in Header
 */
export function updateCartBadge(count) {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  const numericCount = Number(count) || 0;
  badge.textContent = numericCount;
  badge.style.display = numericCount > 0 ? 'flex' : 'none';
}

/**
 * Reusable Modal Component
 */
export function openModal({ title = 'Information', bodyHtml = '', footerButtons = [] } = {}) {
  let backdrop = document.getElementById('global-modal-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'global-modal-backdrop';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title" id="global-modal-title"></h3>
          <button type="button" class="modal-close" id="global-modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body" id="global-modal-body"></div>
        <div class="modal-footer" id="global-modal-footer"></div>
      </div>
    `;
    document.body.appendChild(backdrop);

    // Event listeners to close
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
    backdrop.querySelector('#global-modal-close').addEventListener('click', closeModal);
  }

  document.getElementById('global-modal-title').textContent = title;
  document.getElementById('global-modal-body').innerHTML = bodyHtml;

  const footer = document.getElementById('global-modal-footer');
  footer.innerHTML = '';

  if (footerButtons.length === 0) {
    const defaultCloseBtn = document.createElement('button');
    defaultCloseBtn.className = 'btn btn-outline btn-sm';
    defaultCloseBtn.textContent = 'Close';
    defaultCloseBtn.onclick = closeModal;
    footer.appendChild(defaultCloseBtn);
  } else {
    footerButtons.forEach(btnConfig => {
      const btn = document.createElement('button');
      btn.className = btnConfig.className || 'btn btn-primary btn-sm';
      btn.textContent = btnConfig.text;
      btn.onclick = () => {
        if (btnConfig.onClick) btnConfig.onClick();
        if (btnConfig.closeOnClick !== false) closeModal();
      };
      footer.appendChild(btn);
    });
  }

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Close Modal
 */
export function closeModal() {
  const backdrop = document.getElementById('global-modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/**
 * Quick View Product Detail Modal
 */
/**
 * Quick View Product Detail Modal
 */
export function openProductQuickView(product, onAddToCart) {
  const isRx = Boolean(product.prescriptionRequired || product.isScheduleH || product.isScheduleH1);
  const bodyHtml = `
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; align-items: start;">
      <div style="border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color); background: radial-gradient(circle at center, #ffffff 40%, #f8fafc 100%); padding: 18px; display: flex; align-items: center; justify-content: center; height: 250px;">
        <img 
          src="${product.imageUrl || DEFAULT_PRODUCT_IMAGE_SVG}" 
          alt="${escapeHtml(product.name)}" 
          style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));"
          onerror="this.src='${DEFAULT_PRODUCT_IMAGE_SVG}';"
        />
      </div>
      <div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
          ${product.isScheduleH1 ? `<span class="badge badge-schedule-h">Schedule H1 Rx</span>` : ''}
          ${product.isScheduleH ? `<span class="badge badge-schedule-h">Schedule H Rx</span>` : ''}
          ${!product.isScheduleH && !product.isScheduleH1 && isRx ? `<span class="badge badge-rx">Rx Required</span>` : ''}
          ${product.isAyurvedic ? `<span class="badge badge-ayurvedic">100% Ayurvedic</span>` : ''}
          ${!isRx && !product.isAyurvedic ? `<span class="badge badge-otc">OTC Medicine</span>` : ''}
          <span class="badge badge-category">${escapeHtml(product.category)}</span>
        </div>
        <p style="font-size: 12px; font-weight: 700; color: var(--primary-color); text-transform: uppercase; margin-bottom: 4px;">${escapeHtml(product.brand)}</p>
        <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); line-height: 1.3; margin-bottom: 6px;">${escapeHtml(product.name)}</h4>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Packaging: ${escapeHtml(product.dosage || 'Standard Pack')}</p>
        <p style="font-size: 14px; color: var(--text-light); line-height: 1.6; margin-bottom: 16px;">${escapeHtml(product.description)}</p>
        
        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px;">
          <span style="font-size: 1.75rem; font-weight: 800; color: var(--text-main);">${formatCurrency(product.price)}</span>
          ${product.originalPrice ? `<span style="font-size: 14px; color: var(--text-muted); text-decoration: line-through;">MRP ${formatCurrency(product.originalPrice)}</span>` : ''}
        </div>

        ${isRx ? `
          <div style="padding: 12px 14px; background: #fee2e2; border-left: 4px solid #dc2626; border-radius: 6px; font-size: 12px; color: #991b1b; margin-bottom: 16px; line-height: 1.5;">
            <strong>⚠️ Schedule H/H1 Regulatory Warning:</strong> In compliance with the Drugs and Cosmetics Act (Govt. of India), this medicine requires a valid prescription from a Registered Medical Practitioner (RMP).
          </div>
        ` : ''}
      </div>
    </div>
  `;

  openModal({
    title: product.name,
    bodyHtml,
    footerButtons: [
      {
        text: 'Close',
        className: 'btn btn-outline btn-sm',
        onClick: closeModal
      },
      {
        text: `Add to Cart • ${formatCurrency(product.price)}`,
        className: 'btn btn-primary btn-sm',
        onClick: () => {
          if (onAddToCart) onAddToCart(product);
        }
      }
    ]
  });
}

/**
 * Prescription Upload Modal (Indian Market Compliant)
 */
export function openPrescriptionUploadModal(onUploadSuccess) {
  const bodyHtml = `
    <div style="text-align: center;">
      <p style="font-size: 14px; color: var(--text-light); margin-bottom: 16px; line-height: 1.5;">
        Upload a clear photo or PDF scan of your doctor's valid prescription (RMP). Our certified pharmacists will verify the dosage before preparing your order.
      </p>

      <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 16px;">
        <span class="badge" style="background: #e0f2fe; color: #0369a1; font-size: 11px;">✓ PCI Certified Review</span>
        <span class="badge" style="background: #dcfce7; color: #166534; font-size: 11px;">✓ Govt. Drugs Act Compliant</span>
        <span class="badge" style="background: #f1f5f9; color: #475569; font-size: 11px;">✓ 100% Confidential</span>
      </div>

      <div id="rx-dropzone" style="border: 2px dashed var(--primary-color); border-radius: 12px; padding: 28px 16px; background: var(--primary-subtle); cursor: pointer; transition: all 0.2s;">
        <svg viewBox="0 0 24 24" width="44" height="44" stroke="var(--primary-color)" stroke-width="2" fill="none" style="margin: 0 auto 12px; display: block;">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Click to select prescription or drag & drop</p>
        <p style="font-size: 12px; color: var(--text-muted);">Supports PNG, JPG, JPEG, PDF up to 10MB</p>
        <input type="file" id="rx-file-input" accept="image/*,application/pdf" style="display: none;" />
      </div>

      <div id="rx-preview-box" style="display: none; margin-top: 16px; padding: 12px; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-color); text-align: left; align-items: center; gap: 12px;">
        <span style="font-size: 20px;">📄</span>
        <div style="flex: 1; overflow: hidden;">
          <p id="rx-filename" style="font-weight: 700; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"></p>
          <span style="font-size: 11px; color: var(--success-color); font-weight: 600;">✓ Ready for Registered Pharmacist review</span>
        </div>
      </div>
    </div>
  `;

  openModal({
    title: 'Upload Doctor Prescription (RMP)',
    bodyHtml,
    footerButtons: [
      {
        text: 'Cancel',
        className: 'btn btn-outline btn-sm',
        onClick: closeModal
      },
      {
        text: 'Submit to Pharmacist',
        className: 'btn btn-primary btn-sm',
        onClick: () => {
          const fileInput = document.getElementById('rx-file-input');
          const file = fileInput?.files?.[0];
          if (!file) {
            showToast('Please select a prescription file first', 'warning');
            return false;
          }
          showToast(`Prescription "${file.name}" received! Our pharmacist will review it within 10 minutes.`, 'success');
          if (onUploadSuccess) onUploadSuccess(file);
        }
      }
    ]
  });

  // Attach dropzone listeners
  setTimeout(() => {
    const dropzone = document.getElementById('rx-dropzone');
    const fileInput = document.getElementById('rx-file-input');
    const previewBox = document.getElementById('rx-preview-box');
    const filenameLabel = document.getElementById('rx-filename');

    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();
      fileInput.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          filenameLabel.textContent = file.name;
          previewBox.style.display = 'flex';
          dropzone.style.borderColor = 'var(--accent-color)';
        }
      };
    }
  }, 50);
}

/**
 * HTML Escaper utility to prevent XSS
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
