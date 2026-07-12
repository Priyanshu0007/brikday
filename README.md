# ✦ Brikday — Neo-Brutalist Productivity & Habit Tracker

**A high-performance, local-first personal productivity app with a neo-brutalist design language. Features habit tracking, financial goal management (Vault), side-project planning (Blueprint), and advanced analytics.**

[![React Native](https://img.shields.io/badge/React_Native-0.86-blue?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_57-black?style=for-the-badge&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MMKV](https://img.shields.io/badge/Database-MMKV_v4-007acc?style=for-the-badge&logo=sqlite&logoColor=white)](https://github.com/mrousavy/react-native-mmkv)

---

[![Home Page](https://cdn.jsdelivr.net/gh/Priyanshu0007/CDN@11b1423c5d9da4ebbcc07cd6971d1f7f59c4909b/brikday/habits.png)](#)

*Engine Tab — daily habit tracking featuring neo-brutalist cards, hard offset shadows, and haptic feedback.*

---

## 📋 Table of Contents

- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [State & Persistence Workflows](#-state--persistence-workflows)
- [Project Structure](#-project-structure)
- [Pages & Screens](#-pages--screens)
- [Key Features](#-key-features)
- [Getting Started](#-getting-started)
- [Design System](#-design-system)

---

## 📸 Screenshots

### 🚀 Onboarding
[![Onboarding Page](https://cdn.jsdelivr.net/gh/Priyanshu0007/CDN@11b1423c5d9da4ebbcc07cd6971d1f7f59c4909b/brikday/onboarding.png)](#)

*Smooth swipeable onboarding experience powered by PagerView and Reanimated.*

### ⚙️ Engine (Habits)
[![Engine Page](https://cdn.jsdelivr.net/gh/Priyanshu0007/CDN@11b1423c5d9da4ebbcc07cd6971d1f7f59c4909b/brikday/habits.png)](#)

*Engine tab — track your daily routines and habits with satisfying interactions and micro-animations.*

### 🏦 Vault (Financial Goals)
[![Vault Page](https://cdn.jsdelivr.net/gh/Priyanshu0007/CDN@11b1423c5d9da4ebbcc07cd6971d1f7f59c4909b/brikday/vault.png)](#)

*Vault tab — visually manage savings goals and track your progress with brutalist gauge elements.*

### 🏗️ Blueprint (Side Projects)
[![Blueprint Page](https://cdn.jsdelivr.net/gh/Priyanshu0007/CDN@11b1423c5d9da4ebbcc07cd6971d1f7f59c4909b/brikday/projects.png)](#)

*Blueprint tab — organize side-projects, log ideas, and stay on top of actionable tasks.*

### 📊 Analytics
[![Analytics Page](https://cdn.jsdelivr.net/gh/Priyanshu0007/CDN@11b1423c5d9da4ebbcc07cd6971d1f7f59c4909b/brikday/analytics.png)](#)

*Analytics screen — dive into your streaks, completion heatmaps, and long-term consistency stats.*

### 🛠️ Settings
[![Settings Page](https://cdn.jsdelivr.net/gh/Priyanshu0007/CDN@11b1423c5d9da4ebbcc07cd6971d1f7f59c4909b/brikday/setting.png)](#)

*Settings page — manage themes, data migrations, and app preferences.*

---

## 🛠️ Tech Stack

### Core Framework

| Technology | Version | Role |
|------------|---------|------|
| [Expo](https://expo.dev/) | `SDK 57` | Universal React framework (Managed → CNG prebuild) |
| [React Native](https://reactnative.dev) | `0.86` | Mobile UI Library |
| TypeScript | `6.x` | Strict typing and schema integrity |

### Styling & Animations

| Technology | Version | Role |
|------------|---------|------|
| Unistyles | `v3` | High-performance dynamic styling and themes |
| Reanimated | `v4` | Smooth 60fps animations & gesture-driven UI |
| Pressto | — | Spring-based scale/offset press animations |
| Google Fonts | — | Space Grotesk, Plus Jakarta Sans, Space Mono |

### Database & State Management

| Technology | Version | Role |
|------------|---------|------|
| [MMKV](https://github.com/mrousavy/react-native-mmkv) | `v4` | High-performance synchronous key-value storage |
| [Legend State](https://legendapp.com/open-source/state/) | `v3` | Fast observable state management with native MMKV sync |
| Legend List | `v3` | Optimized large list rendering |

---

## 🏗️ Architecture Overview

```
                        ┌────────────────────────────────────────┐
                        │             Mobile Client              │
                        │   (iOS / Android via Expo Prebuild)    │
                        └───────────────────┬────────────────────┘
                                            │
                                User Interaction (Pressto)
                                            ▼
                        ┌────────────────────────────────────────┐
                        │           Legend State Slices          │
                        │    (habits$, vault$, blueprint$)       │
                        └───────────┬────────────────┬───────────┘
                                    │                │
            Observe State           │                │ App Actions
            (.get() + observer)     │                │ (Mutations)
                                    ▼                ▼
                        ┌───────────┴────┐   ┌───────┴───────────┐
                        │  MMKV Storage  │   │  Hybrid Logs      │
                        │(Legend Sync)   │   │  (Raw MMKV Keys)  │
                        └────────────────┘   └───────────────────┘
```

### Key Architectural Decisions

- **Local-First Storage**: User data is kept exclusively on their device inside MMKV. Extremely fast, synchronous read/writes.
- **Hybrid Persistence Model**: Master configuration (e.g., Habit templates) are persisted via Legend State's sync plugin, while daily logs (e.g., `log:2024-03-24`) are written directly to raw MMKV keys to handle dynamic date-based partitioning.
- **Observable Reactivity**: Components use Legend State's `observer` HOC to render optimally when nested properties change, avoiding unnecessary re-renders.
- **Neo-Brutalist Primitives**: Custom design system built with `react-native-unistyles` featuring rigid offsets, monospace fonts, and stark contrasts instead of soft shadows and gradients.

---

## 🗄️ State & Persistence Workflows

1. **Observable Slices**: State is separated into feature-based slices (`habitsSlice.ts`, `vaultSlice.ts`, `blueprintSlice.ts`).
2. **Centralized Actions**: All mutations happen via the `appActions` object (`src/state/actions.ts`), ensuring predictable state updates.
3. **Data Migrations**: Built-in `migration.ts` runs on layout mount to upgrade old storage schemas to newer versions cleanly.

---

## 📁 Project Structure

```
src/
├── app/                         # Expo Router file-based routes
│   ├── _layout.tsx              # Root layout — fonts, themes, GestureHandler
│   ├── index.tsx                # Main tabbed interface
│   ├── editor.tsx               # Modal route for entity creation
│   └── settings.tsx             # Settings and profile route
├── components/
│   ├── screens/                 # Full-screen feature components
│   │   ├── onboarding/          # PagerView onboarding flow
│   │   ├── entity-editor/       # Habit/Vault/Blueprint forms
│   │   ├── vault/               # Financial goal screens
│   │   ├── HabitsScreen.tsx     # Daily routine engine
│   │   ├── AnalyticsScreen.tsx  # Charts and streaks
│   │   └── BlueprintScreen.tsx  # Side-project manager
│   ├── ui/                      # Base UI elements
│   └── ...
├── ui/                          # Design-system primitives (Neo-brutalist)
│   ├── BrutalistCard.tsx        # Card with solid shadow + offset press animation
│   ├── BrutalistButton.tsx      # Core button component
│   ├── BrutalistInput.tsx       # Form input fields
│   ├── Typography.tsx           # Type scale (h1, h2, mono, etc.)
│   └── haptics.ts               # Haptic feedback wrapper
├── state/                       # Global observables and MMKV sync
│   ├── store.ts                 # Barrel exports
│   ├── actions.ts               # State mutation handlers
│   ├── plugin.ts                # Legend State MMKV integration
│   ├── migration.ts             # Version-gated database upgrades
│   └── slices/                  # Feature state slices
├── constants/
│   └── theme.ts                 # Unistyles design tokens
├── unistyles/                   # Breakpoints and runtime configuration
└── utils/                       # Date processing and helpers
```

---

## 🗺️ Pages & Screens

| Route / Tab | Description |
|-------|-------------|
| `Engine` (Habits) | Daily habit tracking isolated by date to build streaks |
| `Vault` | Financial goal setting, visualizing savings target progression |
| `Blueprint` | Side-project and task tracker with categorization |
| `Analytics` | Heatmaps and consistency metrics across all active tracking |
| `Editor Modal` | Universal creation form for routines, goals, and projects |
| `Settings` | Data management, debug tools (in `__DEV__`), and theme overrides |

---

## 🚀 Key Features

- **Neo-Brutalist Design System**: Bold black borders (`borderWidth: 3`), hard offset shadows, uppercase headings, and high-contrast color palettes.
- **Deep Haptic Integration**: Rich tactile feedback (`react-native-pulsar`) matching interactions—from soft list scrolls to rigid button presses and success ticks.
- **Advanced Press Interactions**: Custom `pressto` animated wrappers providing translating offset effects that perfectly align with the solid shadows when pressed.
- **Legendary Performance**: Direct MMKV synchronous data layer paired with `@legendapp/list` for ultra-fast infinite scrolling.
- **Dark Mode Ready**: Deep slate dark theme accented with mint greens and vivid golds powered by Unistyles.
- **Offline Reliability**: 100% device-local storage. No loading spinners, no network requests.

---

## 💻 Getting Started

### Prerequisites

- Node.js `>= 20.0`
- [Bun](https://bun.sh) (Required as the package manager)
- macOS (for iOS development)

### Installation

```bash
# Clone the repository
git clone https://github.com/Priyanshu0007/brikday.git
cd brikday

# Install dependencies using Bun
bun install

# Generate native Android and iOS folders via Expo CNG
bun run prebuild

# Start the Expo development server
bun start

# Run on Simulator/Emulator
bun run ios
# or
bun run android
```

---

## 🎨 Design System

- **Neo-Brutalist Theme**: Uses high-contrast backgrounds, stark black borders, flat accent colors, and no gradients.
- **Typography Guidelines**:
  - Headings: `Space Grotesk Bold` for high-impact titles.
  - Body: `Plus Jakarta Sans` for readable descriptions and long-form text.
  - Data: `Space Mono` for numeric metrics, streaks, and currency.
- **Interactive Gestures**: Cards and buttons utilize an offset translation animation that visually depresses the element into its hard shadow.

---

**Built with ♥ by [Priyanshu Gupta](https://priyanshu0007.vercel.app)**

[![GitHub](https://img.shields.io/badge/GitHub-Priyanshu0007-181717?style=flat-square&logo=github)](https://github.com/Priyanshu0007)
[![Portfolio](https://img.shields.io/badge/Portfolio-Live-22c55e?style=flat-square&logo=vercel)](https://priyanshu0007.vercel.app)
