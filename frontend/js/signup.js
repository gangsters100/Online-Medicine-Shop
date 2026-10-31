/**
  * signup.js: Signup Module with Interactive Slingshot OTP Game
  * Manages account creation, phone verification, OTP generation, and slingshot mechanics.
  * Member 4: Muhammad Abrar Aamir Sheikh
  */

import { showToast } from './ui.js';

/* ==========================================================================
   STATE MANAGEMENT
   ========================================================================== */
const signupState = {
  currentStep: 'info', // 'info' | 'otp' | 'success'
  fullName: '',
  email: '',
  phone: '',
  password: '',
  otp: '', // 6-digit OTP
  userOtp: '', // What user entered
  resendTimer: 60,
  isResendDisabled: true,
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
  signupForm: document.getElementById('signup-form'),
  fullNameInput: document.getElementById('full-name'),
  emailInput: document.getElementById('email-input'),
  phoneInputSignup: document.getElementById('phone-input-signup'),
  passwordInput: document.getElementById('password-input'),
  termsCheckbox: document.getElementById('terms-checkbox'),
  infoStep: document.getElementById('info-step'),
  otpStep: document.getElementById('otp-step'),
  successStep: document.getElementById('success-step'),
  otpSlotsSignup: document.querySelectorAll('#otp-slots-signup .otp-slot'),
  digitButtonsSignup: document.getElementById('digit-buttons-signup'),
  canvasSignup: document.getElementById('slingshot-canvas-signup'),
  ctx: null,
  clearOtpBtnSignup: document.getElementById('clear-otp-btn-signup'),
  verifyOtpBtnSignup: document.getElementById('verify-otp-btn-signup'),
  resendBtnSignup: document.getElementById('resend-otp-btn-signup'),
  resendTimerSignup: document.getElementById('resend-timer-signup'),
  directOtpInputSignup: document.getElementById('direct-otp-input-signup'),
  continueBtnSignup: document.getElementById('continue-btn-signup'),
  otpPhoneDisplaySignup: document.getElementById('otp-phone-display-signup'),
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if (!DOM.canvasSignup) return;
  DOM.ctx = DOM.canvasSignup.getContext('2d');

  const CANVAS_WIDTH = DOM.canvasSignup.width;
  const CANVAS_HEIGHT = DOM.canvasSignup.height;
  signupState.slingshot.restX = CANVAS_WIDTH / 2;
  signupState.slingshot.restY = CANVAS_HEIGHT - 60;
  signupState.slingshot.ballX = CANVAS_WIDTH / 2;
  signupState.slingshot.ballY = CANVAS_HEIGHT - 60;

  attachEventListeners();
});

/* ==========================================================================
   STEP 1: ACCOUNT CREATION FORM
   ========================================================================== */
function handleSignupSubmit(event) {
  event.preventDefault();

  const fullName = DOM.fullNameInput.value.trim();
  const email = DOM.emailInput.value.trim();
  const phone = DOM.phoneInputSignup.value.trim();
  const password = DOM.passwordInput.value.trim();
  const termsAccepted = DOM.termsCheckbox.checked;

  // Validation
  if (!fullName || fullName.length < 2) {
    showToast('Please enter your full name', 'error');
    return;
  }

  if (!email || !isValidEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }

  if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
    showToast('Please enter a valid 10-digit mobile number', 'error');
    return;
  }

  if (!password || password.length < 8) {
    showToast('Password must be at least 8 characters long', 'error');
    return;
  }

  if (!termsAccepted) {
    showToast('Please accept the Terms of Service', 'error');
    return;
  }

  // Store signup data
  signupState.fullName = fullName;
  signupState.email = email;
  signupState.phone = phone;
  signupState.password = password;

  generateAndSendOTP(phone);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generateAndSendOTP(phone) {
  signupState.otp = String(Math.floor(Math.random() * 900000) + 100000);
  signupState.userOtp = '';

  // Set default loaded digit to first digit of generated OTP
  signupState.slingshot.loadedDigit = signupState.otp[0];

  console.log(`[Development] OTP sent to +91${phone}: ${signupState.otp}`);
  showToast(`OTP sent to +91${phone}. (Dev OTP: ${signupState.otp})`, 'success');

  DOM.otpPhoneDisplaySignup.textContent = `Sent to +91 ${phone.slice(0, 4)}${'*'.repeat(6)}`;
  transitionToStep('otp');
  initializeDigitButtons();
  updateOtpDisplay();
  startResendTimer();
}

/* ==========================================================================
   STEP 2: SLINGSHOT OTP GAME & DIGIT BUTTONS
   ========================================================================== */
function initializeDigitButtons() {
  if (!DOM.digitButtonsSignup) return;
  DOM.digitButtonsSignup.innerHTML = '';

  for (let i = 0; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'digit-btn';
    btn.textContent = i;
    btn.setAttribute('data-digit', i);
    if (String(i) === signupState.slingshot.loadedDigit) {
      btn.classList.add('loaded');
    }
    btn.addEventListener('click', () => loadDigitIntoSlingshot(String(i), btn));
    DOM.digitButtonsSignup.appendChild(btn);
  }

  drawSlingshot();
}

function loadDigitIntoSlingshot(digit, btnElement) {
  signupState.slingshot.loadedDigit = digit;

  // Highlight selected button
  document.querySelectorAll('#digit-buttons-signup .digit-btn').forEach(b => b.classList.remove('loaded'));
  if (btnElement) btnElement.classList.add('loaded');

  showToast(`Loaded digit '${digit}' into slingshot! Pull back & release to shoot.`, 'info');
  drawSlingshot();
}

