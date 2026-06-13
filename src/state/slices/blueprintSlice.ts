import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { Project } from '../types';
import { initialProjects } from '../hardcoded-data/blueprint';

export const blueprintState$ = observable<Project[]>(initialProjects);
syncObservable(blueprintState$, { persist: { name: 'blueprintState', plugin: mmkvPlugin } });
