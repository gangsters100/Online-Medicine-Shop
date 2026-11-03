/**
 * profile.js: User Profile Page Logic
 * Member 4: Muhammad Abrar Aamir Sheikh
 */

import { showToast } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load user data from sessionStorage with robust fallbacks
  let userData = JSON.parse(sessionStorage.getItem('userData'));
  if (!userData || !userData.name) {
    userData = {
      name: sessionStorage.getItem('userName') || 'Ashish Sharma',
      phone: sessionStorage.getItem('userPhone') || '9876543210',
      email: sessionStorage.getItem('userEmail') || 'ashish.sharma@example.com'
    };
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }

  const savedAddress = JSON.parse(sessionStorage.getItem('savedAddress')) || {
    fullName: userData.name || 'Ashish Sharma',
    phone: userData.phone || '9876543210',
    street: '123 MG Road, Near Central Mall',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560001'
  };

  // Load order history from localStorage or create sample order if none
  let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [
    {
      orderNumber: 'MED202611011430',
      date: '01 Nov 2026, 02:30 PM',
      itemsCount: 2,
      total: '₹682.50',
      status: 'Delivered',
      paymentMethod: 'UPI'
    }
  ];

  // Populate UI
  const userInitials = userData.name ? userData.name.split(' ').map(n => n[0]).join('') : 'AS';
  document.getElementById('profile-avatar').textContent = userInitials;
  document.getElementById('sidebar-name').textContent = userData.name || 'Ashish Sharma';
  document.getElementById('sidebar-phone').textContent = `+91 ${userData.phone || '9876543210'}`;

  // Populate personal info form
  document.getElementById('profile-name').value = userData.name || 'Ashish Sharma';
  document.getElementById('profile-phone').value = userData.phone || '9876543210';
  document.getElementById('profile-email').value = userData.email || 'ashish.sharma@example.com';

  // Populate address book
  document.getElementById('addr-name').value = savedAddress.fullName || '';
  document.getElementById('addr-phone').value = savedAddress.phone || '';
  document.getElementById('addr-street').value = savedAddress.street || '';
  document.getElementById('addr-city').value = savedAddress.city || '';
  document.getElementById('addr-state').value = savedAddress.state || '';
  document.getElementById('addr-pincode').value = savedAddress.pinCode || '';

  // Render order history
  renderOrders(orderHistory);

  // Navigation tab switching
  const navItems = document.querySelectorAll('.profile-nav-item');
  const sections = document.querySelectorAll('.profile-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.dataset.tab;

      if (targetTab === 'logout') {
        sessionStorage.clear();
        showToast('Logged out successfully', 'success');
        setTimeout(() => window.location.href = '../index.html', 1000);
        return;
      }

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      sections.forEach(sec => sec.classList.remove('active'));
      const activeSec = document.getElementById(`${targetTab}-section`);
      if (activeSec) activeSec.classList.add('active');
    });
  });

  // Save personal info
  const saveInfoBtn = document.getElementById('save-info-btn');
  if (saveInfoBtn) {
    saveInfoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      userData.name = document.getElementById('profile-name').value;
      userData.phone = document.getElementById('profile-phone').value;
      userData.email = document.getElementById('profile-email').value;

      sessionStorage.setItem('userData', JSON.stringify(userData));
      document.getElementById('sidebar-name').textContent = userData.name;
      document.getElementById('sidebar-phone').textContent = `+91 ${userData.phone}`;
      document.getElementById('profile-avatar').textContent = userData.name.split(' ').map(n => n[0]).join('');

      showToast('Profile updated successfully!', 'success');
    });
  }

  // Save address book
  const saveAddrBtn = document.getElementById('save-addr-btn');
  if (saveAddrBtn) {
    saveAddrBtn.addEventListener('click', (e) => {
      e.preventDefault();
      savedAddress.fullName = document.getElementById('addr-name').value;
      savedAddress.phone = document.getElementById('addr-phone').value;
      savedAddress.street = document.getElementById('addr-street').value;
      savedAddress.city = document.getElementById('addr-city').value;
      savedAddress.state = document.getElementById('addr-state').value;
      savedAddress.pinCode = document.getElementById('addr-pincode').value;

      sessionStorage.setItem('savedAddress', JSON.stringify(savedAddress));
      showToast('Delivery address saved successfully!', 'success');
    });
  }
});

function renderOrders(orders) {
  const container = document.getElementById('orders-container');
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = '<p class="text-muted">No orders placed yet.</p>';
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <span class="order-id">${order.orderNumber}</span>
          <div class="order-date">${order.date}</div>
        </div>
        <span class="order-status">${order.status}</span>
      </div>
      <div class="order-card-body">
        <p><strong>Payment:</strong> ${order.paymentMethod}</p>
        <p><strong>Items:</strong> ${order.itemsCount} medicine(s)</p>
      </div>
      <div class="order-card-footer">
        <span>Total Amount:</span>
        <span class="order-total">${order.total}</span>
      </div>
    </div>
  `).join('');
}
