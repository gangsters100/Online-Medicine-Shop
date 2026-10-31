/**
 * login.js: Login Page Logic with Interactive Slingshot OTP Game
 * Maintained by Member 4 (Muhammad Abrar Aamir Sheikh) - Auth Module
 * Features: Phone verification, Slingshot OTP game with canvas, accessibility fallback
 */

/* ==========================================================================
   SLINGSHOT OTP GAME STATE & CONFIG
   ========================================================================== */

const gameConfig = {
  canvasWidth: 400,
  canvasHeight: 300,
  slingshotX: 50,
  slingshotY: 250,
  targetX: 350,
  targetY: 80,
  targetRadius: 30,
  projectileRadius: 12,
  elasticity: 0.92,
  gravity: 0.3,
  soundEnabled: true,
};

let gameState = {
  currentOTP: generateMockOTP(),
  enteredOTP: '',
  mouseX: 0,
  mouseY: 0,
  isDragging: false,
  projectiles: [],
  currentPhone: '',
  resendTimer: 30,
  timerInterval: null,
};

let canvas, ctx;

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

/**
 * Generate a mock 6-digit OTP for demo purposes
 */
function generateMockOTP() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Play sound effect (if enabled)
 */
function playSound(type = 'success') {
  if (!gameConfig.soundEnabled) return;

  // Use Web Audio API to generate simple beeps
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'success') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    } else if (type === 'error') {
      oscillator.frequency.value = 300;
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
    } else if (type === 'launch') {
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
    }
  } catch (e) {
    console.debug('Audio context not available');
  }
}

/**
 * Format phone number for display
 */
function formatPhoneDisplay(phone) {
  if (!phone) return '';
  const last4 = phone.slice(-4);
  return `****${last4}`;
}

/* ==========================================================================
   FORM STEP NAVIGATION
   ========================================================================== */

/**
 * Handle phone number form submission
 */
function handlePhoneSubmit(event) {
  event.preventDefault();

  const phoneInput = document.getElementById('phone');
  const phone = phoneInput.value.trim();

  if (!phone || phone.length !== 10) {
    showToast('Please enter a valid 10-digit phone number', 'error');
    return;
  }

  // Validate phone number format (Indian numbers)
  if (!/^[6-9]\d{9}$/.test(phone)) {
    showToast('Please enter a valid Indian mobile number (starting with 6-9)', 'error');
    return;
  }

  // Store phone and transition to OTP step
  gameState.currentPhone = phone;
  gameState.currentOTP = generateMockOTP();
  gameState.enteredOTP = '';

  // Update OTP display
  document.getElementById('otp-phone-display').textContent = `We sent a code to +91 ${formatPhoneDisplay(phone)}`;

  // Transition to OTP step
  transitionToStep(2);

  // Start resend timer
  startResendTimer();

  // Initialize canvas and game
  setTimeout(() => {
    initializeGame();
  }, 300);

  showToast('OTP sent successfully! Use the game to enter it.', 'success');
  console.log('Mock OTP for testing:', gameState.currentOTP);
}

/**
 * Transition between form steps with animation
 */
function transitionToStep(stepNumber) {
  const allSteps = document.querySelectorAll('.login-step');
  allSteps.forEach((step) => {
    if (parseInt(step.dataset.step) === stepNumber) {
      step.style.display = 'block';
      step.offsetHeight; // Trigger reflow
      step.classList.add('fade-in');
    } else {
      step.style.display = 'none';
    }
  });
}

/**
 * Go back to phone entry step
 */
function goBackToPhone() {
  transitionToStep(1);
  gameState.enteredOTP = '';
  clearOTPDisplay();
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  document.getElementById('phone').value = '';
  document.getElementById('phone').focus();
}

/**
 * Toggle to email sign-in (placeholder)
 */
function toggleForm() {
  showToast('Email sign-in coming soon!', 'info');
}

/**
 * Toggle new user registration (placeholder)
 */
function toggleNewUser() {
  showToast('Registration coming soon! Use test number: 9876543210', 'info');
}

/**
 * Resend OTP
 */
function resendOTP() {
  gameState.currentOTP = generateMockOTP();
  gameState.enteredOTP = '';
  clearOTPDisplay();
  startResendTimer();
  showToast('OTP resent successfully!', 'success');
  console.log('New OTP for testing:', gameState.currentOTP);
}

