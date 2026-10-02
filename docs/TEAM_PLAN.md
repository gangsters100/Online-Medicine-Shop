# Team Plan & Roadmap: Medicine Shop Platform

## Project Goal
Develop a professional-grade online medicine shop. The project is split into two major phases:
1. **Frontend (Now - 6 Months)**: Build a high-fidelity frontend using React/Vite that mimics production behavior using local mocks.
2. **Backend (After 6 Months)**: Migration to a Spring Boot modular monolith backend with PostgreSQL.

---

## Team Structure

| Role | Member Name | Responsibility |
| :--- | :--- | :--- |
| **Member 1** | Soham Shinde | Foundation, Homepage, UI Components |
| **Member 2** | Arindam Sarkar | Product Catalog, Discovery, Filtering |
| **Member 3** | Adithya H K | Product Detail, Cart Logic, Persistence |
| **Member 4** | Muhammad Abrar Aamir Sheikh | Auth Flow, Checkout, Profile |

---

## Development Roadmap

### Phase 1: Foundation (Frontend)
- Define `DESIGN_SYSTEM.md` (colors, typography).
- Scaffolding React/Vite project according to `ARCHITECTURE.md`.

### Phase 2: Core Frontend Modules
- **Modular Development**: Each member builds out their assigned feature module (Catalog, Cart, Auth, UI).
- **Communication Contract**: All frontend data binding MUST use the interface definitions specified in `docs/API_CONTRACT.md`.

### Phase 3: Mock Intergration
- Replace UI static content with simulated API calls reading from `frontend/data/products.json`.
- This ensures the React components are ready to receive live data when the backend arrives.

### Phase 4: Frontend Polish
- Responsiveness, performance optimization, and integration of all modules in a single SPA.

### Phase 5: Future Backend Integration (Milestone: 6 Months)
- Scaffolding Spring Boot modular monolith according to `ARCHITECTURE.md` backend modules.
- Migration of persistence layer from `localStorage` to PostgreSQL.
- Implementation of API endpoints in Spring Boot.
- Connecting frontend `fetch` calls to real Spring Boot API.

---

## Frontend-Backend Synchronization Strategy
- **Interface Driven Development**: Even while building the frontend, we are writing code *as if* the backend exists.
- **Contract-First**: If any frontend member needs to change how data is perceived, they MUST update `docs/API_CONTRACT.md` before updating the React components. This avoids breaking changes when the backend team starts in 6 months.
