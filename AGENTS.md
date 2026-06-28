# Brikday — AI Agent Instructions

> **Brikday** is a personal productivity app with a neo-brutalist design language.
> It tracks habits, financial goals (Vault), side-projects (Blueprint), and analytics.

---

## ⚠️ Critical: Expo SDK 56

This project runs **Expo SDK 56** with **React Native 0.85** and **React 19**.

**Always read the versioned docs before writing any code:**
<https://docs.expo.dev/versions/v56.0.0/>

Do **NOT** reference Expo SDK 51/52/53 patterns — many APIs have changed.

---

## Tech Stack at a Glance

| Layer            | Technology                                                            |
| ---------------- | --------------------------------------------------------------------- |
| Framework        | Expo SDK 56 (Managed → CNG prebuild)                                  |
| Language         | TypeScript 6 (strict mode)                                            |
| Navigation       | `expo-router` v56 (file-based routing)                                |
| State Management | `@legendapp/state` v3 (observables + `observer` HOC)                  |
| Lists            | `@legendapp/list` v3 (optimized list rendering)                       |
| Persistence      | `react-native-mmkv` v4 (via Legend State sync plugin + raw MMKV)      |
| Styling          | `react-native-unistyles` v3 (themes, breakpoints, Babel plugin)       |
| Animations       | `react-native-reanimated` v4                                          |
| Gestures         | `react-native-gesture-handler` v2                                     |
| Pressables       | `pressto` (`PressableScale` + `createAnimatedPressable`)              |
| Haptics          | `react-native-pulsar` (via `Presets.System.*`)                        |
| Safe Areas       | `react-native-safe-area-context` v5                                   |
| Fonts            | `@expo-google-fonts/*` — Space Grotesk, Plus Jakarta Sans, Space Mono |
| Package Manager  | **Bun** (use `bun` not `npm`/`yarn`)                                  |

---

## Project Structure

```
src/
├── app/                         # Expo Router file-based routes
│   ├── _layout.tsx              # Root layout — fonts, themes, GestureHandler, splash
│   ├── index.tsx                # Main tabbed screen (Engine/Vault/Blueprint/Analytics)
│   ├── editor.tsx               # Entity editor modal route
│   └── settings.tsx             # Settings page route
├── components/
│   ├── screens/                 # Full-screen feature components
│   │   ├── onboarding/          # Onboarding flow (PagerView + slides)
│   │   ├── entity-editor/       # CRUD editors for habits, vault goals, projects
│   │   ├── vault/               # Vault tab screens (GoalCard, GoalHistorySheet)
│   │   ├── HabitsScreen.tsx     # Engine tab — daily habit tracking
│   │   ├── AnalyticsScreen.tsx  # Analytics tab — streaks, heatmaps, charts
│   │   ├── BlueprintScreen.tsx  # Blueprint tab — side-project tracker
│   │   ├── LoginScreen.tsx      # Username login screen
│   │   └── SettingsScreen.tsx   # Settings/profile screen
│   ├── ui/                      # Shared lower-level UI components (collapsible, etc.)
│   ├── animated-icon.tsx        # Animated splash/icon component (native)
│   ├── animated-icon.web.tsx    # Animated splash/icon component (web)
│   ├── external-link.tsx        # External link helper component
│   ├── themed-text.tsx          # Legacy themed text (prefer Typography)
│   ├── themed-view.tsx          # Legacy themed view
│   ├── hint-row.tsx             # Onboarding hint row
│   └── web-badge.tsx            # Web platform badge
├── ui/                          # Design-system primitives
│   ├── BrutalistCard.tsx        # Neo-brutalist card with shadow + press animation
│   ├── BrutalistButton.tsx      # Neo-brutalist button
│   ├── BrutalistInput.tsx       # Neo-brutalist text input
│   ├── BrutalistBottomSheet.tsx # Bottom sheet wrapper
│   ├── Typography.tsx           # Text component (h1/h2/h3/body/bodyBold/mono/caption)
│   └── haptics.ts               # Haptic feedback helper (wraps react-native-pulsar)
├── state/                       # All state management
│   ├── store.ts                 # Barrel re-export of all slices, types, and actions
│   ├── types.ts                 # Shared TypeScript interfaces
│   ├── actions.ts               # Centralized `appActions` object
│   ├── plugin.ts                # MMKV persistence plugin for Legend State
│   ├── migration.ts             # Data migration logic (version-gated)
│   ├── devtool.ts               # Dev menu actions (reset storage, reset day)
│   ├── slices/                  # Feature-based observable slices
│   │   ├── authSlice.ts         # Auth/onboarding status
│   │   ├── userSlice.ts         # User profile
│   │   ├── uiSlice.ts           # Active tab, theme preference
│   │   ├── statsSlice.ts        # Streaks
│   │   ├── habitsSlice.ts       # Habit templates
│   │   ├── dailyLogSlice.ts     # Day-isolated habit completion logs
│   │   ├── vaultSlice.ts        # Financial goals
│   │   └── blueprintSlice.ts    # Side-projects
│   └── hardcoded-data/          # Initial/seed data for slices
│       ├── habits.ts
│       ├── vault.ts
│       └── blueprint.ts
├── constants/
│   └── theme.ts                 # Color palettes (light/dark), fonts, spacing tokens
├── unistyles/
│   └── index.ts                 # Unistyles config — breakpoints, themes, declaration merging
├── hooks/
│   ├── use-color-scheme.ts      # Native color scheme hook
│   ├── use-color-scheme.web.ts  # Web color scheme hook
│   └── use-theme.ts             # Theme convenience hook
├── utils/
│   └── date.ts                  # Date helpers (getLocalDateString, isHabitActiveOnDate,
│                                #   parseLocalDateString, getWeekDates, getMonthGrid, etc.)
└── global.css                   # Web-only CSS font fallbacks
```