/**
 * Start resend timer countdown
 */
function startResendTimer() {
  let remaining = 30;
  const timerSpan = document.getElementById('resend-timer');
  const resendBtn = document.querySelector('.btn-link');

  if (gameState.timerInterval) clearInterval(gameState.timerInterval);

  resendBtn.disabled = true;

  gameState.timerInterval = setInterval(() => {
    remaining--;
    timerSpan.textContent = remaining;

    if (remaining <= 0) {
      clearInterval(gameState.timerInterval);
      resendBtn.disabled = false;
      timerSpan.textContent = '0';
    }
  }, 1000);
}

/* ==========================================================================
   OTP ENTRY & VALIDATION
   ========================================================================== */

/**
 * Add digit to OTP
 */
function addDigitToOTP(digit) {
  if (gameState.enteredOTP.length >= 6) return;

  gameState.enteredOTP += digit;
  updateOTPDisplay();
  playSound('success');

  if (gameState.enteredOTP.length === 6) {
    // Enable verify button when all 6 digits entered
    document.getElementById('btn-verify-otp').disabled = false;
    playSound('success');
  }
}

/**
 * Remove last digit from OTP
 */
function removeLastDigit() {
  if (gameState.enteredOTP.length === 0) return;

  gameState.enteredOTP = gameState.enteredOTP.slice(0, -1);
  updateOTPDisplay();
}

/**
 * Clear all OTP digits
 */
function clearOTPDisplay() {
  gameState.enteredOTP = '';
  updateOTPDisplay();
  document.getElementById('btn-verify-otp').disabled = true;
}

/**
 * Update OTP slots display
 */
function updateOTPDisplay() {
  const slots = document.querySelectorAll('.otp-slot');

  slots.forEach((slot, index) => {
    slot.classList.remove('filled', 'completed');

    if (index < gameState.enteredOTP.length) {
      const digit = gameState.enteredOTP[index];
      slot.textContent = `[ ${digit} ]`;
      slot.classList.add('filled');

      if (gameState.enteredOTP.length === 6 && gameState.enteredOTP === gameState.currentOTP) {
        slot.classList.add('completed');
      }
    } else {
      slot.textContent = '[ _ ]';
    }
  });
}

/**
 * Verify OTP and handle login
 */
function verifyOTP() {
  const btnVerify = document.getElementById('btn-verify-otp');
  btnVerify.disabled = true;

  if (gameState.enteredOTP.length !== 6) {
    showToast('Please enter a 6-digit OTP', 'error');
    btnVerify.disabled = false;
    return;
  }

  if (gameState.enteredOTP === gameState.currentOTP) {
    // Success
    playSound('success');
    showToast('Login successful! Redirecting...', 'success');

    // Simulate login and redirect
    setTimeout(() => {
      // Store user session
      localStorage.setItem('user_phone', gameState.currentPhone);
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_login_time', new Date().toISOString());

      // Redirect to profile or dashboard
      window.location.href = '../index.html?user=logged_in';
    }, 1500);
  } else {
    // Failed
    playSound('error');
    showToast('Incorrect OTP. Please try again.', 'error');
    gameState.enteredOTP = '';
    updateOTPDisplay();
    btnVerify.disabled = false;
    gameState.currentOTP = generateMockOTP();
    console.log('New OTP for testing:', gameState.currentOTP);
  }
}

/* ==========================================================================
   CANVAS & SLINGSHOT GAME MECHANICS
   ========================================================================== */

/**
 * Initialize the Slingshot game canvas
 */
