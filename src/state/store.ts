// Re-export shared TypeScript interfaces and types for the application state
export * from './types';

// Re-export state slices for various domains
export * from './slices/authSlice'; // Manages authentication and onboarding status
export * from './slices/uiSlice'; // Manages global UI state, like the active navigation tab
export * from './slices/userSlice'; // Manages user profile information (username, role, login status)
export * from './slices/statsSlice'; // Manages user statistics, such as current streaks
export * from './slices/habitsSlice'; // Manages the list of habit templates
export * from './slices/dailyLogSlice'; // Manages day-isolated habit logs
export * from './slices/vaultSlice'; // Manages financial goals and saving transactions (Vault tab)
export * from './slices/blueprintSlice'; // Manages active and neglected projects (Blueprint tab)
export * from './slices/notificationSlice'; // Manages notification preferences

// Re-export the centralized actions object used to mutate the state slices
export * from './actions';