---

## Path Aliases

Configured in `tsconfig.json`:

```
@/*       → ./src/*
@/assets/* → ./assets/*
```

**Always use `@/` imports.** Never use relative paths like `../../`.

---

## State Management Patterns

### Legend State v3

- All state lives in **observable slices** (`observable<T>(...)`) inside `src/state/slices/`.
- Slices are persisted via `syncObservable()` with the shared MMKV plugin (`src/state/plugin.ts`).
- Observable names end with `$` suffix (e.g. `habitTemplates$`, `todayLog$`, `authState$`).
- **All mutations** go through the centralized `appActions` object in `src/state/actions.ts`. Never mutate observables directly from components.
- Components use `import { observer } from '@legendapp/state/react'` HOC and read state with `.get()`.
- Import state from the barrel file: `import { appActions, habitTemplates$ } from '@/state/store'`.

### Adding a New Slice

1. Create `src/state/slices/newFeatureSlice.ts`:
   ```ts
   import { observable } from '@legendapp/state';
   import { syncObservable } from '@legendapp/state/sync';
   import { mmkvPlugin } from '../plugin';

   export const newFeature$ = observable<NewFeatureType>(initialValue);
   syncObservable(newFeature$, { persist: { name: 'newFeature', plugin: mmkvPlugin } });
   ```
2. Add type to `src/state/types.ts`.
3. Re-export from `src/state/store.ts`.
4. Add mutations to `appActions` in `src/state/actions.ts`.
5. If seed data is needed, add to `src/state/hardcoded-data/` and import in the slice.

### Daily Logs (Hybrid Persistence)

- `todayLog$` is an in-memory observable (NOT persisted via Legend State sync).
- Individual day logs are stored as raw MMKV strings: `mmkvStorage.getString('log:YYYY-MM-DD')`.
- `logIndex$` (list of all logged date strings) IS persisted via Legend State sync.
- The raw MMKV instance is created via `createMMKV({ id: 'brikday-storage' })` in `dailyLogSlice.ts`.
- This pattern exists because per-day logs are keyed dynamically and don't fit the single-key sync model.

---

## Styling Patterns

### Unistyles v3

- **Configuration**: `src/unistyles/index.ts` — imported once in `src/app/_layout.tsx` (`import '@/unistyles'`).
- **Themes**: `light` and `dark` themes with full color palettes, fonts, spacing.
- **Babel plugin**: `react-native-unistyles/plugin` is configured with `root: 'src'` in `babel.config.js`.

### Creating Stylesheets

```ts
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// Theme-aware stylesheet (function form)
const stylesheet = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.three,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
  },
}));

// In component:
const { theme } = useUnistyles();
```

### Style Array Syntax

**Always use array syntax** for combining styles — never object spread:

```ts
// ✅ Correct
<Text style={[styles.base, styles.variant]} />

// ❌ Wrong — causes Unistyles warnings
<Text style={{...styles.base, ...styles.variant}} />
```

---

## UI Component Conventions

### Design Language: Neo-Brutalism

- **Bold black borders** (`borderWidth: 3`, `borderColor: theme.colors.border`)
- **Hard offset shadows** (4px x 4px solid, no blur — `shadowRadius: 0`, `shadowOpacity: 1`)
- **Uppercase headings** (Typography `uppercase` prop or `.toUpperCase()` on data)
- **Flat accent colors** — no gradients on native; use curated palette from `theme.ts`
- **Monospace accents** for numeric data (Space Mono font)

### Using UI Primitives

