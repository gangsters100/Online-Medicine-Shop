# Learning Log & Retrospective

The goal of this document is to capture the "wins," the mistakes, and the lessons learned throughout the lifecycle of the Medicine Shop project. This is a living document—update it whenever you encounter a significant bug, a tough architectural challenge, or a "lightbulb" moment.

## How to use this log
- **Mistake**: What went wrong? Why did it happen?
- **Lesson**: How will we fix it or handle it better next time?
- **Wins**: What did we implement that we are proud of?

---

### Phase 1: Setup & Initialization
*   **Mistake:** Initially, frontend colors and layout had placeholder stub values (`#000000`) without clear contrast ratios or healthcare design tokens.
*   **Lesson:** Defining an interface-first design system with CSS custom properties (`:root`) upfront ensures all subsequent team members (Catalog, Detail, Auth) build consistent, accessible components.
*   **Wins:** Established complete medical color tokens (teal, clinical sky, amber Rx alerts), spacing system, responsive elevation shadows, and CSS reset.

### Phase 2: Frontend Implementation
*   **Mistake:** 
    1. Navigation links had abrupt color shifts without smooth animated transitions or hover feedback.
    2. Medicine card images using `object-fit: cover` cropped out essential product labels, dosages, and pack edges.
    3. Product catalog was modeled with generic USD pricing rather than the target Indian market.
*   **Lesson:** 
    1. Micro-animations (e.g. `transform: translateX(-50%)` expanding underline, logo rotation, cart bounce) dramatically increase perceived quality.
    2. Healthcare e-commerce product cards require `object-fit: contain` with fixed height and padding so entire strips, blisters, and bottles remain visible without clipping.
    3. Localization requires deep contextual alignment: INR (`₹`) formatting with `en-IN`, Schedule H/H1 prescription compliance (Drugs & Cosmetics Act), authentic Indian brands (Dolo 650, Crocin, Augmentin, Becosules), UPI/COD payment options, and 25,000+ PIN code coverage.
*   **Wins:** Implemented full semantic Indian healthcare homepage with crisp embedded SVG packaging artwork, Schedule H/H1 red regulatory badges, smooth navbar hover micro-interactions, prescription upload modal, and responsive design.

---

## Technical Learnings
- *Navbar Micro-interactions: Used CSS pseudo-elements `::after` with cubic-bezier easing to produce expanding underline animations that gracefully highlight active and hovered navigation links.*
- *Medical Card Image Rendering: Replaced cropped image ratios with a dedicated 210px flex container, `object-fit: contain`, and drop-shadows, ensuring clear visibility of medicine labels and packaging.*
- *Indian Regulatory Integration: Integrated Schedule H & Schedule H1 prescription rules under the Indian Drugs & Cosmetics Act, including red ribbon alerts and Registered Medical Practitioner (RMP) verification requirements.*

---

## Team & Process Learnings
- *Example: Realized that we need PR descriptions to be more specific to avoid conflicts.*
