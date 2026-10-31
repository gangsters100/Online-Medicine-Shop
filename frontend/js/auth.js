/**
  * auth.js: Authentication Module with 3-Step Hybrid Flow (Phone → Password → OTP)
  * Manages phone validation, password verification, OTP generation, and slingshot physics.
  * Member 4: Muhammad Abrar Aamir Sheikh
  */

import { showToast } from './ui.js';

/* ==========================================================================
   STATE MANAGEMENT
   ========================================================================== */
const authState = {
  currentStep: 'phone', // 'phone' | 'password' | 'otp' | 'success'
  phone: '',
  password: '', // User's password
  otp: '', // 6-digit OTP
  userOtp: '', // What user entered
  resendTimer: 60,
  isResendDisabled: true,
  timerInterval: null, // Store interval ID for cleanup
  slingshot: {
    loadedDigit: '1',
    ballX: 0,
    ballY: 0,
    restX: 0,
    restY: 0,
    velocity: { x: 0, y: 0 },
    isDragging: false,
    isFlying: false,
  }
};

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const DOM = {
  phoneForm: document.getElementById('phone-form'),
  phoneInput: document.getElementById('phone-input'),
  phoneStep: document.getElementById('phone-step'),
  passwordStep: document.getElementById('password-step'),
  otpStep: document.getElementById('otp-step'),
  successStep: document.getElementById('success-step'),
  // Password step elements
  passwordForm: document.getElementById('password-form'),
  passwordInput: document.getElementById('password-input'),
  togglePasswordBtn: document.getElementById('toggle-password-btn'),
  backToPhoneBtn: document.getElementById('back-to-phone-btn'),
  forgotPasswordBtn: document.getElementById('forgot-password-btn'),
  passwordPhoneDisplay: document.getElementById('password-phone-display'),
  // OTP step elements
  otpSlots: document.querySelectorAll('#otp-slots .otp-slot'),
  digitButtons: document.getElementById('digit-buttons'),
  canvas: document.getElementById('slingshot-canvas'),
  ctx: null,
  clearOtpBtn: document.getElementById('clear-otp-btn'),
  verifyOtpBtn: document.getElementById('verify-otp-btn'),
  resendBtn: document.getElementById('resend-otp-btn'),
  resendTimer: document.getElementById('resend-timer'),
  directOtpInput: document.getElementById('direct-otp-input'),
  continueBtn: document.getElementById('continue-btn'),
  otpPhoneDisplay: document.getElementById('otp-phone-display'),
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if (!DOM.canvas) return;
  DOM.ctx = DOM.canvas.getContext('2d');

  const CANVAS_WIDTH = DOM.canvas.width;
  const CANVAS_HEIGHT = DOM.canvas.height;
  authState.slingshot.restX = CANVAS_WIDTH / 2;
  authState.slingshot.restY = CANVAS_HEIGHT - 60;
  authState.slingshot.ballX = CANVAS_WIDTH / 2;
  authState.slingshot.ballY = CANVAS_HEIGHT - 60;

  initializeDigitButtons();
  attachEventListeners();
  drawSlingshot();
});

/* ==========================================================================
   STEP 1: PHONE NUMBER INPUT
   ========================================================================== */
function handlePhoneSubmit(event) {
  event.preventDefault();
  const phone = DOM.phoneInput.value.trim();

  if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
    showToast('Please enter a valid 10-digit mobile number', 'error');
    return;
  }

  authState.phone = phone;
  DOM.passwordPhoneDisplay.textContent = `Account: +91 ${phone.slice(0, 4)}${'*'.repeat(6)}`;
  transitionToStep('password');
  DOM.passwordInput.focus();
}

/* ==========================================================================
   STEP 2: PASSWORD VERIFICATION
   ========================================================================== */