function initializeGame() {
  canvas = document.getElementById('slingshot-canvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  ctx = canvas.getContext('2d');

  // Set canvas resolution
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Adjust game config for canvas size
  gameConfig.canvasWidth = canvas.width;
  gameConfig.canvasHeight = canvas.height;
  gameConfig.slingshotX = canvas.width * 0.12;
  gameConfig.slingshotY = canvas.height * 0.85;
  gameConfig.targetX = canvas.width * 0.88;
  gameConfig.targetY = canvas.height * 0.25;

  // Add event listeners
  canvas.addEventListener('mousedown', handleCanvasMouseDown);
  canvas.addEventListener('mousemove', handleCanvasMouseMove);
  canvas.addEventListener('mouseup', handleCanvasMouseUp);
  canvas.addEventListener('touchstart', handleCanvasTouchStart);
  canvas.addEventListener('touchmove', handleCanvasTouchMove);
  canvas.addEventListener('touchend', handleCanvasTouchEnd);

  // Start animation loop
  animateGame();
}

/**
 * Handle canvas mouse down
 */
function handleCanvasMouseDown(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const dist = Math.hypot(x - gameConfig.slingshotX, y - gameConfig.slingshotY);
  if (dist < 60) {
    gameState.isDragging = true;
    gameState.mouseX = x;
    gameState.mouseY = y;
  }
}

/**
 * Handle canvas mouse move
 */
function handleCanvasMouseMove(e) {
  const rect = canvas.getBoundingClientRect();
  gameState.mouseX = e.clientX - rect.left;
  gameState.mouseY = e.clientY - rect.top;
}

/**
 * Handle canvas mouse up
 */
function handleCanvasMouseUp(e) {
  if (!gameState.isDragging) return;

  gameState.isDragging = false;

  // Calculate launch velocity
  const dx = gameState.mouseX - gameConfig.slingshotX;
  const dy = gameState.mouseY - gameConfig.slingshotY;
  const distance = Math.hypot(dx, dy);

  if (distance > 20) {
    launchProjectile(-dx * 0.8, -dy * 0.8);
  }
}

/**
 * Handle touch start
 */
function handleCanvasTouchStart(e) {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  const dist = Math.hypot(x - gameConfig.slingshotX, y - gameConfig.slingshotY);
  if (dist < 60) {
    gameState.isDragging = true;
    gameState.mouseX = x;
    gameState.mouseY = y;
  }
}

/**
 * Handle touch move
 */
function handleCanvasTouchMove(e) {
  if (!gameState.isDragging) return;
  e.preventDefault();

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  gameState.mouseX = touch.clientX - rect.left;
  gameState.mouseY = touch.clientY - rect.top;
}

/**
 * Handle touch end
 */
function handleCanvasTouchEnd(e) {
  if (!gameState.isDragging) return;

  gameState.isDragging = false;

  const dx = gameState.mouseX - gameConfig.slingshotX;
  const dy = gameState.mouseY - gameConfig.slingshotY;
  const distance = Math.hypot(dx, dy);

  if (distance > 20) {
    launchProjectile(-dx * 0.8, -dy * 0.8);
  }
}

/**
 * Launch projectile from slingshot
 */
function launchProjectile(velocityX, velocityY) {
  if (gameState.enteredOTP.length >= 6) return;

  const digit = gameState.currentOTP[gameState.enteredOTP.length];

  gameState.projectiles.push({
    x: gameConfig.slingshotX,
    y: gameConfig.slingshotY,
    vx: velocityX,
    vy: velocityY,
    digit: digit,
    color: getDigitColor(digit),
    active: true,
  });

  playSound('launch');
}

/**
 * Get color based on digit
 */
function getDigitColor(digit) {
  const colors = [
    '#ef4444', // 0 - red
    '#f97316', // 1 - orange
    '#eab308', // 2 - yellow
    '#22c55e', // 3 - green
    '#06b6d4', // 4 - cyan
    '#3b82f6', // 5 - blue
    '#8b5cf6', // 6 - purple
    '#ec4899', // 7 - pink
    '#14b8a6', // 8 - teal
    '#f43f5e', // 9 - rose
  ];
  return colors[digit] || '#0d9488';
}

/**
 * Main animation loop
 */
function animateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  drawBackground();

  // Update and draw projectiles
  updateProjectiles();

  // Draw slingshot
  drawSlingshot();

  // Draw target
  drawTarget();

  requestAnimationFrame(animateGame);
}

/**
 * Draw background
 */
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#e0f2fe');
  gradient.addColorStop(1, '#f0fdfa');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid pattern (optional)
  ctx.strokeStyle = 'rgba(13, 148, 136, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

/**
 * Draw slingshot
 */
