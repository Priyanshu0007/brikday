import { observable } from '@legendapp/state';

export interface Habit {
  id: string;
  title: string;
  completed: boolean;
  neglected: boolean;
}

export interface VaultGoal {
  id: string;
  title: string;
  target: number;
  saved: number;
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
    { id: 'h1', title: 'LOG DAILY SPENDING', completed: false, neglected: false },
    { id: 'h2', title: '6AM CLUB WAKEUP', completed: true, neglected: false },
    { id: 'h3', title: 'NO COFFEE BEFORE 10AM', completed: false, neglected: true },
    { id: 'h4', title: '1 HOUR LEETCODE / SHADERS', completed: false, neglected: false },
  ],
  vaultGoals: [
    { id: 'v1', title: 'M3 MacBook Pro (Full Pay)', target: 3500, saved: 2100 }, // 60%
    { id: 'v2', title: 'iPad Pro OLED', target: 1500, saved: 300 }, // 20%
    { id: 'v3', title: 'Land Purchase Fund', target: 50000, saved: 5000 }, // 10%
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
  addHabit(title: string) {
    if (!title.trim()) return;
    const newHabit: Habit = {
      id: `h_${Date.now()}`,
      title: title.toUpperCase(),
      completed: false,
      neglected: false,
    };
    appState$.habits.push(newHabit);
  },
  updateVaultGoal(id: string, saved: number) {
    const goal = appState$.vaultGoals.find((g) => g.id.get() === id);
    if (goal) {
      goal.saved.set(saved);
    }
  },
  addVaultGoal(title: string, target: number) {
    if (!title.trim() || target <= 0) return;
    const newGoal: VaultGoal = {
      id: `v_${Date.now()}`,
      title: title.toUpperCase(),
      target,
      saved: 0,
    };
    appState$.vaultGoals.push(newGoal);
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
