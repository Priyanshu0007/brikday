import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/ui/Typography';
import { styles } from './styles';

export function OnboardingHeader() {
  return (
    <View style={styles.header}>
      <Typography variant="h1" style={styles.brandTitle} uppercase>
        BRICKDAY
      </Typography>
      <Typography variant="mono" style={styles.brandSubtitle}>
        BUILD YOUR LIFE, BRICK BY BRICK
      </Typography>
    </View>
  );
}
