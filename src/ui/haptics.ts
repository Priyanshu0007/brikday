import { Presets } from 'react-native-pulsar';

export type HapticFeedbackType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'soft'
  | 'rigid'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection'
  | 'none';

export const triggerHaptic = (type?: HapticFeedbackType) => {
  if (!type || type === 'none') return;

  try {
    switch (type) {
      case 'light':
        return Presets.System.impactLight();
      case 'medium':
        return Presets.System.impactMedium();
      case 'heavy':
        return Presets.System.impactHeavy();
      case 'soft':
        return Presets.System.impactSoft();
      case 'rigid':
        return Presets.System.impactRigid();
      case 'success':
        return Presets.System.notificationSuccess();
      case 'warning':
        return Presets.System.notificationWarning();
      case 'error':
        return Presets.System.notificationError();
      case 'selection':
        return Presets.System.selection();
    }
  } catch {
    // Ignore haptics fail on web
  }
};
