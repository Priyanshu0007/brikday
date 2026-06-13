import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { UiState } from '../types';

export const uiState$ = observable<UiState>({ activeTab: 'engine' });
syncObservable(uiState$, { persist: { name: 'uiState', plugin: mmkvPlugin } });
