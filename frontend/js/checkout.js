/**
 * checkout.js: Complete checkout flow logic for 4-step checkout process
 * Manages: Cart Review → Address → Payment & Coupon → Confirmation
 * Uses mock data and sessionStorage for user data from auth module
 */

import { cart } from './cart.js';
import { mockMedicines } from './data.js';
import { showToast } from './ui.js';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Resolve image paths for subpages
 * Converts ./images/... to ../images/... when on subpages like pages/checkout.html
 */
function resolveImagePath(imagePath) {
  if (!imagePath) return imagePath;

  // If it's a data URL (SVG or fallback), return as-is
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }

  // If it's an absolute URL, return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Check if we're on a subpage (pages/ directory)
  const currentPath = window.location.pathname;
  const isSubpage = currentPath.includes('/pages/');

  // If on subpage and path starts with ./images/, convert to ../images/
  if (isSubpage && imagePath.startsWith('./images/')) {
    return imagePath.replace('./images/', '../images/');
  }

  return imagePath;
}

// ============================================================================
// STATE MANAGEMENT: Central checkout state object
// ============================================================================

/**
 * Main checkout state object - holds all data across steps
 * Persists address/payment info in sessionStorage for recovery
 */
const checkoutState = {
  currentStep: 'cart', // 'cart' | 'address' | 'payment' | 'confirmation'

  // Cart items with quantities
  cartItems: [],

  // Address fields
  address: {
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pinCode: ''
  },

  // Payment info
  paymentMethod: 'cod', // 'upi' | 'card' | 'netbanking' | 'cod'
  couponCode: '',

  // Totals calculation
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,

  // Order confirmation
  orderNumber: '',
  orderDate: new Date(),

  /**
   * Initialize state from cart and sessionStorage
   */
  init() {
    // Load cart items
    const cartItems = cart.getItems();
    if (cartItems.length === 0) {
      showToast('Your cart is empty. Redirecting to home...', 'warning');
      setTimeout(() => window.location.href = '../index.html', 2000);
      return;
    }

    this.cartItems = cartItems;
    this.calculateTotals();

    // Load user data from sessionStorage (set by auth module)
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
    if (userData.name) this.address.fullName = userData.name;
    if (userData.phone) this.address.phone = userData.phone;

    // Load saved address if available
    const savedAddress = JSON.parse(sessionStorage.getItem('savedAddress')) || {};
    if (savedAddress.fullName) {
      Object.assign(this.address, savedAddress);
    }
  },

  /**
   * Calculate totals: subtotal, tax (5%), shipping (FREE), discount
   */
  calculateTotals() {
    // Subtotal = sum of (price * quantity) for all items
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const medicine = mockMedicines.find(m => m.id === item.id);
      return sum + ((medicine?.price || 0) * (item.quantity || 1));
    }, 0);

    // Tax at 5% (Indian GST approximation)
    this.tax = this.subtotal * 0.05;

    // Shipping: FREE for orders (standard delivery)
    this.shipping = 0;

    // Total with discount applied
    this.total = this.subtotal + this.tax - this.discount;
  },

  /**
   * Save checkout state to sessionStorage for recovery
   */
  save() {
    sessionStorage.setItem('checkoutState', JSON.stringify({
      address: this.address,
      paymentMethod: this.paymentMethod,
      couponCode: this.couponCode,
      subtotal: this.subtotal,
      tax: this.tax,
      discount: this.discount,
      total: this.total
    }));
  }
};

// ============================================================================
// MOCK COUPON DATABASE
// ============================================================================

