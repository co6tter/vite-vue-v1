# vite-vue-v1

## Overview

A modern Vue 3 application built with Vite and TypeScript. This project includes form validation with VeeValidate and Yup, state management with Pinia, and styling with TailwindCSS.

## Tech Stack

- **Frontend Framework**: Vue 3.5.18
- **Build Tool**: Vite 7.0.5
- **Language**: TypeScript 5.8.3
- **Routing**: Vue Router 4.5.1
- **State Management**: Pinia 3.0.3
- **Styling**: TailwindCSS 4.1.11
- **Form Validation**: VeeValidate 4.8.6 + Yup 1.6.1
- **Testing**: Vitest 3.2.4 with Happy DOM
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Commit Convention**: Commitlint with Conventional Commits
- **Package Manager**: pnpm 10.13.1

## Setup

```bash
# Install dependencies
pnpm install

# Prepare git hooks
pnpm prepare
```

## Usage

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

## Directory Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable Vue components
│   ├── BaseCard.vue
│   └── CustomInput.vue
├── router/         # Vue Router configuration
├── stores/         # Pinia state management
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── validation/     # Validation schemas
├── views/          # Page components
└── main.ts         # Application entry point
```

## License

This repository is for personal/private use only.
