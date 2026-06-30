# Brikday — Detailed Feature Roadmap

> Pick any task below and say **"do #N"** — each one has enough detail for me to implement it end-to-end.

---

## What's Already Built ✅

| Feature                                                | Status |
| ------------------------------------------------------ | ------ |
| Onboarding flow (PagerView slides)                     | ✅     |
| Login (username-based)                                 | ✅     |
| Habit templates (daily / alternate / specific days)    | ✅     |
| Daily log generation & toggle                          | ✅     |
| Streak calculation                                     | ✅     |
| "Neglected" habit indicator (missed yesterday)         | ✅     |
| Analytics — week view (bar chart + day strip)          | ✅     |
| Analytics — month view (heatmap + per-habit breakdown) | ✅     |
| Vault — savings goals with transactions                | ✅     |
| Vault — simulator sheet (compound interest projector)  | ✅     |
| Blueprint — projects with milestones                   | ✅     |
| Blueprint — neglect/active toggle                      | ✅     |
| Entity editor (CRUD for habits, vault, projects)       | ✅     |
| Settings — profile edit, theme toggle, logout          | ✅     |
| Dark / light / system theme                            | ✅     |
| VoxelTower visual component                            | ✅     |
| Neo-brutalist design system                            | ✅     |
| Haptic feedback on all interactive elements            | ✅     |

---

## 🔴 P0 — Quick Wins (Small Effort, Big Impact)

---

### #1 · Habit Emojis & Icons

