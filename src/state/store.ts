import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';

const mmkvPlugin = new ObservablePersistMMKV({ id: 'brikday-storage' });

export type ScheduleType = 'daily' | 'alternate_days' | 'specific_days';

export interface Habit {
  id: string;
  title: string;
  completed: boolean;
  neglected: boolean;
  scheduleType: ScheduleType;
  specificDays: number[]; // 0 for Sunday, 1 for Monday, etc.
  startDate: number; // For alternate_days calculation
}

export interface SavingTransaction {
  id: string;
  amount: number;
  source: string;
  comment: string;
  date: number; // timestamp
}

export interface VaultGoal {
  id: string;
  title: string;
  target: number;
  saved: number;
  transactions?: SavingTransaction[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  neglected: boolean;
}

export interface UserProfile {
  username: string;
  role: string;
  isLoggedIn: boolean;
}

export interface StatsProfile {
  streak: number;
}

export interface AuthState {
  status: 'onboarding' | 'login' | 'authenticated';
}

export interface UiState {
  activeTab: 'engine' | 'vault' | 'blueprint' | 'settings';
}

// -----------------------------------------------------------------------------
// Slices
// -----------------------------------------------------------------------------

export const authState$ = observable<AuthState>({ status: 'onboarding' });
syncObservable(authState$, { persist: { name: 'authState', plugin: mmkvPlugin } });

export const uiState$ = observable<UiState>({ activeTab: 'engine' });
syncObservable(uiState$, { persist: { name: 'uiState', plugin: mmkvPlugin } });

export const userState$ = observable<UserProfile>({
  username: 'SDE-1, React Native',
  role: 'Core Architect',
  isLoggedIn: false,
});
syncObservable(userState$, { persist: { name: 'userState', plugin: mmkvPlugin } });

export const statsState$ = observable<StatsProfile>({
  streak: 12,
});
syncObservable(statsState$, { persist: { name: 'statsState', plugin: mmkvPlugin } });

export const habitsState$ = observable<Habit[]>([
  { id: 'h1', title: 'LOG DAILY SPENDING', completed: false, neglected: false, scheduleType: 'daily', specificDays: [], startDate: Date.now() },
  { id: 'h2', title: '6AM CLUB WAKEUP', completed: true, neglected: false, scheduleType: 'daily', specificDays: [], startDate: Date.now() },
  { id: 'h3', title: 'NO COFFEE BEFORE 10AM', completed: false, neglected: true, scheduleType: 'daily', specificDays: [], startDate: Date.now() },
  { id: 'h4', title: '1 HOUR LEETCODE / SHADERS', completed: false, neglected: false, scheduleType: 'alternate_days', specificDays: [], startDate: Date.now() },
]);
syncObservable(habitsState$, { persist: { name: 'habitsState', plugin: mmkvPlugin } });

export const vaultState$ = observable<VaultGoal[]>([
  {
    id: 'v1',
    title: 'M3 MacBook Pro (Full Pay)',
    target: 3500,
    saved: 2100,
    transactions: [
      { id: 't1_1', amount: 1500, source: 'Freelance Design', comment: 'Initial layout project milestone pay', date: Date.now() - 86400000 * 5 },
      { id: 't1_2', amount: 600, source: 'Consulting Bonus', comment: 'Extra code review bonus hours', date: Date.now() - 86400000 * 2 },
    ],
  },
  {
    id: 'v2',
    title: 'iPad Pro OLED',
    target: 1500,
    saved: 300,
    transactions: [
      { id: 't2_1', amount: 300, source: 'eBay Sale', comment: 'Sold my old second-gen iPad Pro', date: Date.now() - 86400000 * 8 },
    ],
  },
  {
    id: 'v3',
    title: 'Land Purchase Fund',
    target: 50000,
    saved: 5000,
    transactions: [
      { id: 't3_1', amount: 5000, source: 'HSA Reinvestment', comment: 'Transferred quarterly dividend gains', date: Date.now() - 86400000 * 12 },
    ],
  },
]);
syncObservable(vaultState$, { persist: { name: 'vaultState', plugin: mmkvPlugin } });

export const blueprintState$ = observable<Project[]>([
  { id: 'p1', title: 'VeloCity Transit App', category: 'WORK', neglected: false },
  { id: 'p2', title: 'Cyberpunk Portfolio', category: 'SIDE PROJECT', neglected: true },
  { id: 'p3', title: 'Workout Routine V2', category: 'LIFE', neglected: false },
  { id: 'p4', title: 'EAS Build Automator', category: 'WORK', neglected: true },
]);
syncObservable(blueprintState$, { persist: { name: 'blueprintState', plugin: mmkvPlugin } });

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

export const appActions = {
  completeOnboarding() {
    authState$.status.set('login');
  },
  login(username: string) {
    if (username.trim()) {
      userState$.username.set(username);
    }
    userState$.isLoggedIn.set(true);
    authState$.status.set('authenticated');
  },
  logout() {
    userState$.isLoggedIn.set(false);
    authState$.status.set('login');
  },
  toggleHabit(id: string) {
    const habit = habitsState$.find((h) => h.id.get() === id);
    if (habit) {
      habit.completed.set(!habit.completed.get());
    }
  },
  addHabit(title: string, scheduleType: ScheduleType = 'daily', specificDays: number[] = [], startDate: number = Date.now()) {
    if (!title.trim()) return;
    const newHabit: Habit = {
      id: `h_${Date.now()}`,
      title: title.toUpperCase(),
      completed: false,
      neglected: false,
      scheduleType,
      specificDays,
      startDate,
    };
    habitsState$.push(newHabit);
  },
  updateHabit(id: string, updates: Partial<Omit<Habit, 'id'>>) {
    const habit = habitsState$.find((h) => h.id.get() === id);
    if (habit) {
      if (updates.title !== undefined) habit.title.set(updates.title);
      if (updates.scheduleType !== undefined) habit.scheduleType.set(updates.scheduleType);
      if (updates.specificDays !== undefined) habit.specificDays.set(updates.specificDays);
      if (updates.startDate !== undefined) habit.startDate.set(updates.startDate);
    }
  },
  deleteHabit(id: string) {
    const habits = habitsState$.get();
    const index = habits.findIndex((h) => h.id === id);
    if (index !== -1) {
      habitsState$[index].delete();
    }
  },
  updateVaultGoalSaved(id: string, saved: number) {
    const goal = vaultState$.find((g) => g.id.get() === id);
    if (goal) {
      goal.saved.set(saved);
    }
  },
  addSavingTransaction(goalId: string, amount: number, source: string, comment: string) {
    const goal = vaultState$.find((g) => g.id.get() === goalId);
    if (goal) {
      const currentTxns = goal.transactions.get() || [];
      const newTransaction: SavingTransaction = {
        id: `t_${Date.now()}`,
        amount,
        source: source.trim(),
        comment: comment.trim(),
        date: Date.now(),
      };
      
      goal.transactions.set([...currentTxns, newTransaction]);
      
      goal.saved.set(goal.saved.get() + amount);
    }
  },
  addVaultGoal(title: string, target: number) {
    if (!title.trim() || target <= 0) return;
    const newGoal: VaultGoal = {
      id: `v_${Date.now()}`,
      title: title.toUpperCase(),
      target,
      saved: 0,
      transactions: [],
    };
    vaultState$.push(newGoal);
  },
  updateVaultGoal(id: string, updates: Partial<Omit<VaultGoal, 'id' | 'transactions' | 'saved'>>) {
    const goal = vaultState$.find((g) => g.id.get() === id);
    if (goal) {
      if (updates.title !== undefined) goal.title.set(updates.title);
      if (updates.target !== undefined) goal.target.set(updates.target);
    }
  },
  deleteVaultGoal(id: string) {
    const goals = vaultState$.get();
    const index = goals.findIndex((g) => g.id === id);
    if (index !== -1) {
      vaultState$[index].delete();
    }
  },
  addProject(title: string, category: string, neglected: boolean = false) {
    if (!title.trim()) return;
    const newProject: Project = {
      id: `p_${Date.now()}`,
      title: title.toUpperCase(),
      category: category.toUpperCase() || 'GENERAL',
      neglected,
    };
    blueprintState$.push(newProject);
  },
  updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'neglected'>>) {
    const project = blueprintState$.find((p) => p.id.get() === id);
    if (project) {
      if (updates.title !== undefined) project.title.set(updates.title);
      if (updates.category !== undefined) project.category.set(updates.category);
    }
  },
  deleteProject(id: string) {
    const projects = blueprintState$.get();
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      blueprintState$[index].delete();
    }
  },
  toggleProjectNeglect(id: string) {
    const project = blueprintState$.find((p) => p.id.get() === id);
    if (project) {
      project.neglected.set(!project.neglected.get());
    }
  },
  updateProfile(username: string, role: string) {
    if (username.trim()) userState$.username.set(username);
    if (role.trim()) userState$.role.set(role);
  },
};