const mockCoupons = {
  'SAVE10': {
    code: 'SAVE10',
    description: '10% off on order',
    discountType: 'percentage',
    discountValue: 10,
    minAmount: 0
  },
  'FIRST20': {
    code: 'FIRST20',
    description: '₹200 off on first order',
    discountType: 'fixed',
    discountValue: 200,
    minAmount: 500
  },
  'SUMMER50': {
    code: 'SUMMER50',
    description: '₹50 off on order above ₹1000',
    discountType: 'fixed',
    discountValue: 50,
    minAmount: 1000
  }
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate full name: 3-50 chars, letters and space only
 */
function validateFullName(name) {
  const nameRegex = /^[a-zA-Z\s]{3,50}$/;
  return nameRegex.test(name.trim());
}

/**
 * Validate Indian phone: 10 digits, must start with 6-9
 */
function validatePhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validate street address: 5-100 chars
 */
function validateStreet(street) {
  return street.trim().length >= 5 && street.trim().length <= 100;
}

/**
 * Validate city: 2-50 chars
 */
function validateCity(city) {
  const cityRegex = /^[a-zA-Z\s]{2,50}$/;
  return cityRegex.test(city.trim());
}

/**
 * Validate state: must be selected
 */
function validateState(state) {
  return state.trim().length > 0;
}

/**
 * Validate PIN code: exactly 6 digits, range 100000-999999
 */
function validatePinCode(pinCode) {
  const pinRegex = /^\d{6}$/;
  const isValid = pinRegex.test(pinCode);
  const pinNum = parseInt(pinCode);
  return isValid && pinNum >= 100000 && pinNum <= 999999;
}

/**
 * Validate entire address form
 */
function validateAddress() {
  const errors = {};
  const fullName = document.getElementById('full-name').value;
  const phone = document.getElementById('phone').value;
  const street = document.getElementById('street').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const pinCode = document.getElementById('pin-code').value;

  if (!validateFullName(fullName)) {
    errors.fullName = 'Name must be 3-50 characters, letters and spaces only';
  }

  if (!validatePhone(phone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number (start with 6-9)';
  }

  if (!validateStreet(street)) {
    errors.street = 'Street address must be 5-100 characters';
  }

  if (!validateCity(city)) {
    errors.city = 'City must be 2-50 characters, letters only';
  }

  if (!validateState(state)) {
    errors.state = 'Please select a state';
  }

  if (!validatePinCode(pinCode)) {
    errors.pinCode = 'Enter a valid 6-digit PIN code (100000-999999)';
  }

  return errors;
}

/**
 * Validate coupon code against mock database
 */
function validateCoupon(code) {
  const coupon = mockCoupons[code.toUpperCase()];

  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code' };
  }

  if (checkoutState.subtotal < coupon.minAmount) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${coupon.minAmount} required for this coupon`
    };
  }

  return { valid: true, coupon };
}

// ============================================================================
// FORMATTING & UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency as ₹XXX.XX (Indian Rupee)
 */
function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Generate order number: MED + timestamp
 * Example: MED2026110157 (year, month, day, hour, minute in 2-digit format)
 */
function generateOrderNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `MED${year}${month}${day}${hours}${minutes}`;
}

/**
 * Calculate estimated delivery: today + 2-3 business days
 * (simplified: +3 days, excluding weekends check)
 */
function calculateEstimatedDelivery() {
  const today = new Date();
  const deliveryDate = new Date(today);

  // Add 3 days (simplified business day calculation)
  let daysAdded = 0;
  while (daysAdded < 3) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const day = deliveryDate.getDay();
    // Skip if Sunday (0) or Saturday (6)
    if (day !== 0 && day !== 6) {
      daysAdded++;
    }
  }

  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return deliveryDate.toLocaleDateString('en-IN', options);
}

/**
 * Format order date: "01 Nov 2026, 5:30 AM"
 */
function formatOrderDate(date) {
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleDateString('en-IN', options);
}

// ============================================================================
// RENDER FUNCTIONS: Update UI for each step
// ============================================================================

/**
 * Render cart items in Step 1
 */
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (checkoutState.cartItems.length === 0) {
    container.innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  container.innerHTML = checkoutState.cartItems.map((item, index) => {
    const medicine = mockMedicines.find(m => m.id === item.id);
    if (!medicine) return '';

    const itemTotal = medicine.price * (item.quantity || 1);
    const imagePath = resolveImagePath(medicine.imageUrl);

    return `
      <div class="cart-item" data-item-index="${index}">
        <div class="item-image">
          <img src="${imagePath}" alt="${medicine.name}" />
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-name">${medicine.name}</h4>
          <p class="cart-item-brand">${medicine.brand}</p>
          <p style="font-size: 12px; color: var(--text-light);">${formatCurrency(medicine.price)} per unit</p>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-adjuster">
            <button type="button" class="qty-btn qty-minus" data-item-index="${index}" aria-label="Decrease quantity">−</button>
            <span class="qty-display">${item.quantity || 1}</span>
            <button type="button" class="qty-btn qty-plus" data-item-index="${index}" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-item-price">
            <span style="font-weight: 700; color: var(--text-main);">${formatCurrency(itemTotal)}</span>
            <button type="button" class="btn-remove-item" data-item-index="${index}" aria-label="Remove item" style="color: var(--danger-color); background: none; border: none; font-size: 12px; font-weight: 600; cursor: pointer; padding: 4px 8px;">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateCartTotals();
}

/**
 * Update totals display in Step 1
 */
function updateCartTotals() {
  document.getElementById('subtotal').textContent = formatCurrency(checkoutState.subtotal);
  document.getElementById('tax').textContent = formatCurrency(checkoutState.tax);
  document.getElementById('shipping').textContent = 'FREE';
  document.getElementById('total').textContent = formatCurrency(checkoutState.total);
}

/**
 * Update order summary in Step 3 (Payment)
 */
function updatePaymentSummary() {
  document.getElementById('summary-subtotal').textContent = formatCurrency(checkoutState.subtotal);
  document.getElementById('summary-tax').textContent = formatCurrency(checkoutState.tax);
  document.getElementById('summary-shipping').textContent = 'FREE';
  document.getElementById('summary-discount').textContent = `-${formatCurrency(checkoutState.discount)}`;
  document.getElementById('summary-total').textContent = formatCurrency(checkoutState.total);
}

/**
 * Render confirmation step details
 */
function renderConfirmation() {
  // Order number and date
  document.getElementById('order-number').textContent = checkoutState.orderNumber;
  document.getElementById('order-date').textContent = formatOrderDate(checkoutState.orderDate);
  document.getElementById('estimated-delivery').textContent = calculateEstimatedDelivery();

  // Delivery address
  const deliveryAddress = document.getElementById('delivery-summary');
  if (deliveryAddress) {
    deliveryAddress.innerHTML = `
      <div class="address-block">
        <p><strong>${checkoutState.address.fullName}</strong></p>
        <p>${checkoutState.address.street}</p>
        <p>${checkoutState.address.city}, ${checkoutState.address.state} ${checkoutState.address.pinCode}</p>
        <p class="phone-text">📱 ${checkoutState.address.phone}</p>
      </div>
    `;
  }

  // Final totals
  const itemsText = `${checkoutState.cartItems.length} medicine${checkoutState.cartItems.length > 1 ? 's' : ''}`;
  document.getElementById('items-count').textContent = itemsText;
  document.getElementById('final-total').textContent = formatCurrency(checkoutState.total);
  document.getElementById('final-payment-method').textContent =
    checkoutState.paymentMethod === 'upi' ? 'UPI' :
    checkoutState.paymentMethod === 'card' ? 'Debit/Credit Card' :
    checkoutState.paymentMethod === 'netbanking' ? 'Net Banking' :
    'Cash on Delivery';
}

// ============================================================================
// STEP NAVIGATION & TRANSITION
// ============================================================================

/**
 * Transition to a new step with validation
 */
function transitionToStep(stepName) {
  const validSteps = ['cart', 'address', 'payment', 'confirmation'];
  if (!validSteps.includes(stepName)) return;

  // Hide all steps
  document.querySelectorAll('.checkout-step').forEach(step => {
    step.classList.remove('active');
  });

  // Show target step
  const targetStep = document.getElementById(`${stepName}-step`);
  if (targetStep) {
    targetStep.classList.add('active');
  }

  // Update step indicator
  document.querySelectorAll('.step-item').forEach(item => {
    item.classList.remove('active', 'completed');
    const itemStep = item.dataset.step;

    if (itemStep === stepName) {
      item.classList.add('active');
    } else if (validSteps.indexOf(itemStep) < validSteps.indexOf(stepName)) {
      item.classList.add('completed');
    }
  });

  checkoutState.currentStep = stepName;
  checkoutState.save();

  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================================

/**
 * Initialize checkout on page load
 */
function initCheckout() {
  checkoutState.init();
  renderCartItems();
  updatePaymentSummary();

  // ========== CART STEP ==========

  // Quantity +/- buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('qty-plus')) {
      const index = parseInt(e.target.dataset.itemIndex);
      checkoutState.cartItems[index].quantity = (checkoutState.cartItems[index].quantity || 1) + 1;
      checkoutState.calculateTotals();
      renderCartItems();
      showToast('Quantity updated', 'success');
    }

    if (e.target.classList.contains('qty-minus')) {
      const index = parseInt(e.target.dataset.itemIndex);
      if ((checkoutState.cartItems[index].quantity || 1) > 1) {
        checkoutState.cartItems[index].quantity = (checkoutState.cartItems[index].quantity || 1) - 1;
        checkoutState.calculateTotals();
        renderCartItems();
        showToast('Quantity updated', 'success');
      }
    }

    // Remove item button
    if (e.target.classList.contains('btn-remove-item')) {
      const index = parseInt(e.target.dataset.itemIndex);
      const removedItem = checkoutState.cartItems[index];

      // Remove from checkout state
      checkoutState.cartItems.splice(index, 1);

      // Remove from cart module (localStorage) to sync with homepage
      if (removedItem) {
        const cartItems = cart.getItems();
        const cartIndex = cartItems.findIndex(item =>
          item.id === removedItem.id && item.name === removedItem.name
        );
        if (cartIndex !== -1) {
          cartItems.splice(cartIndex, 1);
          cart.items = cartItems;
          cart.save();
        }
      }

      if (checkoutState.cartItems.length === 0) {
        showToast('Cart is empty. Redirecting...', 'warning');
        setTimeout(() => window.location.href = '../index.html', 2000);
      } else {
        checkoutState.calculateTotals();
        renderCartItems();
        showToast('Item removed from cart', 'success');
      }
    }
  });

  // Continue from Cart → Address
  const cartContinueBtn = document.getElementById('cart-continue');
  if (cartContinueBtn) {
    cartContinueBtn.addEventListener('click', () => {
      if (checkoutState.cartItems.length === 0) {
        showToast('Please add at least 1 item to cart', 'warning');
        return;
      }
      transitionToStep('address');
    });
  }

  // ========== ADDRESS STEP ==========

  // Back from Address → Cart
  const addressBackBtn = document.getElementById('address-back');
  if (addressBackBtn) {
    addressBackBtn.addEventListener('click', () => {
      transitionToStep('cart');
    });
  }

  // Continue from Address → Payment
  const addressContinueBtn = document.getElementById('address-continue');
  if (addressContinueBtn) {
    addressContinueBtn.addEventListener('click', () => {
      const errors = validateAddress();

      // Clear all previous errors
      document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

      if (Object.keys(errors).length > 0) {
        // Map field names to error element IDs
        const fieldToErrorId = {
          'fullName': 'error-full-name',
          'phone': 'error-phone',
          'street': 'error-street',
          'city': 'error-city',
          'state': 'error-state',
          'pinCode': 'error-pin-code'
        };

        // Show errors
        for (const [field, message] of Object.entries(errors)) {
          const errorElId = fieldToErrorId[field];
          const errorEl = document.getElementById(errorElId);
          if (errorEl) {
            errorEl.textContent = message;
          }
        }
        showToast('Please fix the errors in the form', 'warning');
        return;
      }

      // Save address to state
      checkoutState.address.fullName = document.getElementById('full-name').value;
      checkoutState.address.phone = document.getElementById('phone').value;
      checkoutState.address.street = document.getElementById('street').value;
      checkoutState.address.city = document.getElementById('city').value;
      checkoutState.address.state = document.getElementById('state').value;
      checkoutState.address.pinCode = document.getElementById('pin-code').value;

      // Save to sessionStorage if checkbox is checked
      if (document.getElementById('save-address').checked) {
        sessionStorage.setItem('savedAddress', JSON.stringify(checkoutState.address));
      }

      transitionToStep('payment');
    });
  }

  // ========== PAYMENT STEP ==========

  // Apply coupon button
  const applyCouponBtn = document.getElementById('apply-coupon');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      const couponCodeInput = document.getElementById('coupon-code');
      const code = couponCodeInput.value.trim();

      if (!code) {
        showToast('Please enter a coupon code', 'warning');
        return;
      }

      const validation = validateCoupon(code);
      const errorEl = document.getElementById('error-coupon');
      const successEl = document.getElementById('success-coupon');

      if (!validation.valid) {
        errorEl.textContent = validation.message;
        successEl.textContent = '';
        showToast(validation.message, 'warning');
        return;
      }

      // Apply coupon
      checkoutState.couponCode = code;
      const coupon = validation.coupon;

      if (coupon.discountType === 'percentage') {
        checkoutState.discount = (checkoutState.subtotal * coupon.discountValue) / 100;
      } else {
        checkoutState.discount = coupon.discountValue;
      }

      checkoutState.calculateTotals();
      updatePaymentSummary();

      errorEl.textContent = '';
      successEl.textContent = `✓ Coupon applied! You save ${formatCurrency(checkoutState.discount)}`;
      couponCodeInput.disabled = true;
      applyCouponBtn.disabled = true;

      showToast(`Coupon "${code}" applied successfully!`, 'success');
    });
  }

  // Back from Payment → Address
  const paymentBackBtn = document.getElementById('payment-back');
  if (paymentBackBtn) {
    paymentBackBtn.addEventListener('click', () => {
      transitionToStep('address');
    });
  }

  // Place Order button (Payment → Confirmation)
  const placeOrderBtn = document.getElementById('place-order');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked');

      if (!paymentMethod) {
        showToast('Please select a payment method', 'warning');
        return;
      }

      checkoutState.paymentMethod = paymentMethod.value;
      checkoutState.orderNumber = generateOrderNumber();
      checkoutState.orderDate = new Date();

      // Clear cart in localStorage
      cart.items = [];
      cart.save();

      // Render confirmation details
      renderConfirmation();
      transitionToStep('confirmation');

      showToast('Order placed successfully!', 'success');
    });
  }

  // ========== CONFIRMATION STEP ==========

  // Track Order button
  const trackOrderBtn = document.getElementById('track-order');
  if (trackOrderBtn) {
    trackOrderBtn.addEventListener('click', () => {
      showToast('Redirecting to order tracking...', 'info');
      // In real app, would navigate to tracking page
      setTimeout(() => window.location.href = '../index.html', 1500);
    });
  }

  // Continue Shopping button
  const continueShoppingBtn = document.getElementById('continue-shopping');
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }
}

// ============================================================================
// PAGE INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', initCheckout);