> [!TIP]
> The `emoji?: string` field already exists on `HabitTemplate` in [types.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/types.ts#L6) but is **never used anywhere**. This is the single lowest-effort feature.

**What it does**: Show an emoji next to each habit in the daily list, analytics, and editor. Add an emoji picker when creating/editing habits.

**Effort**: ~1–2 hours

#### Files to modify

| File                                                                                                                               | Change                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [HabitsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/HabitsScreen.tsx)               | Show `emoji` before `title` in `HabitItem` (line 76–87). Fall back to `⚡` if no emoji set.                                                                                               |
| [AnalyticsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/AnalyticsScreen.tsx)         | Show emoji in `ReadOnlyHabitItem` (line 76–78) and monthly breakdown (line 364).                                                                                                          |
| [EngineEditor.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/entity-editor/EngineEditor.tsx) | Add emoji field to the add/edit bottom sheet form. Add emoji state and pass to `addHabit`/`updateHabit`.                                                                                  |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                                        | Update `addHabit()` (line 82) to accept `emoji` param. Update `updateHabit()` (line 109) to handle `emoji` field. Also propagate emoji to `DailyHabitEntry` so it's stored in daily logs. |
| [types.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/types.ts)                                            | Add `emoji?: string` to `DailyHabitEntry` (line 14) so daily logs carry the emoji too.                                                                                                    |

#### New component needed

| Component                | Purpose                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/ui/EmojiPicker.tsx` | A brutalist-styled grid of common emojis (💪🏃‍♂️📚🧘💧🎨💻🏋️ etc.). Uses `BrutalistCard` cells in a `FlatList` grid. On press → select emoji + haptic feedback. |

#### Implementation notes

- The emoji picker doesn't need a third-party library — a simple grid of ~30 curated emojis in a `BrutalistBottomSheet` is perfect for the neo-brutalist vibe.
- When generating daily logs in `generateDailyLogIfMissing()`, copy `emoji` from the `HabitTemplate` into the `DailyHabitEntry`.
- In `HabitItem`, render the emoji in a 28×28 square with `borderWidth: 2` and `borderColor: theme.colors.border` — matches the checkbox style.

---

### #2 · Confetti on All-Habits-Complete

**What it does**: When the user completes their last remaining habit for the day, trigger a full-screen confetti burst + success haptic.

**Effort**: ~1 hour

#### Files to modify

| File                                                                                                                 | Change                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [HabitsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/HabitsScreen.tsx) | Add confetti component. After `toggleHabit`, check if all entries are now completed → trigger confetti. |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                          | Add `isAllCompletedToday(): boolean` helper that checks `todayLog$` entries.                            |

#### New component needed

| Component                    | Purpose                                                                                                                                                                                                                                                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/ui/ConfettiOverlay.tsx` | Full-screen confetti animation using `react-native-reanimated`. Spawns ~40 colored squares/rectangles with random rotation, position, and velocity. Self-destructs after 2 seconds. No third-party library needed — pure Reanimated `withTiming`/`withSpring` on absolute-positioned `Animated.View` elements. |

#### Implementation notes

- Use the theme's accent colors for confetti particles: `success`, `warning`, `danger`, plus `#FF69B4` and `#8B5CF6`.
- Trigger `triggerHaptic('success')` simultaneously.
- Gate it: only fire once per day (track via a `useRef` or local state `hasShownConfetti`).
- Consider adding a brief "ALL HABITS COMPLETE 🎉" banner in brutalist style before the confetti.

#### Alternative approach

- Install `react-native-confetti-cannon` for a pre-built solution (fewer lines, but adds a dependency).
- Custom Reanimated approach (recommended) — stays dependency-free, more control over the neo-brutalist aesthetic (square confetti instead of round).

---

### #3 · Pull-to-Refresh on Habits

**What it does**: Pull down on the habits list to regenerate/refresh today's log. Useful after adding habits in the editor.

**Effort**: ~30 minutes

#### Files to modify

| File                                                                                                                 | Change                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [HabitsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/HabitsScreen.tsx) | Add `RefreshControl` to the `LegendList` (line 203). On refresh → call `appActions.loadTodayLog()` then `appActions.generateDailyLogIfMissing()`. |

#### Implementation notes

- `LegendList` extends `FlatList` so it supports `refreshControl` prop natively.
- Use `theme.colors.text` for the refresh spinner color.
- Add a `useState` for `refreshing` and set it to `false` after a 500ms delay for visual feedback.

---

## 🟠 P1 — High Impact (Medium Effort)

---

### #4 · Habit Notes / Journal

**What it does**: After completing a habit, optionally add a short text note ("Did 120 pushups today instead of 100!"). Notes appear in the Analytics day-detail bottom sheet.

**Effort**: ~3–4 hours

#### Type changes — [types.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/types.ts)

```diff
 export interface DailyHabitEntry {
   habitId: string;
   title: string;
   completed: boolean;
   completedAt?: number;
+  note?: string;
 }
```

#### Files to modify

| File                                                                                                                       | Change                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                                | Add `addHabitNote(habitId: string, note: string)` action. Updates `todayLog$.entries[idx].note` and persists to MMKV.                                                                                              |
| [HabitsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/HabitsScreen.tsx)       | After a habit is completed, show a small "ADD NOTE" link below it. On press → open a `BrutalistBottomSheet` with a `BrutalistInput` (multiline). If note exists, show it as a muted caption below the habit title. |
| [AnalyticsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/AnalyticsScreen.tsx) | In `ReadOnlyHabitItem` (line 26–90), if `entry.note` exists, render it below the title as `<Typography variant="caption">` in mono font with a `📝` prefix.                                                        |

#### UX flow

1. User taps habit → toggles completion (existing behavior).
2. If completed, a small `"+ NOTE"` text appears below the title with a fade-in animation.
3. Tapping `"+ NOTE"` opens a bottom sheet with a multiline text input.
4. User types note → taps SAVE → note persists in the daily log.
5. If note already exists, show it inline and tapping it re-opens the editor.

---

### #5 · Blueprint Due Dates & Deadlines

**What it does**: Add optional due dates to milestones. Show countdown badges ("3 DAYS LEFT"), and overdue milestones get the danger/neglected treatment.

**Effort**: ~3–4 hours

#### Type changes — [types.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/types.ts)

```diff
 export interface Milestone {
   id: string;
   title: string;
   completed: boolean;
+  dueDate?: number;    // timestamp, optional
 }
```

#### Files to modify

| File                                                                                                                       | Change                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                                | Update `addMilestone()` (line 269) to accept optional `dueDate`. Add `updateMilestoneDate(projectId, milestoneId, dueDate)` action.                                                                                                             |
| [BlueprintScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/BlueprintScreen.tsx) | In `MilestoneItem`: if `dueDate` exists and milestone is not completed, show a countdown badge. If overdue → style the milestone with `theme.colors.danger` background. Sort milestones: overdue first, then by nearest due date, then no-date. |
| [BlueprintScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/BlueprintScreen.tsx) | Add a date picker trigger next to the milestone input. On press → open a bottom sheet with a simple date selector.                                                                                                                              |

#### New component needed

| Component                        | Purpose                                                                                                                                                                                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/ui/BrutalistDatePicker.tsx` | A neo-brutalist date picker. Could be a simple month-grid (reuse the `getMonthGrid` util from [date.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/utils/date.ts)) inside a `BrutalistBottomSheet`. Tap a day → select it. Bold borders, flat colors. |

#### Countdown badge logic

```
daysLeft = Math.ceil((dueDate - now) / 86400000)
if daysLeft < 0  → "OVERDUE" (danger color)
if daysLeft === 0 → "TODAY" (warning color)
if daysLeft <= 3  → "3 DAYS LEFT" (warning color)
else              → "12 DAYS LEFT" (muted)
```

---

### #6 · Notifications & Reminders

**What it does**: Local push notifications for morning habit reminder, evening recap, and streak-at-risk alerts.

**Effort**: ~4–5 hours

#### Package to install

```bash
bun expo install expo-notifications
```

#### New files

| File                                    | Purpose                                                                                                                                                                                                                                                                          |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/state/slices/notificationSlice.ts` | Observable for notification preferences: `morningReminder: { enabled, hour, minute }`, `eveningRecap: { enabled, hour, minute }`, `streakAlert: { enabled }`. Persisted via MMKV plugin.                                                                                         |
| `src/utils/notifications.ts`            | Helper functions: `requestPermissions()`, `scheduleMorningReminder(hour, minute)`, `scheduleEveningRecap(hour, minute)`, `cancelAllScheduled()`, `scheduleStreakAlert()`. Uses `expo-notifications` `scheduleNotificationAsync` with `trigger: { type: 'daily', hour, minute }`. |

#### Files to modify

| File                                                                                                                     | Change                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| [types.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/types.ts)                                  | Add `NotificationPreferences` interface.                                                                                               |
| [store.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/store.ts)                                  | Re-export `notificationSlice`.                                                                                                         |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                              | Add `updateNotificationSettings()`, `rescheduleNotifications()` actions.                                                               |
| [SettingsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/SettingsScreen.tsx) | Add "NOTIFICATIONS" section under PREFERENCES with toggle cards for each notification type. Time picker for morning/evening reminders. |
| [_layout.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/app/_layout.tsx)                              | Request notification permissions on first launch. Schedule notifications based on saved preferences.                                   |

#### Notification content examples

- **Morning**: `"🧱 Time to build. You have 6 habits today. Let's go."`
- **Evening**: `"📊 Day complete: 5/6 habits done (83%). Keep the streak alive."`
- **Streak risk**: `"🔥 Your 14-day streak is at risk! Open Brikday to stay on track."`

---

### #7 · Swipe Actions on Habit Cards

**What it does**: Swipe right on a habit to complete it, swipe left to reveal a delete action. More natural than tapping.

**Effort**: ~3 hours

#### Files to modify

| File                                                                                                                 | Change                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [HabitsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/HabitsScreen.tsx) | Wrap each `HabitItem` in a `Swipeable` from `react-native-gesture-handler`. Right swipe → complete (green background, ✓ icon). Left swipe → reveal DELETE button (red background). |

#### New component needed

| Component                 | Purpose                                                                                                                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/ui/SwipeableRow.tsx` | Reusable swipeable wrapper using `Swipeable` from `react-native-gesture-handler`. Props: `onSwipeRight`, `onSwipeLeft`, `rightContent`, `leftContent`. Neo-brutalist styling — bold borders on the action panels, hard shadow. |

#### Implementation notes

- `react-native-gesture-handler` is already installed — no new package needed.
- The swipe action background should use `theme.colors.success` (right/complete) and `theme.colors.danger` (left/delete).
- After swiping right to complete, auto-close the swipeable with a spring animation.
- Add `triggerHaptic('success')` on swipe-complete and `triggerHaptic('warning')` when delete panel is revealed.

---

### #8 · Habit Reordering (Drag to Reorder)

**What it does**: Long-press a habit card to pick it up, drag to reorder. Priority order persists.

**Effort**: ~3–4 hours

#### Type changes — [types.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/types.ts)

```diff
 export interface HabitTemplate {
   id: string;
   title: string;
   emoji?: string;
   scheduleType: ScheduleType;
   specificDays: number[];
   startDate: number;
   createdAt: number;
   archivedAt?: number;
+  order?: number;    // display order, lower = higher in list
 }
```

#### Files to modify

| File                                                                                                                 | Change                                                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                          | Add `reorderHabits(orderedIds: string[])` action that sets `order` on each template. Update `generateDailyLogIfMissing()` to sort active habits by `order` before generating entries. |
| [HabitsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/HabitsScreen.tsx) | Replace `LegendList` with a draggable list. Use `react-native-gesture-handler` + `react-native-reanimated` for drag-and-drop. On drop → call `appActions.reorderHabits()`.            |

#### Implementation approach

- Use `Gesture.Pan()` with a long-press activation for drag-to-reorder.
- During drag, animate the held item with `scale: 1.05` and elevated shadow.
- Other items slide up/down with `withSpring` to make room.
- On release, commit the new order and trigger `triggerHaptic('medium')`.

---

## 🟡 P2 — Nice to Have (Medium Effort)

---

### #9 · GitHub-Style Streak Heatmap (Year View)

**What it does**: A third view mode in Analytics — a full-year contribution grid like GitHub's, showing habit completion intensity per day.

**Effort**: ~4–5 hours

#### Files to modify

| File                                                                                                                       | Change                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AnalyticsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/AnalyticsScreen.tsx) | Add `'year'` to the view mode switcher (line 97, 157). Add `renderYearView()` function.                                                            |
| [date.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/utils/date.ts)                                      | Add `getYearGrid(year: number): { date: Date, dateString: string, weekIndex: number, dayIndex: number }[]` utility that generates 52×7 grid cells. |

#### Heatmap design

- 52 columns (weeks) × 7 rows (days), scrollable horizontally.
- Each cell is a small square (12×12) with `borderWidth: 1`.
- Color scale using theme colors:
  - No data → `theme.colors.paper`
  - 0% completion → `theme.colors.danger` (faded)
  - 1–49% → `theme.colors.warning`
  - 50–99% → `theme.colors.warning` (brighter)
  - 100% → `theme.colors.success`
- Month labels across the top.
- Day labels (M, W, F) on the left.
- Tap any cell → opens the existing day-detail bottom sheet.

---

### #10 · Per-Habit Streak Tracking

**What it does**: Track individual streaks for each habit, not just the global "all completed" streak. Show current and best streaks.

**Effort**: ~3–4 hours

#### Files to modify

| File                                                                                                                       | Change                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                                | Add `calculateHabitStreak(habitId: string): { current: number, best: number }`. Iterates backward through MMKV day logs, checking if the specific habit was completed on each scheduled day. |
| [AnalyticsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/AnalyticsScreen.tsx) | In the month view's "Habit Breakdown" section, add streak info: `"🔥 12D STREAK (BEST: 23D)"` below each habit's progress bar.                                                               |
| [HabitsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/HabitsScreen.tsx)       | Optionally show per-habit streak as a small mono badge on the habit card: `"🔥 12D"`.                                                                                                        |

#### Streak badge milestones

- At 7 days → show `"🔥 7D — 1 WEEK!"` with `triggerHaptic('success')` once
- At 30 days → `"🔥 30D — 1 MONTH!"`
- At 100 days → `"🔥 100D — LEGENDARY!"`
- Store `bestStreak` per habit in `HabitTemplate` to avoid recomputing every render.

---

### #11 · Weekly Summary Card (Shareable)

**What it does**: Auto-generate a brutalist-styled summary card at the end of the week. Shows completion %, best day, streak, and is shareable as an image.

**Effort**: ~4–5 hours

#### Package to install

```bash
bun expo install expo-sharing react-native-view-shot
```

#### New files

| File                                           | Purpose                                                                                                                                                                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/screens/WeeklySummaryCard.tsx` | A self-contained, brutalist-styled card designed for screenshotting. Contains: week date range, overall completion %, best day, current streak, per-habit mini bars. Black border, bold typography, flat colors. |

#### Files to modify

| File                                                                                                                       | Change                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AnalyticsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/AnalyticsScreen.tsx) | Add a "SHARE WEEK" button below the weekly bar chart. On press → render `WeeklySummaryCard` off-screen → capture with `react-native-view-shot` → share via `expo-sharing`. |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                                | Add `getWeekSummary(weekAnchorDate: Date)` that returns `{ totalRate, bestDay, worstDay, perHabitRates }`.                                                                 |

