# Contributing Guidelines

To ensure the stability of the Medicine Shop project, all team members must follow this Git Flow strategy.

## Branching Strategy
- **main**: Only stable, production-ready code.
- **dev**: Development branch where all features are integrated.
- **feature/name-feature**: Individual branches for specific tasks (e.g., `feature/Soham-homepage`).

## Workflow Steps

1. **Before you start:**
   Ensure you are on the latest `dev` branch:
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-name-feature-name
   ```

3. **Development:** 
   Code your feature. **You MUST NOT push directly to `dev` or `main`.** Our branch protection rules will prevent this to ensure code quality.

4. **Commit your changes:**
   Follow conventional commit messages (e.g., "feat: implement hero section").

5. **Submit a Pull Request (PR):**
   - Push your feature branch to GitHub.
   - Open a PR in GitHub **targeting the `dev` branch**.
   - Your PR description MUST outline: What changed, why, and how it was tested.
   - Request review from a maintainer (Muhammad or Adithya).

6. **Merging:**
   - Once approved by a maintainer, merge the PR into `dev`.
   - Delete your feature branch after merging to keep the repo clean.

---
*Remember: The `main` branch is protected. NEVER push code directly to `main`.*