Always prefer `src/ui/` primitives over raw `View`/`Text`:

| Component                | Purpose                                                                        |
| ------------------------ | ------------------------------------------------------------------------------ |
| `<Typography>`           | All text rendering — `variant` prop for size/weight                            |
| `<BrutalistCard>`        | Pressable card with shadow — supports `onPress`, `hapticFeedback`, `neglected` |
| `<BrutalistButton>`      | Pressable button with brutalist styling                                        |
| `<BrutalistInput>`       | Styled text input                                                              |
| `<BrutalistBottomSheet>` | Bottom sheet wrapper (uses `react-native-true-sheet`)                          |

### Typography Variants

```
h1      → SpaceGrotesk-Bold, 32px
h2      → SpaceGrotesk-Bold, 24px
h3      → SpaceGrotesk-Bold, 18px
body    → PlusJakartaSans-Regular, 15px
bodyBold → PlusJakartaSans-Bold, 15px
mono    → SpaceMono-Regular, 13px
caption → PlusJakartaSans-Regular, 12px (textMuted color)
```

### Haptic Feedback

Use `triggerHaptic()` from `@/ui/haptics` — wraps `react-native-pulsar`:

```ts
import { triggerHaptic } from '@/ui/haptics';
triggerHaptic('soft'); // default for cards
triggerHaptic('light'); // subtle taps
triggerHaptic('success'); // completion feedback
```

Available types: `light | medium | heavy | soft | rigid | success | warning | error | selection | none`

### Pressable Animations (Pressto)

`pressto` provides two APIs used in this project:

**1. `PressableScale`** — A simple scale-on-press wrapper used for tab bar items, back buttons, and lightweight interactive elements:

```tsx
import { PressableScale } from 'pressto';

<PressableScale onPress={handlePress} activeScale={0.93}>
  <Typography variant="mono">Label</Typography>
</PressableScale>;
```

**2. `createAnimatedPressable`** — A factory for custom press animations. Used in `BrutalistCard` and `BrutalistButton` for the neo-brutalist shadow-offset effect:

```ts
import { createAnimatedPressable } from 'pressto';

const PressableBrutalist = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [{ translateX: progress * 4 }, { translateY: progress * 4 }],
  };
});
```

The `progress` value goes from 0 → 1 on press. Keep offset at **4px** for standard cards/buttons (matches shadow).

---

## Navigation & Routing

- **File-based routing** via `expo-router` — routes are in `src/app/`.
- **Root layout** (`_layout.tsx`) wraps everything in `GestureHandlerRootView` → `ThemeProvider` → `Stack`.
- The main `index.tsx` manages a **custom tab bar** (not using expo-router tabs) with 4 tabs:
  - `engine` → HabitsScreen
  - `vault` → VaultScreen
  - `blueprint` → BlueprintScreen
  - `analytics` → AnalyticsScreen