#### Card design

```
┌─────────────────────────────────┐
│  BRIKDAY // WEEKLY REPORT       │
│  JUN 21 – JUN 27, 2026         │
├─────────────────────────────────┤
│         ██ 87% ██               │
│      COMPLETION RATE            │
│                                 │
│  BEST DAY: TUESDAY (100%)      │
│  STREAK: 14 DAYS 🔥            │
│                                 │
│  ─── HABIT BREAKDOWN ───        │
│  PUSHUPS     ████████░░  80%    │
│  READING     ██████████  100%   │
│  MEDITATION  ██████░░░░  60%    │
├─────────────────────────────────┤
│  BUILT WITH BRIKDAY             │
└─────────────────────────────────┘
```

---

### #12 · Insights & Trend Analysis

**What it does**: Smart text-based insights in the Analytics tab: best day of week, declining habits, time-of-day patterns.

**Effort**: ~3 hours

#### Files to modify

| File                                                                                                                       | Change                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                                | Add `generateInsights(): Insight[]` that analyzes the last 30 days of logs and returns structured insight objects.                                 |
| [AnalyticsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/AnalyticsScreen.tsx) | Add an "INSIGHTS" section at the bottom of both week and month views. Render each insight as a `BrutalistCard` with an emoji prefix and mono text. |

