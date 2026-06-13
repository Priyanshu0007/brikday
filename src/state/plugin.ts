import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';

export const mmkvPlugin = new ObservablePersistMMKV({ id: 'brikday-storage' });
