/**
 * checkout.js: Complete checkout flow logic for 4-step checkout process
 * Manages: Cart Review → Address → Payment & Coupon → Confirmation
 * Uses mock data and sessionStorage for user data from auth module
 */

import { cart } from './cart.js';
import { mockMedicines } from './data.js';
import { showToast, openModal, closeModal } from './ui.js';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function resolveImagePath(imagePath) {
  if (!imagePath) return imagePath;
  if (imagePath.startsWith('data:')) return imagePath;
  if (imagePath.startsWith('http')) return imagePath;

  const currentPath = window.location.pathname;
  const isSubpage = currentPath.includes('/pages/');

  if (isSubpage && imagePath.startsWith('./images/')) {
    return imagePath.replace('./images/', '../images/');
  }
  return imagePath;
}

function checkPrescriptionRequired() {
  return checkoutState.cartItems.some(item => {
    const medicine = mockMedicines.find(m => m.id === item.id);
    return medicine?.prescriptionRequired === true;
  });
}

// ============================================================================
// STATE MANAGEMENT: Central checkout state object
// ============================================================================

const checkoutState = {
  currentStep: 'cart', 
  cartItems: [],
  address: { fullName: '', phone: '', street: '', city: '', state: '', pinCode: '' },
  paymentMethod: 'cod',
  couponCode: '',
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  orderNumber: '',
  orderDate: new Date(),

  /**
   * Foolproof empty cart handler
   */
  handleEmptyCart() {
    // 1. Show a Toast immediately
    showToast('Your cart is empty. Redirecting to home...', 'warning');

    // 2. Show a Modal for high visibility
    openModal({
      title: 'Empty Cart',
      bodyHtml: '<p style="text-align: center; font-size: 15px; color: var(--text-light);">Your shopping cart is currently empty. We are redirecting you back to the store so you can find your medicines.</p>',
      footerButtons: [
        {
          text: 'Go to Home Now',
          className: 'btn btn-primary btn-sm',
          onClick: () => { window.location.href = '../index.html'; }
        }
      ]
    });

    // 3. Forced redirection after 3 seconds
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 3000);
  },

  init() {
    const cartItems = cart.getItems();
    this.cartItems = cartItems;
    
    if (this.cartItems.length === 0) {
      this.handleEmptyCart();
      return false;
    }

    this.calculateTotals();

    const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
    if (userData.name) this.address.fullName = userData.name;
    if (userData.phone) this.address.phone = userData.phone;

    const savedAddress = JSON.parse(sessionStorage.getItem('savedAddress')) || {};
    if (savedAddress.fullName) {
      Object.assign(this.address, savedAddress);
    }
    return true;
  },

  calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const medicine = mockMedicines.find(m => m.id === item.id);
      return sum + ((medicine?.price || 0) * (item.quantity || 1));
    }, 0);
    this.tax = this.subtotal * 0.05;
    this.shipping = 0;
    this.total = this.subtotal + this.tax - this.discount;
  },

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
  'SAVE10': { code: 'SAVE10', description: '10% off on order', discountType: 'percentage', discountValue: 10, minAmount: 0 },
  'FIRST20': { code: 'FIRST20', description: '₹200 off on first order', discountType: 'fixed', discountValue: 200, minAmount: 500 },
  'SUMMER50': { code: 'SUMMER50', description: '₹50 off on order above ₹1000', discountType: 'fixed', discountValue: 50, minAmount: 1000 }
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateFullName(name) { return /^[a-zA-Z\s]{3,50}$/.test(name.trim()); }
function validatePhone(phone) { return /^[6-9]\d{9}$/.test(phone.trim()); }
function validateStreet(street) { return street.trim().length >= 5 && street.trim().length <= 100; }
function validateCity(city) { return /^[a-zA-Z\s]{2,50}$/.test(city.trim()); }
function validateState(state) { return state.trim().length > 0; }
function validatePinCode(pinCode) {
  const pinRegex = /^\d{6}$/;
  if (!pinRegex.test(pinCode)) return false;
  const pinNum = parseInt(pinCode);
  return pinNum >= 100000 && pinNum <= 999999;
}

