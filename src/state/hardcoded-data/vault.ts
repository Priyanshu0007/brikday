import { VaultGoal } from '../types';

export const initialVaultGoals: VaultGoal[] = [
  {
    id: 'v1',
    title: 'M3 MacBook Pro (Full Pay)',
    target: 3500,
    saved: 2100,
    transactions: [
      {
        id: 't1_1',
        amount: 1500,
        source: 'Freelance Design',
        comment: 'Initial layout project milestone pay',
        date: Date.now() - 86400000 * 5,
      },
      {
        id: 't1_2',
        amount: 600,
        source: 'Consulting Bonus',
        comment: 'Extra code review bonus hours',
        date: Date.now() - 86400000 * 2,
      },
    ],
  },
  {
    id: 'v2',
    title: 'iPad Pro OLED',
    target: 1500,
    saved: 300,
    transactions: [
      {
        id: 't2_1',
        amount: 300,
        source: 'eBay Sale',
        comment: 'Sold my old second-gen iPad Pro',
        date: Date.now() - 86400000 * 8,
      },
    ],
  },
  {
    id: 'v3',
    title: 'Land Purchase Fund',
    target: 50000,
    saved: 5000,
    transactions: [
      {
        id: 't3_1',
        amount: 5000,
        source: 'HSA Reinvestment',
        comment: 'Transferred quarterly dividend gains',
        date: Date.now() - 86400000 * 12,
      },
    ],
  },
];