function handlePasswordSubmit(event) {
  event.preventDefault();
  const password = DOM.passwordInput.value.trim();

  if (!password || password.length < 8) {
    showToast('Password must be at least 8 characters', 'error');
    return;
  }

  // Store password for verification
  authState.password = password;

  // Simulate password verification against stored credentials
  // In real app, this would be an API call
  const isPasswordCorrect = verifyPasswordLocally(authState.phone, password);

  if (isPasswordCorrect) {
    showToast('Password verified! Sending OTP...', 'success');
    generateAndSendOTP(authState.phone);
  } else {
    showToast('Incorrect password. Please try again.', 'error');
    DOM.passwordInput.value = '';
    DOM.passwordInput.focus();
  }
}

function verifyPasswordLocally(phone, password) {
  // For development: accept any password >= 8 chars
  // In production, this would verify against hashed passwords in database
  const storedPassword = sessionStorage.getItem(`pwd_${phone}`);

  if (storedPassword) {
    return storedPassword === password;
  }

  // If no stored password, accept for demo (user might be new)
  // In real app, this would reject
  console.log('[Dev Mode] Password verification - accepting for demo');
  return true;
}

function togglePasswordVisibility() {
  const input = DOM.passwordInput;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';

  // Update button icon visual feedback
  DOM.togglePasswordBtn.classList.toggle('active', !isPassword);
}

/* ==========================================================================
   STEP 3: OTP GENERATION & SLINGSHOT GAME
   ========================================================================== */
function generateAndSendOTP(phone) {
  authState.otp = String(Math.floor(Math.random() * 900000) + 100000);
  authState.userOtp = '';

  // Set default loaded digit to first digit of generated OTP
  authState.slingshot.loadedDigit = authState.otp[0];

  console.log(`[Development] OTP sent to +91${phone}: ${authState.otp}`);
  showToast(`OTP sent to +91${phone}. (Dev OTP: ${authState.otp})`, 'success');

  DOM.otpPhoneDisplay.textContent = `Sent to +91 ${phone.slice(0, 4)}${'*'.repeat(6)}`;
  transitionToStep('otp');
  updateOtpDisplay();
  startResendTimer();
}

function initializeDigitButtons() {
  if (!DOM.digitButtons) return;
  DOM.digitButtons.innerHTML = '';

  for (let i = 0; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'digit-btn';
    btn.textContent = i;
    btn.setAttribute('data-digit', i);
    if (String(i) === authState.slingshot.loadedDigit) {
      btn.classList.add('loaded');
    }
    btn.addEventListener('click', () => loadDigitIntoSlingshot(String(i), btn));
    DOM.digitButtons.appendChild(btn);
  }
}

function loadDigitIntoSlingshot(digit, btnElement) {
  authState.slingshot.loadedDigit = digit;

  // Highlight selected button
  document.querySelectorAll('.digit-btn').forEach(b => b.classList.remove('loaded'));
  if (btnElement) btnElement.classList.add('loaded');

  showToast(`Loaded digit '${digit}' into slingshot! Pull back & release to shoot.`, 'info');
  drawSlingshot();
}

function updateOtpDisplay() {
  DOM.otpSlots.forEach((slot, index) => {
    const value = authState.userOtp[index] || '';
    const valueSpan = slot.querySelector('.slot-value');
    if (valueSpan) {
      valueSpan.textContent = value;
    }
    if (value) {
      slot.classList.add('filled');
    } else {
      slot.classList.remove('filled');
    }
  });
}

function handleClearOtp() {
  authState.userOtp = '';
  updateOtpDisplay();
  showToast('OTP cleared', 'info');
}

function handleDirectOtpInput(event) {
  let value = event.target.value.replace(/\D/g, '').slice(0, 6);
  authState.userOtp = value;
  updateOtpDisplay();
  if (value.length === 6) {
    verifyOTP();
  }
}

/* ==========================================================================
   SLINGSHOT CANVAS DRAWING & PHYSICS (Drag & Release)
   ========================================================================== */
