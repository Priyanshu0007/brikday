import React from 'react';
import { View, Text } from 'react-native';
import { observer } from '@legendapp/state/react';
import { useUnistyles } from 'react-native-unistyles';
import { vaultState$, userState$ } from '@/state/store';
import { getCurrencySymbol } from '@/constants/currency';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';

import { stylesheet } from './styles';

export const GoalCard = observer(
  ({ goalId, onPress }: { goalId: string; onPress: (id: string) => void }) => {
    const { theme } = useUnistyles();
    const goal$ = vaultState$.find((g) => g.id.get() === goalId);
    if (!goal$) return null;

    const saved = goal$.saved.get();
    const target = goal$.target.get();
    const title = goal$.title.get();

    const progress = target > 0 ? saved / target : 0;
    const percentage = Math.round(progress * 100);

    const currencyCode = userState$.currencyCode.get() || 'USD';
    const currencySymbol = getCurrencySymbol(currencyCode);

    return (
      <BrutalistCard
        style={stylesheet.cardSpacing}
        backgroundColor={theme.colors.background}
        onPress={() => onPress(goalId)}
      >
        <View style={stylesheet.sliderContainer}>
          <View style={stylesheet.sliderHeader}>
            <Typography variant="bodyBold">{title}</Typography>
            <Typography variant="mono" style={stylesheet.percentBadge}>
              {percentage}%
            </Typography>
          </View>

          <Typography variant="caption" style={stylesheet.savedCaption}>
            <Text style={{ fontFamily: theme.fonts.body }}>{currencySymbol}</Text>
            {saved.toLocaleString()} /{' '}
            <Text style={{ fontFamily: theme.fonts.body }}>{currencySymbol}</Text>
            {target.toLocaleString()} SAVED
          </Typography>

          {/* Static Progress Bar */}
          <View style={stylesheet.staticTrackContainer}>
            <View style={stylesheet.track}>
              <View style={[stylesheet.progressFill, { width: `${Math.min(percentage, 100)}%` }]} />
            </View>
          </View>
        </View>
      </BrutalistCard>
    );
  },
);
