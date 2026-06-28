import { Project } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'VeloCity Transit App',
    category: 'WORK',
    neglected: false,
    milestones: [
      { id: 'm1', title: 'Design System', completed: true },
      { id: 'm2', title: 'Authentication Flow', completed: false },
      { id: 'm3', title: 'Map Integration', completed: false },
    ],
  },
  {
    id: 'p2',
    title: 'Cyberpunk Portfolio',
    category: 'SIDE PROJECT',
    neglected: true,
    milestones: [
      { id: 'm4', title: 'Wireframes', completed: true },
      { id: 'm5', title: 'WebGL Background', completed: true },
      { id: 'm6', title: 'Copywriting', completed: false },
      { id: 'm7', title: 'Deployment', completed: false },
    ],
  },
  { id: 'p3', title: 'Workout Routine V2', category: 'LIFE', neglected: false, milestones: [] },
  { id: 'p4', title: 'EAS Build Automator', category: 'WORK', neglected: true, milestones: [] },
];