function drawSlingshot() {
  if (!DOM.ctx || !DOM.canvas) return;
  const ctx = DOM.ctx;
  const width = DOM.canvas.width;
  const height = DOM.canvas.height;
  const sl = authState.slingshot;

  ctx.clearRect(0, 0, width, height);

  const restX = sl.restX;
  const restY = sl.restY;

  // Draw rubber bands
  ctx.strokeStyle = '#0d9488';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  // Left band
  ctx.beginPath();
  ctx.moveTo(restX - 25, restY - 10);
  ctx.lineTo(sl.ballX, sl.ballY);
  ctx.stroke();

  // Right band
  ctx.beginPath();
  ctx.moveTo(restX + 25, restY - 10);
  ctx.lineTo(sl.ballX, sl.ballY);
  ctx.stroke();

  // Draw slingshot fork / base
  ctx.fillStyle = '#0f766e';
  ctx.beginPath();
  ctx.ellipse(restX, restY + 15, 30, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Left arm
  ctx.strokeStyle = '#115e59';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(restX - 15, restY + 10);
  ctx.lineTo(restX - 28, restY - 20);
  ctx.stroke();

  // Right arm
  ctx.beginPath();
  ctx.moveTo(restX + 15, restY + 10);
  ctx.lineTo(restX + 28, restY - 20);
  ctx.stroke();

  // Draw trajectory guide if dragging
  if (sl.isDragging) {
    ctx.strokeStyle = 'rgba(13, 148, 136, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(sl.ballX, sl.ballY);
    const aimX = restX + (restX - sl.ballX) * 2;
    const aimY = 30; // target area height
    ctx.lineTo(aimX, aimY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw target slot preview hint
  ctx.strokeStyle = 'rgba(13, 148, 136, 0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(width / 2 - 120, 15, 240, 45);
  ctx.setLineDash([]);

  // Draw slingshot projectile ball with loaded digit
  ctx.fillStyle = '#10b981';
  ctx.strokeStyle = '#047857';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sl.ballX, sl.ballY, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Digit text inside ball
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sl.loadedDigit, sl.ballX, sl.ballY);

  // Instructions text
  ctx.fillStyle = '#475569';
  ctx.font = '13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(sl.isDragging ? 'Release to launch digit into slot!' : '🎯 Drag slingshot ball & release to shoot digit!', width / 2, height - 12);
}

let animationId = null;

function launchBallToSlot(digit) {
  const sl = authState.slingshot;
  const slotIndex = authState.userOtp.length;
  if (slotIndex >= 6) return;

  const slotElement = DOM.otpSlots[slotIndex];
  const slotRect = slotElement.getBoundingClientRect();
  const canvasRect = DOM.canvas.getBoundingClientRect();

  // Convert slot position (which is on page) to canvas-relative coordinates
  const targetX = slotRect.left - canvasRect.left + slotRect.width / 2;
  const targetY = slotRect.top - canvasRect.top + slotRect.height / 2;

  let currentX = sl.ballX;
  let currentY = sl.ballY;

  const dx = targetX - currentX;
  const dy = targetY - currentY;
  const steps = 20;
  let step = 0;

  sl.isFlying = true;

  function animateFlight() {
    step++;
    currentX += dx / steps;
    currentY += dy / steps;
    sl.ballX = currentX;
    sl.ballY = currentY;
    drawSlingshot();

    if (step < steps) {
      animationId = requestAnimationFrame(animateFlight);
    } else {
      // Landed in slot!
      sl.isFlying = false;
      authState.userOtp += digit;
      updateOtpDisplay();

      // Reset ball to rest position
      sl.ballX = sl.restX;
      sl.ballY = sl.restY;
      drawSlingshot();

      // Check if complete
      if (authState.userOtp.length === 6) {
        setTimeout(() => verifyOTP(), 400);
      }
    }
  }

  if (animationId) cancelAnimationFrame(animationId);
  animateFlight();
}

/* ==========================================================================
   EVENT LISTENERS FOR CANVAS DRAG & RELEASE
   ========================================================================== */
function attachEventListeners() {
  // Step 1: Phone form
  if (DOM.phoneForm) {
    DOM.phoneForm.addEventListener('submit', handlePhoneSubmit);
  }

  // Step 2: Password form
  if (DOM.passwordForm) {
    DOM.passwordForm.addEventListener('submit', handlePasswordSubmit);
  }
  if (DOM.togglePasswordBtn) {
    DOM.togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
  }
  if (DOM.backToPhoneBtn) {
    DOM.backToPhoneBtn.addEventListener('click', () => {
      authState.password = '';
      DOM.passwordInput.value = '';
      DOM.passwordInput.type = 'password';
      DOM.togglePasswordBtn.classList.remove('active');
      transitionToStep('phone');
      DOM.phoneInput.focus();
    });
  }
  if (DOM.forgotPasswordBtn) {
    DOM.forgotPasswordBtn.addEventListener('click', () => {
      showToast('Password reset feature coming soon', 'info');
    });
  }

  // Step 3: OTP
  if (DOM.clearOtpBtn) {
    DOM.clearOtpBtn.addEventListener('click', handleClearOtp);
  }
  if (DOM.verifyOtpBtn) {
    DOM.verifyOtpBtn.addEventListener('click', verifyOTP);
  }
  if (DOM.resendBtn) {
    DOM.resendBtn.addEventListener('click', handleResendOtp);
  }
  if (DOM.directOtpInput) {
    DOM.directOtpInput.addEventListener('input', handleDirectOtpInput);
  }
  if (DOM.continueBtn) {
    DOM.continueBtn.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }

  // Canvas Mouse & Touch Drag Events
  const canvas = DOM.canvas;
  if (!canvas) return;

  const getPointerPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  canvas.addEventListener('mousedown', (e) => {
    if (authState.slingshot.isFlying) return;
    const pos = getPointerPos(e);
    const sl = authState.slingshot;
    const dist = Math.sqrt((pos.x - sl.ballX) ** 2 + (pos.y - sl.ballY) ** 2);
    if (dist < 35) {
      sl.isDragging = true;
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const sl = authState.slingshot;
    if (!sl.isDragging) return;
    const pos = getPointerPos(e);

    // Clamp max pull distance (75px)
    const dx = pos.x - sl.restX;
    const dy = pos.y - sl.restY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxPull = 75;

    if (dist > maxPull) {
      sl.ballX = sl.restX + (dx / dist) * maxPull;
      sl.ballY = sl.restY + (dy / dist) * maxPull;
    } else {
      sl.ballX = pos.x;
      sl.ballY = pos.y;
    }
    drawSlingshot();
  });

  canvas.addEventListener('mouseup', () => {
    const sl = authState.slingshot;
    if (!sl.isDragging) return;
    sl.isDragging = false;

    // If pulled backward (away from target), launch!
    const pullDistance = Math.sqrt((sl.restX - sl.ballX) ** 2 + (sl.restY - sl.ballY) ** 2);
    if (pullDistance > 15) {
      const digitToShoot = sl.loadedDigit;
      launchBallToSlot(digitToShoot);
    } else {
      // Snap back
      sl.ballX = sl.restX;
      sl.ballY = sl.restY;
      drawSlingshot();
    }
  });

  // Touch events support for mobile/tablets
  canvas.addEventListener('touchstart', (e) => {
    if (authState.slingshot.isFlying) return;
    const pos = getPointerPos(e);
    const sl = authState.slingshot;
    const dist = Math.sqrt((pos.x - sl.ballX) ** 2 + (pos.y - sl.ballY) ** 2);
    if (dist < 40) {
      sl.isDragging = true;
      e.preventDefault();
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    const sl = authState.slingshot;
    if (!sl.isDragging) return;
    const pos = getPointerPos(e);

    const dx = pos.x - sl.restX;
    const dy = pos.y - sl.restY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxPull = 75;

    if (dist > maxPull) {
      sl.ballX = sl.restX + (dx / dist) * maxPull;
      sl.ballY = sl.restY + (dy / dist) * maxPull;
    } else {
      sl.ballX = pos.x;
      sl.ballY = pos.y;
    }
    drawSlingshot();
    e.preventDefault();
  });

  canvas.addEventListener('touchend', () => {
    const sl = authState.slingshot;
    if (!sl.isDragging) return;
    sl.isDragging = false;

    const pullDistance = Math.sqrt((sl.restX - sl.ballX) ** 2 + (sl.restY - sl.ballY) ** 2);
    if (pullDistance > 15) {
      const digitToShoot = sl.loadedDigit;
      launchBallToSlot(digitToShoot);
    } else {
      sl.ballX = sl.restX;
      sl.ballY = sl.restY;
      drawSlingshot();
    }
  });
}

/* ==========================================================================
   OTP VERIFICATION
   ========================================================================== */
function verifyOTP() {
  if (authState.userOtp.length !== 6) {
    showToast('Please enter all 6 digits', 'error');
    return;
  }

  if (authState.userOtp === authState.otp) {
    transitionToStep('success');
    showToast('Login successful! Redirecting...', 'success');
    sessionStorage.setItem('authToken', `token_${Date.now()}`);
    sessionStorage.setItem('userPhone', authState.phone);

    // Auto-redirect after 2 seconds
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 2000);
  } else {
    showToast('Incorrect OTP. Please try again.', 'error');
    authState.userOtp = '';
    updateOtpDisplay();
  }
}

function startResendTimer() {
  authState.resendTimer = 60;
  authState.isResendDisabled = true;
  DOM.resendBtn.disabled = true;
  DOM.resendBtn.style.cursor = 'not-allowed';

  // Clear any existing timer
  if (authState.timerInterval) {
    clearInterval(authState.timerInterval);
  }

  authState.timerInterval = setInterval(() => {
    authState.resendTimer--;
    DOM.resendTimer.textContent = authState.resendTimer;
    if (authState.resendTimer <= 0) {
      clearInterval(authState.timerInterval);
      authState.timerInterval = null;
      authState.isResendDisabled = false;
      DOM.resendBtn.disabled = false;
      DOM.resendBtn.style.cursor = 'pointer';
      DOM.resendBtn.textContent = 'Resend OTP';
    }
  }, 1000);
}

function handleResendOtp() {
  if (authState.isResendDisabled) return;
  authState.userOtp = '';
  generateAndSendOTP(authState.phone);
}

function transitionToStep(stepName) {
  authState.currentStep = stepName;

  // Hide all steps
  if (DOM.phoneStep) DOM.phoneStep.classList.remove('active');
  if (DOM.passwordStep) DOM.passwordStep.classList.remove('active');
  if (DOM.otpStep) DOM.otpStep.classList.remove('active');
  if (DOM.successStep) DOM.successStep.classList.remove('active');

  // Show selected step
  switch (stepName) {
    case 'phone':
      if (DOM.phoneStep) DOM.phoneStep.classList.add('active');
      DOM.phoneInput.focus();
      break;
    case 'password':
      if (DOM.passwordStep) DOM.passwordStep.classList.add('active');
      DOM.passwordInput.focus();
      break;
    case 'otp':
      if (DOM.otpStep) DOM.otpStep.classList.add('active');
      setTimeout(() => drawSlingshot(), 100);
      break;
    case 'success':
      if (DOM.successStep) DOM.successStep.classList.add('active');
      break;
  }
}

/* ==========================================================================
   EXPORTS
   ========================================================================== */
window.handlePhoneSubmit = handlePhoneSubmit;
window.handlePasswordSubmit = handlePasswordSubmit;
window.verifyOTP = verifyOTP;
