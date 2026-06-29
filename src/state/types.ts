export type ScheduleType = 'daily' | 'alternate_days' | 'specific_days';

export interface HabitTemplate {
  id: string;
  title: string;
  emoji?: string;
  scheduleType: ScheduleType;
  specificDays: number[]; // 0 for Sunday, 1 for Monday, etc.
  startDate: number; // timestamp
  createdAt: number; // timestamp
  archivedAt?: number; // timestamp
}

export interface DailyHabitEntry {
  habitId: string;
  title: string;
  emoji?: string;
  completed: boolean;
  completedAt?: number;
  note?: string;
}

export interface DailyLog {
  date: string; // 'YYYY-MM-DD' in local timezone
  entries: DailyHabitEntry[];
  generatedAt: number; // timestamp
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

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  neglected: boolean;
  milestones?: Milestone[];
}

export interface UserProfile {
  username: string;
  role: string;
  isLoggedIn: boolean;
  currencyCode: string;
}

export interface StatsProfile {
  streak: number;
}

export interface AuthState {
  status: 'onboarding' | 'login' | 'authenticated';
}

export interface UiState {
  activeTab: 'engine' | 'vault' | 'blueprint' | 'analytics';
  theme?: 'light' | 'dark' | 'system';
}

export interface NotificationPreferences {
  morningReminder: { enabled: boolean; hour: number; minute: number };
  eveningRecap: { enabled: boolean; hour: number; minute: number };
  streakAlert: { enabled: boolean };
}