- Tab state is managed via `uiState$.activeTab` (Legend State observable, not expo-router).
  - **Note**: Tab switching sets `uiState$.activeTab` directly in the component (a known exception to the `appActions`-only rule, since it's trivial UI state).
- **Auth flow**: `authState$.status` drives which screen renders:
  - `'onboarding'` → OnboardingScreen (PagerView slides)
  - `'login'` → LoginScreen _(currently bypassed in dev — routes to AppDashboard)_
  - `'authenticated'` → Main tabbed interface

---

## Theme & Dark Mode

- Theme preference stored in `uiState$.theme` — values: `'light' | 'dark' | 'system'`.
- Applied in `_layout.tsx` via `UnistylesRuntime.setTheme()` — reacts to both user preference and system `colorScheme`.
- Color tokens are in `src/constants/theme.ts` — always use `theme.colors.*` via `useUnistyles()`.
- **Dark theme palette**: Obsidian black background, deep slate cards, neon accents (mint green, vivid gold, electric rose).

---

## Animations

- Use `react-native-reanimated` v4 for all animations.
- Worklet functions must include the `'worklet'` directive.
- Animated styles use `useAnimatedStyle()`.
- Spring/timing via `withSpring()`, `withTiming()`.
- Shared values via `useSharedValue()`.
- Onboarding uses `react-native-pager-view` for swipeable slides.

---

## Platform Considerations

- **Primary targets**: Android and iOS via `expo prebuild` (CNG).
- **Web support**: Partial — `.web.tsx` file extensions for platform-specific implementations.
- `/ios` and `/android` directories are **gitignored** — generated via `expo prebuild`.
- Use `Platform.select()` for platform-specific values (see `BottomTabInset` in `theme.ts`).

---

## Scripts & Commands

Always use **`bun`** as the package manager:

```bash
bun install                     # Install dependencies
bun start                       # Start Expo dev server
bun run android                 # Run on Android device/emulator
bun run ios                     # Run on iOS simulator
bun run prebuild                # Generate native projects
bun run prebuild:clean          # Clean prebuild (regenerate native dirs)
bun run clean                   # Clean build artifacts + caches
bun run clean:native            # Remove ios/ and android/ dirs
bun run build:android-apk       # Build release APK
bun run lint                    # Run ESLint
bun expo install <package>      # Install Expo-compatible package version
```

---

## Key Conventions & Rules

### Do

- ✅ Use `@/` path aliases for all imports
- ✅ Suffix observables with `$` (e.g. `authState$`, `todayLog$`)
- ✅ Mutate state only through `appActions` — never directly in components
- ✅ Wrap components that read observables with `observer()` from `@legendapp/state/react`
- ✅ Use `StyleSheet.create((theme) => ({...}))` from `react-native-unistyles`
- ✅ Use array syntax for combining styles: `style={[a, b]}`
- ✅ Use `Typography` component for all text
- ✅ Use `BrutalistCard` / `BrutalistButton` for interactive elements
- ✅ Store new types in `src/state/types.ts`
- ✅ Add seed/default data in `src/state/hardcoded-data/`
- ✅ Keep screens in `src/components/screens/` (not in `src/app/`)
- ✅ Follow neo-brutalist design — bold borders, hard shadows, flat colors, uppercase headings
- ✅ Use `bun` for all package management

### Don't

- ❌ Use `npm`, `yarn`, or `npx` — use `bun` and `bun x`
- ❌ Import from `react-native-unistyles` without the Babel plugin configured
- ❌ Use inline `StyleSheet.create()` from `react-native` — always use Unistyles
- ❌ Spread styles with `{...styleA, ...styleB}` — triggers Unistyles warnings
- ❌ Mutate `$` observables directly in UI components
- ❌ Create new route files in `src/app/` for feature screens — use `src/components/screens/`
- ❌ Use `Tailwind`, `NativeWind`, or `styled-components`
- ❌ Use `AsyncStorage` — use MMKV via Legend State plugin or raw `mmkvStorage`
- ❌ Use generic/plain colors — use the curated palette from `theme.ts`
- ❌ Skip haptic feedback on interactive elements
- ❌ Reference outdated Expo SDK docs — always use the v56 versioned docs

---

## Component Creation Checklist

When creating a new component or screen:

1. **Types** — Define interfaces in `src/state/types.ts` if new data shapes are needed.
2. **Slice** — Create observable slice in `src/state/slices/` with MMKV persistence.
3. **Actions** — Add mutations to `appActions` in `src/state/actions.ts`.
4. **Barrel Export** — Re-export slice from `src/state/store.ts`.
5. **Screen Component** — Create in `src/components/screens/` with co-located `styles.ts`.
6. **Styling** — Use Unistyles `StyleSheet.create((theme) => ({...}))`.
7. **UI Primitives** — Use `Typography`, `BrutalistCard`, etc. from `@/ui/`.
8. **Wrap with `observer()`** — If the component reads any `$` observables.
9. **Haptics** — Add appropriate haptic feedback to interactive elements.
10. **Dark Mode** — Ensure all colors come from `theme.colors.*` (never hardcode).

---

## File Naming Conventions

| Type              | Convention           | Example                      |
| ----------------- | -------------------- | ---------------------------- |
| Routes            | `kebab-case.tsx`     | `settings.tsx`, `editor.tsx` |
| Screen components | `PascalCase.tsx`     | `HabitsScreen.tsx`           |
| UI primitives     | `PascalCase.tsx`     | `BrutalistCard.tsx`          |
| State slices      | `camelCaseSlice.ts`  | `habitsSlice.ts`             |
| Style files       | `styles.ts`          | Co-located with screen       |
| Utilities         | `camelCase.ts`       | `date.ts`                    |
| Barrel exports    | `index.ts`           | Re-exports from directory    |
| Platform-specific | `*.web.tsx` / `*.ts` | `use-color-scheme.web.ts`    |

---

## Data Migration

- Migrations are version-gated in `src/state/migration.ts`.
- Current version: `'2'` (stored as `migrationVersion` in MMKV).
- `migrateToLogSystem()` runs once on app start in `_layout.tsx`.
- When adding new migrations, increment the version string and add a new guard clause.

---

## Dev Tools (Debug Mode Only)

Available in `__DEV__` via the device shake menu:

- **Reset App & Storage** — Clears all MMKV data, resets observables, reloads bundle.
- **Reset Current Day** — Removes today's log to test the "Start New Day" flow.

Registered in `src/state/devtool.ts` via both `DevSettings` and `expo-dev-menu`.