#### Insight types to generate

```typescript
type Insight = {
  emoji: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral';
};
```

Example insights:

- `{ emoji: "📅", title: "BEST DAY", description: "Wednesday is your strongest day (94% avg)", type: "positive" }`
- `{ emoji: "📉", title: "DECLINING", description: "READING has dropped 20% this week vs last", type: "warning" }`
- `{ emoji: "⏰", title: "EARLY BIRD", description: "You complete most habits before 10 AM", type: "positive" }`
- `{ emoji: "🔥", title: "ON FIRE", description: "MEDITATION is on a 15-day streak!", type: "positive" }`

---

### #13 · Export & Data Backup

**What it does**: Export all app data as JSON for backup. Import to restore. Also CSV export for habit logs.

**Effort**: ~3 hours

#### Package to install

```bash
bun expo install expo-sharing expo-file-system
```

#### New files

| File                  | Purpose                                                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/utils/export.ts` | Functions: `exportAllData(): object` (collects all slices + daily logs into one JSON), `importAllData(json: object)` (validates and restores), `exportHabitLogsCsv(dateRange)` (generates CSV string). |

#### Files to modify

| File                                                                                                                     | Change                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SettingsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/SettingsScreen.tsx) | Add "DATA" section with three buttons: "EXPORT JSON", "IMPORT JSON", "EXPORT CSV". Export writes to `FileSystem.documentDirectory` then shares via `expo-sharing`. Import uses `DocumentPicker` to select a JSON file. |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                              | Add `exportData()` and `importData(json)` actions. Import action validates schema, clears existing data, then restores from JSON.                                                                                      |

#### Export JSON structure

```json
{
  "version": "1.0",
  "exportedAt": "2026-06-27T21:00:00Z",
  "data": {
    "habits": [...],
    "dailyLogs": { "2026-06-27": {...}, ... },
    "vaultGoals": [...],
    "projects": [...],
    "user": { "username": "...", "role": "..." },
    "stats": { "streak": 14 }
  }
}
```

---

## 🟢 P3 — Big Features (Large Effort)

---

### #14 · Vault Expense Tracker

**What it does**: Track expenses alongside savings. See net savings, expense categories, and spending patterns.

**Effort**: ~6–8 hours

#### New types — [types.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/types.ts)

```typescript
export interface Expense {
  id: string;
  amount: number;
  category: string; // e.g. "FOOD", "TRANSPORT", "ENTERTAINMENT"
  description: string;
  date: number; // timestamp
}

