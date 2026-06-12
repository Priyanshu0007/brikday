import { observable } from '@legendapp/state';

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
  streak: number;
}

export interface AppState {
  status: 'onboarding' | 'login' | 'authenticated';
  activeTab: 'engine' | 'vault' | 'blueprint' | 'settings';
  user: UserProfile;
  habits: Habit[];
  vaultGoals: VaultGoal[];
  blueprintProjects: Project[];
}

export const appState$ = observable<AppState>({
  status: 'onboarding',
  activeTab: 'engine',
  user: {
    username: 'SDE-1, React Native',
    role: 'Core Architect',
    streak: 12,
  },
  habits: [
    { id: 'h1', title: 'LOG DAILY SPENDING', completed: false, neglected: false, scheduleType: 'daily', specificDays: [], startDate: Date.now() },
    { id: 'h2', title: '6AM CLUB WAKEUP', completed: true, neglected: false, scheduleType: 'daily', specificDays: [], startDate: Date.now() },
    { id: 'h3', title: 'NO COFFEE BEFORE 10AM', completed: false, neglected: true, scheduleType: 'daily', specificDays: [], startDate: Date.now() },
    { id: 'h4', title: '1 HOUR LEETCODE / SHADERS', completed: false, neglected: false, scheduleType: 'alternate_days', specificDays: [], startDate: Date.now() },
  ],
  vaultGoals: [
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
  ],
  blueprintProjects: [
    { id: 'p1', title: 'VeloCity Transit App', category: 'WORK', neglected: false },
    { id: 'p2', title: 'Cyberpunk Portfolio', category: 'SIDE PROJECT', neglected: true },
    { id: 'p3', title: 'Workout Routine V2', category: 'LIFE', neglected: false },
    { id: 'p4', title: 'EAS Build Automator', category: 'WORK', neglected: true },
  ],
});

// State Operations
export const appActions = {
  completeOnboarding() {
    appState$.status.set('login');
  },
  login(username: string) {
    if (username.trim()) {
      appState$.user.username.set(username);
    }
    appState$.status.set('authenticated');
  },
  logout() {
    appState$.status.set('login');
  },
  toggleHabit(id: string) {
    const habit = appState$.habits.find((h) => h.id.get() === id);
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
    appState$.habits.push(newHabit);
  },
  updateHabit(id: string, updates: Partial<Omit<Habit, 'id'>>) {
    const habit = appState$.habits.find((h) => h.id.get() === id);
    if (habit) {
      if (updates.title !== undefined) habit.title.set(updates.title);
      if (updates.scheduleType !== undefined) habit.scheduleType.set(updates.scheduleType);
      if (updates.specificDays !== undefined) habit.specificDays.set(updates.specificDays);
      if (updates.startDate !== undefined) habit.startDate.set(updates.startDate);
    }
  },
  deleteHabit(id: string) {
    const habits = appState$.habits.get();
    const index = habits.findIndex((h) => h.id === id);
    if (index !== -1) {
      appState$.habits[index].delete();
    }
  },
  updateVaultGoal(id: string, saved: number) {
    const goal = appState$.vaultGoals.find((g) => g.id.get() === id);
    if (goal) {
      goal.saved.set(saved);
    }
  },
  addSavingTransaction(goalId: string, amount: number, source: string, comment: string) {
    const goal = appState$.vaultGoals.find((g) => g.id.get() === goalId);
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
    appState$.vaultGoals.push(newGoal);
  },
  updateVaultGoal(id: string, updates: Partial<Omit<VaultGoal, 'id' | 'transactions' | 'saved'>>) {
    const goal = appState$.vaultGoals.find((g) => g.id.get() === id);
    if (goal) {
      if (updates.title !== undefined) goal.title.set(updates.title);
      if (updates.target !== undefined) goal.target.set(updates.target);
    }
  },
  deleteVaultGoal(id: string) {
    const goals = appState$.vaultGoals.get();
    const index = goals.findIndex((g) => g.id === id);
    if (index !== -1) {
      appState$.vaultGoals[index].delete();
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
    appState$.blueprintProjects.push(newProject);
  },
  updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'neglected'>>) {
    const project = appState$.blueprintProjects.find((p) => p.id.get() === id);
    if (project) {
      if (updates.title !== undefined) project.title.set(updates.title);
      if (updates.category !== undefined) project.category.set(updates.category);
    }
  },
  deleteProject(id: string) {
    const projects = appState$.blueprintProjects.get();
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      appState$.blueprintProjects[index].delete();
    }
  },
  toggleProjectNeglect(id: string) {
    const project = appState$.blueprintProjects.find((p) => p.id.get() === id);
    if (project) {
      project.neglected.set(!project.neglected.get());
    }
  },
  updateProfile(username: string, role: string) {
    if (username.trim()) appState$.user.username.set(username);
    if (role.trim()) appState$.user.role.set(role);
  },
};