function drawSlingshot() {
  const sx = gameConfig.slingshotX;
  const sy = gameConfig.slingshotY;

  // Base
  ctx.fillStyle = '#8b5a2b';
  ctx.beginPath();
  ctx.ellipse(sx, sy, 25, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Left arm
  ctx.strokeStyle = '#a0652f';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(sx - 15, sy - 8);
  ctx.lineTo(sx - 30, sy - 80);
  ctx.stroke();

  // Right arm
  ctx.beginPath();
  ctx.moveTo(sx + 15, sy - 8);
  ctx.lineTo(sx + 30, sy - 80);
  ctx.stroke();

  // Elastic bands (if dragging)
  if (gameState.isDragging) {
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(sx - 30, sy - 80);
    ctx.quadraticCurveTo(sx - 10, sy - 20, gameState.mouseX, gameState.mouseY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(sx + 30, sy - 80);
    ctx.quadraticCurveTo(sx + 10, sy - 20, gameState.mouseX, gameState.mouseY);
    ctx.stroke();

    // Draw projectile at drag position
    ctx.fillStyle = getDigitColor(gameState.currentOTP[gameState.enteredOTP.length]);
    ctx.beginPath();
    ctx.arc(gameState.mouseX, gameState.mouseY, gameConfig.projectileRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw digit
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gameState.currentOTP[gameState.enteredOTP.length], gameState.mouseX, gameState.mouseY);
  }
}

/**
 * Draw target
 */
function drawTarget() {
  const tx = gameConfig.targetX;
  const ty = gameConfig.targetY;
  const tr = gameConfig.targetRadius;

  // Outer ring
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(tx, ty, tr, 0, Math.PI * 2);
  ctx.stroke();

  // Middle ring
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(tx, ty, tr - 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center dot
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(tx, ty, 8, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Update and draw projectiles
 */
function updateProjectiles() {
  for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
    const p = gameState.projectiles[i];

    // Apply physics
    p.vx *= gameConfig.elasticity;
    p.vy *= gameConfig.elasticity;
    p.vy += gameConfig.gravity;

    p.x += p.vx;
    p.y += p.vy;

    // Check collision with target
    const distToTarget = Math.hypot(p.x - gameConfig.targetX, p.y - gameConfig.targetY);
    if (distToTarget < gameConfig.targetRadius + gameConfig.projectileRadius) {
      addDigitToOTP(p.digit);
      gameState.projectiles.splice(i, 1);
      continue;
    }

    // Remove if out of bounds
    if (p.x < -50 || p.x > canvas.width + 50 || p.y > canvas.height + 50) {
      gameState.projectiles.splice(i, 1);
      continue;
    }

    // Draw projectile
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, gameConfig.projectileRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw digit on projectile
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.digit, p.x, p.y);
  }
}

/* ==========================================================================
   DIGIT BUTTON HANDLERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Attach digit button handlers
  document.querySelectorAll('.digit-btn[data-digit]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const digit = btn.dataset.digit;
      addDigitToOTP(digit);
    });
  });

  // Clear button
  const clearBtn = document.getElementById('btn-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearOTPDisplay();
    });
  }

  // Backspace button
  const backspaceBtn = document.getElementById('btn-backspace');
  if (backspaceBtn) {
    backspaceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      removeLastDigit();
    });
  }

  // Verify OTP button
  const verifyBtn = document.getElementById('btn-verify-otp');
  if (verifyBtn) {
    verifyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      verifyOTP();
    });
  }

  // Sound toggle
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      gameConfig.soundEnabled = !gameConfig.soundEnabled;
      soundToggle.classList.toggle('muted');
      showToast(gameConfig.soundEnabled ? 'Sound enabled' : 'Sound muted', 'info');
    });
  }

  // Keyboard support for OTP entry
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('step-otp').style.display || document.getElementById('step-otp').style.display === 'none') {
      return;
    }

    if (/^\d$/.test(e.key)) {
      addDigitToOTP(e.key);
    } else if (e.key === 'Backspace') {
      removeLastDigit();
    } else if (e.key === 'Enter') {
      verifyOTP();
    }
  });
});

// Log test OTP on page load for development
console.log('%cMediCare Plus Login - Development Mode', 'font-size: 14px; color: #0d9488; font-weight: bold;');
console.log(`Test phone: 9876543210`);
console.log(`Initial OTP: ${gameState.currentOTP}`);
console.log('Enter phone number to receive a new OTP.');