export type ExpenseCategory =
  'FOOD' | 'TRANSPORT' | 'ENTERTAINMENT' | 'SHOPPING' | 'BILLS' | 'HEALTH' | 'OTHER';
```

#### New files

| File                                                  | Purpose                                                                                                     |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/state/slices/expenseSlice.ts`                    | `expenses$` observable array, MMKV-persisted.                                                               |
| `src/state/hardcoded-data/expenses.ts`                | Default expense categories with emoji mappings.                                                             |
| `src/components/screens/vault/ExpenseSheet.tsx`       | Bottom sheet for adding an expense: amount input, category picker (grid of brutalist buttons), description. |
| `src/components/screens/vault/ExpenseSummaryCard.tsx` | Card showing this month's total spending, broken down by category with mini progress bars.                  |

#### Files to modify

| File                                                                                                                     | Change                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| [store.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/store.ts)                                  | Re-export `expenseSlice`.                                                                                 |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                              | Add `addExpense()`, `deleteExpense()`, `getMonthlyExpenseSummary()` actions.                              |
| [VaultScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/vault/VaultScreen.tsx) | Add an "EXPENSES" section above/below the savings goals. Show monthly total and a "+ LOG EXPENSE" button. |

---

### #15 · Blueprint Time Tracking

**What it does**: Start/stop a timer on any project. Log time spent per session. Show weekly time summary.