function updateOtpDisplay() {
  DOM.otpSlotsSignup.forEach((slot, index) => {
    const value = signupState.userOtp[index] || '';
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
  signupState.userOtp = '';
  updateOtpDisplay();
  showToast('OTP cleared', 'info');
}

function handleDirectOtpInput(event) {
  let value = event.target.value.replace(/\D/g, '').slice(0, 6);
  signupState.userOtp = value;
  updateOtpDisplay();
  if (value.length === 6) {
    verifyOTP();
  }
}

/* ==========================================================================
   SLINGSHOT CANVAS DRAWING & PHYSICS (Drag & Release)
   ========================================================================== */
function drawSlingshot() {
  if (!DOM.ctx || !DOM.canvasSignup) return;
  const ctx = DOM.ctx;
  const width = DOM.canvasSignup.width;
  const height = DOM.canvasSignup.height;
  const sl = signupState.slingshot;

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
    const aimY = 30;
    ctx.lineTo(aimX, aimY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

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
  const sl = signupState.slingshot;
  const slotIndex = signupState.userOtp.length;
  if (slotIndex >= 6) return;

  const slotElement = DOM.otpSlotsSignup[slotIndex];
  const slotRect = slotElement.getBoundingClientRect();
  const canvasRect = DOM.canvasSignup.getBoundingClientRect();

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
      signupState.userOtp += digit;
      updateOtpDisplay();

      // Reset ball to rest position
      sl.ballX = sl.restX;
      sl.ballY = sl.restY;
      drawSlingshot();

      // Check if complete
      if (signupState.userOtp.length === 6) {
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
  if (DOM.signupForm) {
    DOM.signupForm.addEventListener('submit', handleSignupSubmit);
  }
  if (DOM.clearOtpBtnSignup) {
    DOM.clearOtpBtnSignup.addEventListener('click', handleClearOtp);
  }
  if (DOM.verifyOtpBtnSignup) {
    DOM.verifyOtpBtnSignup.addEventListener('click', verifyOTP);
  }
  if (DOM.resendBtnSignup) {
    DOM.resendBtnSignup.addEventListener('click', handleResendOtp);
  }
  if (DOM.directOtpInputSignup) {
    DOM.directOtpInputSignup.addEventListener('input', handleDirectOtpInput);
  }
  if (DOM.continueBtnSignup) {
    DOM.continueBtnSignup.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }

  // Canvas Mouse & Touch Drag Events
  const canvas = DOM.canvasSignup;
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
    if (signupState.slingshot.isFlying) return;
    const pos = getPointerPos(e);
    const sl = signupState.slingshot;
    const dist = Math.sqrt((pos.x - sl.ballX) ** 2 + (pos.y - sl.ballY) ** 2);
    if (dist < 35) {
      sl.isDragging = true;
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const sl = signupState.slingshot;
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
    const sl = signupState.slingshot;
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

  // Touch events support
  canvas.addEventListener('touchstart', (e) => {
    if (signupState.slingshot.isFlying) return;
    const pos = getPointerPos(e);
    const sl = signupState.slingshot;
    const dist = Math.sqrt((pos.x - sl.ballX) ** 2 + (pos.y - sl.ballY) ** 2);
    if (dist < 40) {
      sl.isDragging = true;
      e.preventDefault();
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    const sl = signupState.slingshot;
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
    const sl = signupState.slingshot;
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
  if (signupState.userOtp.length !== 6) {
    showToast('Please enter all 6 digits', 'error');
    return;
  }

  if (signupState.userOtp === signupState.otp) {
    transitionToStep('success');
    showToast('Phone verified successfully!', 'success');
    sessionStorage.setItem('authToken', `token_${Date.now()}`);
    sessionStorage.setItem('userPhone', signupState.phone);
    sessionStorage.setItem('userEmail', signupState.email);
    sessionStorage.setItem('userName', signupState.fullName);
  } else {
    showToast('Incorrect OTP. Please try again.', 'error');
    signupState.userOtp = '';
    updateOtpDisplay();
  }
}

function startResendTimer() {
  signupState.resendTimer = 60;
  signupState.isResendDisabled = true;
  DOM.resendBtnSignup.disabled = true;
  DOM.resendBtnSignup.style.cursor = 'not-allowed';

  const timerIntent = setInterval(() => {
    signupState.resendTimer--;
    DOM.resendTimerSignup.textContent = signupState.resendTimer;
    if (signupState.resendTimer <= 0) {
      clearInterval(timerIntent);
      signupState.isResendDisabled = false;
      DOM.resendBtnSignup.disabled = false;
      DOM.resendBtnSignup.style.cursor = 'pointer';
      DOM.resendBtnSignup.textContent = 'Resend OTP';
    }
  }, 1000);
}

function handleResendOtp() {
  if (signupState.isResendDisabled) return;
  signupState.userOtp = '';
  generateAndSendOTP(signupState.phone);
}

function transitionToStep(stepName) {
  signupState.currentStep = stepName;
  DOM.infoStep.classList.remove('active');
  DOM.otpStep.classList.remove('active');
  DOM.successStep.classList.remove('active');

  switch (stepName) {
    case 'info':
      DOM.infoStep.classList.add('active');
      DOM.fullNameInput.focus();
      break;
    case 'otp':
      DOM.otpStep.classList.add('active');
      setTimeout(() => drawSlingshot(), 100);
      break;
    case 'success':
      DOM.successStep.classList.add('active');
      break;
  }
}

/* ==========================================================================
   EXPORTS
   ========================================================================== */
window.handleSignupSubmit = handleSignupSubmit;
window.verifyOTP = verifyOTP;