function validatePrescription() {
  if (!checkPrescriptionRequired()) return { valid: true };
  const fileInput = document.getElementById('prescription-file');
  if (!fileInput || fileInput.files.length === 0) {
    return { valid: false, message: 'Please upload a valid doctor\'s prescription' };
  }
  return { valid: true };
}

function validateAddress() {
  const errors = {};
  const fullName = document.getElementById('full-name').value;
  const phone = document.getElementById('phone').value;
  const street = document.getElementById('street').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const pinCode = document.getElementById('pin-code').value;

  if (!validateFullName(fullName)) errors.fullName = 'Name must be 3-50 characters, letters and spaces only';
  if (!validatePhone(phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number (start with 6-9)';
  if (!validateStreet(street)) errors.street = 'Street address must be 5-100 characters';
  if (!validateCity(city)) errors.city = 'City must be 2-50 characters, letters only';
  if (!validateState(state)) errors.state = 'Please select a state';
  if (!validatePinCode(pinCode)) errors.pinCode = 'Enter a valid 6-digit PIN code (100000-999999)';

  return errors;
}

function validateCoupon(code) {
  const coupon = mockCoupons[code.toUpperCase()];
  if (!coupon) return { valid: false, message: 'Invalid coupon code' };
  if (checkoutState.subtotal < coupon.minAmount) {
    return { valid: false, message: \`Minimum order amount of ₹\${coupon.minAmount} required for this coupon\` };
  }
  return { valid: true, coupon };
}

// ============================================================================
// FORMATTING & UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount) {
  return \`₹\${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;
}

function generateOrderNumber() {
  const now = new Date();
  return \`MED\${now.getFullYear()}\${String(now.getMonth() + 1).padStart(2, '0')}\${String(now.getDate()).padStart(2, '0')}\${String(now.getHours()).padStart(2, '0')}\${String(now.getMinutes()).padStart(2, '0')}\`;
}

function calculateEstimatedDelivery() {
  const deliveryDate = new Date();
  let daysAdded = 0;
  while (daysAdded < 3) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) daysAdded++;
  }
  return deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatOrderDate(date) {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
}

// ============================================================================
// RENDER FUNCTIONS: Update UI for each step
// ============================================================================

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
    const rxBadge = medicine.prescriptionRequired 
      ? \`<span class="rx-badge" style="background: #ef4444; color: white; font-size: 10px; font-weight: bold; padding: 2px 4px; border-radius: 4px; margin-left: 8px; vertical-align: middle;">Rx</span>\` 
      : '';

    return \`
      <div class="cart-item" data-item-index="\${index}">
        <div class="item-image">
          <img src="\${imagePath}" alt="\${medicine.name}" />
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-name">\${medicine.name}\${rxBadge}</h4>
          <p class="cart-item-brand">\${medicine.brand}</p>
          <p style="font-size: 12px; color: var(--text-light);">\${formatCurrency(medicine.price)} per unit</p>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-adjuster">
            <button type="button" class="qty-btn qty-minus" data-item-index="\${index}" aria-label="Decrease quantity">−</button>
            <span class="qty-display">\${item.quantity || 1}</span>
            <button type="button" class="qty-btn qty-plus" data-item-index="\${index}" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-item-price">
            <span style="font-weight: 700; color: var(--text-main);">\${formatCurrency(itemTotal)}</span>
            <button type="button" class="btn-remove-item" data-item-index="\${index}" aria-label="Remove item" style="color: var(--danger-color); background: none; border: none; font-size: 12px; font-weight: 600; cursor: pointer; padding: 4px 8px;">Remove</button>
          </div>
        </div>
      </div>
    \`;
  }).join('');
  updateCartTotals();
}

function updateCartTotals() {
  document.getElementById('subtotal').textContent = formatCurrency(checkoutState.subtotal);
  document.getElementById('tax').textContent = formatCurrency(checkoutState.tax);
  document.getElementById('shipping').textContent = 'FREE';
  document.getElementById('total').textContent = formatCurrency(checkoutState.total);
}

function updatePaymentSummary() {
  document.getElementById('summary-subtotal').textContent = formatCurrency(checkoutState.subtotal);
  document.getElementById('summary-tax').textContent = formatCurrency(checkoutState.tax);
  document.getElementById('summary-shipping').textContent = 'FREE';
  document.getElementById('summary-discount').textContent = \`-\${formatCurrency(checkoutState.discount)}\`;
  document.getElementById('summary-total').textContent = formatCurrency(checkoutState.total);
}

function renderConfirmation() {
  document.getElementById('order-number').textContent = checkoutState.orderNumber;
  document.getElementById('order-date').textContent = formatOrderDate(checkoutState.orderDate);
  document.getElementById('estimated-delivery').textContent = calculateEstimatedDelivery();
  const deliveryAddress = document.getElementById('delivery-summary');
  if (deliveryAddress) {
    deliveryAddress.innerHTML = \`
      <div class="address-block">
        <p><strong>\${checkoutState.address.fullName}</strong></p>
        <p>\${checkoutState.address.street}</p>
        <p>\${checkoutState.address.city}, \${checkoutState.address.state} \${checkoutState.address.pinCode}</p>
        <p class="phone-text">📱 \${checkoutState.address.phone}</p>
      </div>
    \`;
  }
  const itemsText = \`\${checkoutState.cartItems.length} medicine\${checkoutState.cartItems.length > 1 ? 's' : ''}\`;
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

function transitionToStep(stepName) {
  const validSteps = ['cart', 'address', 'payment', 'confirmation'];
  if (!validSteps.includes(stepName)) return;
  document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active'));
  const targetStep = document.getElementById(\`\${stepName}-step\`);
  if (targetStep) targetStep.classList.add('active');
  document.querySelectorAll('.step-item').forEach(item => {
    item.classList.remove('active', 'completed');
    const itemStep = item.dataset.step;
    if (itemStep === stepName) item.classList.add('active');
    else if (validSteps.indexOf(itemStep) < validSteps.indexOf(stepName)) item.classList.add('completed');
  });
  checkoutState.currentStep = stepName;
  checkoutState.save();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================================

function initCheckout() {
  const initialized = checkoutState.init();
  if (!initialized) return; 

  renderCartItems();
  updatePaymentSummary();

  const prescriptionSection = document.getElementById('prescription-section');
  if (prescriptionSection) {
    const needsPrescription = checkPrescriptionRequired();
    prescriptionSection.style.display = needsPrescription ? 'block' : 'none';
  }

  const prescriptionFile = document.getElementById('prescription-file');
  if (prescriptionFile) {
    prescriptionFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const display = document.getElementById('file-name-display');
      if (file) {
        display.textContent = \`Selected: \${file.name}\`;
        display.style.color = 'var(--text-main)';
        document.getElementById('error-prescription').textContent = '';
      } else {
        display.textContent = 'No file selected';
        display.style.color = 'var(--text-light)';
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('qty-plus')) {
      const index = parseInt(e.target.dataset.itemIndex);
      checkoutState.cartItems[index].quantity = (checkoutState.cartItems[index].quantity || 1) + 1;
      checkoutState.calculateTotals();
      renderCartItems();
      cart.setItems(checkoutState.cartItems);
      showToast('Quantity updated', 'success');
    }
    if (e.target.classList.contains('qty-minus')) {
      const index = parseInt(e.target.dataset.itemIndex);
      if ((checkoutState.cartItems[index].quantity || 1) > 1) {
        checkoutState.cartItems[index].quantity = (checkoutState.cartItems[index].quantity || 1) - 1;
        checkoutState.calculateTotals();
        renderCartItems();
        cart.setItems(checkoutState.cartItems);
        showToast('Quantity updated', 'success');
      }
    }
    if (e.target.classList.contains('btn-remove-item')) {
      const index = parseInt(e.target.dataset.itemIndex);
      checkoutState.cartItems.splice(index, 1);
      cart.setItems(checkoutState.cartItems);
      if (checkoutState.cartItems.length === 0) {
        checkoutState.handleEmptyCart();
      } else {
        checkoutState.calculateTotals();
        renderCartItems();
        showToast('Item removed from cart', 'success');
      }
    }
  });

  const cartContinueBtn = document.getElementById('cart-continue');
  if (cartContinueBtn) {
    cartContinueBtn.addEventListener('click', () => {
      if (checkoutState.cartItems.length === 0) {
        checkoutState.handleEmptyCart();
        return;
      }
      transitionToStep('address');
    });
  }

  const addressBackBtn = document.getElementById('address-back');
  if (addressBackBtn) {
    addressBackBtn.addEventListener('click', () => transitionToStep('cart'));
  }

  const addressContinueBtn = document.getElementById('address-continue');
  if (addressContinueBtn) {
    addressContinueBtn.addEventListener('click', () => {
      const addressErrors = validateAddress();
      const prescriptionValidation = validatePrescription();
      document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      if (Object.keys(addressErrors).length > 0) {
        const fieldToErrorId = { 'fullName': 'error-full-name', 'phone': 'error-phone', 'street': 'error-street', 'city': 'error-city', 'state': 'error-state', 'pinCode': 'error-pin-code' };
        for (const [field, message] of Object.entries(addressErrors)) {
          const errorEl = document.getElementById(fieldToErrorId[field]);
          if (errorEl) errorEl.textContent = message;
        }
        showToast('Please fix the errors in the form', 'warning');
        return;
      }
      if (!prescriptionValidation.valid) {
        const errorEl = document.getElementById('error-prescription');
        if (errorEl) errorEl.textContent = prescriptionValidation.message;
        showToast(prescriptionValidation.message, 'warning');
        return;
      }
      checkoutState.address.fullName = document.getElementById('full-name').value;
      checkoutState.address.phone = document.getElementById('phone').value;
      checkoutState.address.street = document.getElementById('street').value;
      checkoutState.address.city = document.getElementById('city').value;
      checkoutState.address.state = document.getElementById('state').value;
      checkoutState.address.pinCode = document.getElementById('pin-code').value;
      if (document.getElementById('save-address').checked) {
        sessionStorage.setItem('savedAddress', JSON.stringify(checkoutState.address));
      }
      transitionToStep('payment');
    });
  }

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
      checkoutState.couponCode = code;
      const coupon = validation.coupon;
      checkoutState.discount = coupon.discountType === 'percentage' 
        ? (checkoutState.subtotal * coupon.discountValue) / 100 
        : coupon.discountValue;
      checkoutState.calculateTotals();
      updatePaymentSummary();
      errorEl.textContent = '';
      successEl.textContent = \`✓ Coupon applied! You save \${formatCurrency(checkoutState.discount)}\`;
      couponCodeInput.disabled = true;
      applyCouponBtn.disabled = true;
      showToast(\`Coupon "\${code}" applied successfully!\`, 'success');
    });
  }

  const paymentBackBtn = document.getElementById('payment-back');
  if (paymentBackBtn) {
    paymentBackBtn.addEventListener('click', () => transitionToStep('address'));
  }

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
      const order = {
        orderNumber: checkoutState.orderNumber,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
              new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' ' +
              (new Date().getHours() >= 12 ? 'PM' : 'AM'),
        itemsCount: checkoutState.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
        total: checkoutState.total,
        status: 'Placed',
        paymentMethod: paymentMethod.value === 'upi' ? 'UPI' :
                      paymentMethod.value === 'card' ? 'Debit/Credit Card' :
                      paymentMethod.value === 'netbanking' ? 'Net Banking' : 'Cash on Delivery'
      };
      let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
      orderHistory.push(order);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      cart.items = [];
      cart.save();
      renderConfirmation();
      transitionToStep('confirmation');
      showToast('Order placed successfully!', 'success');
    });
  }

  const trackOrderBtn = document.getElementById('track-order');
  if (trackOrderBtn) {
    trackOrderBtn.addEventListener('click', () => {
      showToast('Redirecting to order tracking...', 'info');
      setTimeout(() => window.location.href = '../index.html', 1500);
    });
  }

  const continueShoppingBtn = document.getElementById('continue-shopping');
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', initCheckout);