**Effort**: ~6–8 hours

#### New types — [types.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/types.ts)

```typescript
export interface TimeEntry {
  id: string;
  projectId: string;
  startTime: number; // timestamp
  endTime?: number; // timestamp, undefined if running
  durationMs?: number; // calculated
}

// Add to Project:
export interface Project {
  // ... existing fields
  totalTimeMs?: number; // accumulated total
}
```

#### New files

| File                                               | Purpose                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/state/slices/timeTrackingSlice.ts`            | `timeEntries$` observable array + `activeTimer$` observable for currently running timer. MMKV-persisted. |
| `src/components/screens/blueprint/TimerWidget.tsx` | Inline timer display on project cards. Shows `HH:MM:SS` counting up with Reanimated. START/STOP button.  |

#### Files to modify

| File                                                                                                                       | Change                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [BlueprintScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/BlueprintScreen.tsx) | Add `TimerWidget` inside each `ProjectCard`. Show total logged time below the project title.                      |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                                | Add `startTimer(projectId)`, `stopTimer()`, `getProjectTimeEntries(projectId)`, `getWeeklyTimeSummary()` actions. |
| [AnalyticsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/AnalyticsScreen.tsx) | Optionally add a "TIME SPENT" section showing weekly breakdown per project.                                       |

---

### #16 · Cloud Sync (Supabase)

**What it does**: Sync all data across devices. Offline-first with conflict resolution.

**Effort**: ~10–15 hours

> [!WARNING]
> This is the largest feature and requires a Supabase project setup, database schema design, and auth integration. Recommend doing #20 (Proper Auth) first.

#### Package to install

```bash
bun install @supabase/supabase-js
```

#### New files

| File                    | Purpose                                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `src/state/supabase.ts` | Supabase client init with env vars.                                                                                                    |
| `src/state/sync.ts`     | Legend State sync plugin for Supabase. Uses `syncObservable` with `remote: { get, set }` handlers that push/pull from Supabase tables. |

#### Database tables needed

```
users: id, username, role, created_at
habits: id, user_id, title, emoji, schedule_type, specific_days, start_date, order, archived_at
daily_logs: id, user_id, date, entries (jsonb), generated_at
vault_goals: id, user_id, title, target, saved, transactions (jsonb)
projects: id, user_id, title, category, neglected, milestones (jsonb)
```

#### Sync strategy

- Legend State v3 has built-in sync plugins — use `syncObservable` with a custom Supabase plugin.
- Offline-first: all mutations write to MMKV immediately, then sync to Supabase in background.
- Conflict resolution: last-write-wins with timestamp comparison.
- Sync indicator in header: show a small `↑↓` icon when syncing.

---

### #17 · Home Screen Widgets

**What it does**: iOS and Android home screen widgets showing today's habit progress.

**Effort**: ~8–10 hours

> [!IMPORTANT]
> This requires native code and `expo prebuild`. The `expo-widgets` package is experimental in SDK 56. Verify compatibility before starting.

#### Package to install

```bash
bun expo install expo-widgets
```

#### Widget types

1. **Small widget**: Progress ring (X/Y habits) + streak count.
2. **Medium widget**: List of today's habits with checkmarks.

---

## 🎨 UI/UX Polish

---

### #18 · Animated Tab Transitions

**What it does**: Smooth crossfade or slide animation when switching between Engine/Vault/Blueprint/Analytics tabs.

**Effort**: ~2 hours

#### Files to modify

| File                                                                                    | Change                                                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [index.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/app/index.tsx) | Wrap `renderActiveScreen()` output in `Animated.View` with `FadeIn`/`FadeOut` layout animations from `react-native-reanimated`. Use `entering={FadeIn.duration(200)}` and `exiting={FadeOut.duration(100)}`. Key the view by `activeTab` to trigger re-mount animations. |

---

### #19 · Better Empty States

**What it does**: When a tab has no data (no vault goals, no projects), show an illustrated empty state with a call-to-action instead of blank space.

**Effort**: ~2–3 hours

#### Files to modify

| File                                                                                                                       | Change                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [VaultScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/vault/VaultScreen.tsx)   | When `goals.length === 0`, show an empty state card with a 🪙 emoji badge, "NO SAVINGS GOALS YET" title, description text, and a "CREATE YOUR FIRST GOAL →" button that opens the editor. |
| [BlueprintScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/BlueprintScreen.tsx) | When `projects.length === 0`, show empty state with 🧱 emoji, "NO PROJECTS YET", and a "START YOUR FIRST PROJECT →" button.                                                               |
| [AnalyticsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/AnalyticsScreen.tsx) | When no log data exists for the selected period, show a "NO DATA FOR THIS PERIOD" card with a hint to start tracking.                                                                     |

#### Design reference

- Use the same pattern as the existing "Start Day" card in [HabitsScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/HabitsScreen.tsx#L143-L199): emoji badge → date tag → title → description → CTA button.

---

### #20 · Vault Goal Completion Celebration

**What it does**: When a vault goal reaches 100%, show a full-screen celebration with the goal title and confetti.

**Effort**: ~1–2 hours (if #2 Confetti is already built)

#### Files to modify

| File                                                                                                                     | Change                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                              | In `addSavingTransaction()` (line 202), after updating `saved`, check if `saved >= target`. If so, set a flag: `vaultCelebration$.set({ goalId, title })`. |
| [VaultScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/vault/VaultScreen.tsx) | Watch `vaultCelebration$`. When it fires, show the `ConfettiOverlay` (from #2) + a brutalist banner: `"🎉 GOAL REACHED: [TITLE]"`.                         |

---

## 🔧 Technical Improvements

---

### #21 · Automated Tests for Actions

**What it does**: Unit tests for the most critical business logic — streak calculation, log generation, habit scheduling.

**Effort**: ~3–4 hours

#### New files

| File                                  | Tests                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/state/__tests__/actions.test.ts` | `calculateStreak()` — returns 0 for no data, counts consecutive days, breaks on missed day.                  |
|                                       | `generateDailyLogIfMissing()` — creates log with correct habits, respects schedule types, doesn't duplicate. |
|                                       | `isHabitActiveOnDate()` — daily, alternate_days, specific_days logic.                                        |
|                                       | `toggleHabit()` — toggles completion, sets completedAt timestamp.                                            |
|                                       | `addSavingTransaction()` — adds transaction, updates saved amount.                                           |

