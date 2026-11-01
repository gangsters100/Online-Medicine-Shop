# Online Medicine Shop

This is a collaborative full-stack web project built by 4 students with a long-term goal of building a professional, maintainable application.

## Development Strategy
- **Phase 1 (Now):** Implementation of high-fidelity frontend using **Vanilla HTML, CSS, and Modular JavaScript (ES6)**.
- **Phase 2 (Future - 6 Months+):** Migration to a **Spring Boot** modular monolith backend with **PostgreSQL**.
- **Philosophy**: Interface-Driven Development. We code our frontend today by adhering to the data contracts defined in `docs/API_CONTRACT.md`.

## Project Structure

```text
Medicine-Shop/
├── backend/          # Future Spring Boot source code
├── docs/             # Project documentation
│   ├── ARCHITECTURE.md
│   ├── API_CONTRACT.md
│   ├── DESIGN_SYSTEM.md
│   ├── TEAM_PLAN.md
│   ├── LEARNING_LOG.md
│   └── AUTH_MODULE.md             # ✅ Authentication module guide
├── frontend/         # Vanilla Frontend
│   ├── assets/       # Images, icons, static files
│   ├── css/
│   │   ├── style.css              # Global styles & design tokens
│   │   └── login.css              # ✅ Authentication styling (890+ lines)
│   ├── js/
│   │   ├── ui.js                  # Toast notifications & shared UI
│   │   ├── auth.js                # ✅ Login logic (540+ lines)
│   │   └── signup.js              # ✅ Signup logic (570+ lines)
│   ├── pages/
│   │   ├── index.html             # Homepage
│   │   ├── login.html             # ✅ 4-step login flow
│   │   └── signup.html            # ✅ 3-step signup flow
│   └── index.html                 # Entry point
```

## ✅ Completed Features

### Authentication Module (Member 4) - 100% Complete
- ✅ **4-Step Login Flow:** Phone → Password → OTP Game → Success
- ✅ **3-Step Signup Flow:** Personal Info → OTP Game → Success
- ✅ **Gamified Slingshot OTP Game:** Drag ball to shoot digits into slots
- ✅ **Direct OTP Input:** Accessibility fallback for direct typing
- ✅ **Full Validations:**
  - Phone: 10-digit Indian format (+91)
  - Email: Regex validation
  - Password: Minimum 8 characters
  - OTP: 6-digit generation & verification
- ✅ **Responsive Design:** Desktop (horizontal), Tablet (vertical), Mobile (single column)
- ✅ **Session Management:** Auth tokens & user data storage
- ✅ **Toast Notifications:** Success/error/info feedback
- ✅ **Resend OTP Timer:** 60-second countdown with cleanup
- ✅ **Canvas Physics Engine:**
  - Drag detection (35px radius)
  - Max pull distance (75px)
  - Smooth 20-frame animation
  - Touch + mouse support
- ✅ **Social Login UI:** Google & Apple buttons (placeholders)

**[👉 Full Auth Documentation](docs/AUTH_MODULE.md)**

---

## 🚀 Quick Start

### View Live Pages

**Homepage:**
```bash
http://localhost:8000/frontend/pages/index.html
```

**Test Login:**
```bash
http://localhost:8000/frontend/pages/login.html
```
- Phone: `9876543210`
- Password: `testpass123` (any 8+ chars)
- OTP: displayed in console & toast

**Test Signup:**
```bash
http://localhost:8000/frontend/pages/signup.html
```
- All fields required
- Same OTP game as login

### Local Development

```bash
# Start HTTP server
cd frontend
python3 -m http.server 8000

# Open browser
http://localhost:8000
```

---

## 📚 Documentation

- [Team Plan](/docs/TEAM_PLAN.md)
- [Design System](/docs/DESIGN_SYSTEM.md)
- [API Contract](/docs/API_CONTRACT.md)
- [Architecture](/docs/ARCHITECTURE.md)
- [Learning Log](/docs/LEARNING_LOG.md)
- [Code Review Guide](/docs/CODE_REVIEW_GUIDE.md)
- **[🆕 Authentication Module](/docs/AUTH_MODULE.md)** - Complete auth guide with code examples, diagrams, and testing checklist

## 🎯 In Progress / Upcoming

### Next: Checkout Flow (Member 4)
- Address input & validation
- Prescription upload
- Coupon code system
- Payment gateway integration

### Future: User Profile (Member X)
- Order history
- Saved addresses
- Wishlist management

### Future: Additional Features
- Password reset flow
- Email verification
- Two-factor authentication

---

## 📊 Project Status

| Module | Status | Member | Lines | Docs |
|--------|--------|--------|-------|------|
| **Authentication** | ✅ Complete | Member 4 | 1100+ | ✅ |
| **Homepage** | ✅ Complete | Member 1 | - | - |
| **Catalog** | ✅ Complete | Member 1 | - | - |
| **Checkout** | 🟡 Next | Member 4 | - | - |
| **User Profile** | ⏳ Planned | TBD | - | - |

---

## 🐛 Bug Fixes (Authentication)

All 7 bugs identified and resolved:
1. ✅ Digit button directly entering → Fixed with `loadDigitIntoSlingshot()`
2. ✅ Grid layout broken → Fixed with flexbox
3. ✅ Timer memory leaks → Fixed with interval cleanup
4. ✅ Horizontal showing vertical → Fixed with media queries
5. ✅ OTP slots below canvas → Moved above as visual target
6. ✅ Dashed target hint cluttering → Removed
7. ✅ Alignment mismatches → Fixed with proper flex sizing

---

## Screenshots
*To be added as the frontend matures.*

## Live Deployment
*To be added upon deployment.*

---

*Created by: Soham Shinde, Arindam Sarkar, Adithya H K, Muhammad Abrar Aamir Sheikh*

**Current Phase:** Frontend Development with Design-First Approach  
**Last Updated:** 2026-10-31
