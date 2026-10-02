# Code Review Guide

This guide defines the standards and expectations for code reviews for the Medicine Shop project. As maintainers, your goal is not just to find bugs, but to share knowledge and maintain project health.

## The Reviewer's Checklist

Before approving any Pull Request (PR), verify the following:

### 1. Correctness & Functionality
- [ ] Does the code function as expected? 
- [ ] Is the logic sound? (Check for potential edge cases or errors)
- [ ] Are variable names descriptive and follow the [ARCHITECTURE.md](/docs/ARCHITECTURE.md) naming conventions?

### 2. Standards & Style
- [ ] Does it follow the Design System (uses CSS variables, no hardcoded colors/px)?
- [ ] Is it modular? (Are functions separated correctly according to `api.js` vs `ui.js`?)
- [ ] Did the contributor follow the branch naming convention (`feature/name-feature`)?

### 3. Documentation & Process
- [ ] Did the contributor update the [TEAM_PLAN.md](/docs/TEAM_PLAN.md) if their task scope changed?
- [ ] Is there an entry in the [LEARNING_LOG.md](/docs/LEARNING_LOG.md) if they encountered a difficult challenge or mistake?
- [ ] Does the PR description clearly answer: **What** changed, **Why**, and **How it was tested**?

## Reviewer Philosophy
- **Be Constructive**: Don't say "This is wrong." Say, "This approach might cause issues with state management; have you considered doing X instead?"
- **Enforce Quality**: If the code is messy, don't approve it. Ask for a refactor.
- **Maintainer Authority**: As a maintainer (Muhammad or Adithya), you have the final say. If you block a PR, explain why clearly based on the established architecture.