#### Setup

```bash
bun install --dev jest @testing-library/react-native @types/jest
```

---

### #22 · Proper Auth System

**What it does**: Replace the username-only login with real authentication via Supabase Auth. Adds Google and Apple sign-in.

**Effort**: ~6–8 hours

#### Packages to install

```bash
bun expo install expo-auth-session expo-crypto expo-web-browser
bun install @supabase/supabase-js
```

#### Files to modify

| File                                                                                                               | Change                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [LoginScreen.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/components/screens/LoginScreen.tsx) | Replace username form with "SIGN IN WITH GOOGLE" and "SIGN IN WITH APPLE" brutalist buttons. Add email/password as fallback. |
| [authSlice.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/slices/authSlice.ts)             | Store Supabase session token. Add `session` and `userId` fields.                                                             |
| [actions.ts](file:///Users/priyanshugupta/Coding/react-native/brikday/src/state/actions.ts)                        | Add `signInWithGoogle()`, `signInWithApple()`, `signInWithEmail()`, `signOut()` actions.                                     |
| [index.tsx](file:///Users/priyanshugupta/Coding/react-native/brikday/src/app/index.tsx)                            | Un-comment the `LoginScreen` route (currently bypassed on line 138).                                                         |

---

## 📋 Master Priority Table

| #   | Feature                   | Effort    | Category  | Dependencies            |
| --- | ------------------------- | --------- | --------- | ----------------------- |
| 1   | Habit Emojis              | 🟢 Small  | UI        | None                    |
| 2   | Confetti on Completion    | 🟢 Small  | UI        | None                    |
| 3   | Pull-to-Refresh           | 🟢 Small  | UX        | None                    |
| 4   | Habit Notes / Journal     | 🟡 Medium | Feature   | None                    |
| 5   | Blueprint Due Dates       | 🟡 Medium | Feature   | None                    |
| 6   | Notifications & Reminders | 🟡 Medium | Feature   | expo-notifications      |
| 7   | Swipe Actions             | 🟡 Medium | UX        | None                    |
| 8   | Habit Reordering          | 🟡 Medium | UX        | None                    |
| 9   | Year Heatmap              | 🟡 Medium | Analytics | None                    |
| 10  | Per-Habit Streaks         | 🟡 Medium | Analytics | None                    |
| 11  | Weekly Summary Card       | 🟡 Medium | Feature   | expo-sharing, view-shot |
| 12  | Insights & Trends         | 🟡 Medium | Analytics | None                    |
| 13  | Export / Backup           | 🟡 Medium | Feature   | expo-sharing, expo-fs   |
| 14  | Vault Expenses            | 🔴 Large  | Feature   | None                    |
| 15  | Time Tracking             | 🔴 Large  | Feature   | None                    |
| 16  | Cloud Sync                | 🔴 Large  | Infra     | #22 (Auth)              |
| 17  | Home Widgets              | 🔴 Large  | Native    | expo-widgets            |
| 18  | Tab Transitions           | 🟢 Small  | UI        | None                    |
| 19  | Better Empty States       | 🟢 Small  | UI        | None                    |
| 20  | Vault Celebration         | 🟢 Small  | UI        | #2 (Confetti)           |
| 21  | Automated Tests           | 🟡 Medium | Infra     | jest                    |
| 22  | Proper Auth               | 🔴 Large  | Infra     | supabase                |

> [!TIP]
> **Recommended starting order**: #1 → #2 → #3 → #18 → #19 → #4 → #5 → #7 → #9 → #6
>
> This gives you the most visible progress with the least risk. Each feature is independent (no dependencies until you hit cloud sync).
