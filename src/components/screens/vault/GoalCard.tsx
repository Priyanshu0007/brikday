import React from 'react';
import { View } from 'react-native';
import { observer } from '@legendapp/state/react';
import { vaultState$ } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { styles } from './styles';

export const GoalCard = observer(({
  goalId,
  onAddSaving,
  onViewTransactions,
}: {
  goalId: string;
  onAddSaving: (id: string) => void;
  onViewTransactions: (id: string) => void;
}) => {
  const goal$ = vaultState$.find((g) => g.id.get() === goalId);
  if (!goal$) return null;

  const saved = goal$.saved.get();
  const target = goal$.target.get();
  const title = goal$.title.get();

  const progress = target > 0 ? saved / target : 0;
  const percentage = Math.round(progress * 100);

  return (
    <BrutalistCard style={styles.cardSpacing} backgroundColor="#FFFFFF">
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <Typography variant="bodyBold">{title}</Typography>
          <Typography variant="mono" style={styles.percentBadge}>
            {percentage}%
          </Typography>
        </View>

        <Typography variant="caption" style={styles.savedCaption}>
          ${saved.toLocaleString()} / ${target.toLocaleString()} SAVED
        </Typography>

        {/* Static Progress Bar */}
        <View style={styles.staticTrackContainer}>
          <View style={styles.track}>
            <View style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]} />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <View style={{ flex: 1 }}>
            <BrutalistButton
              onPress={() => onAddSaving(goalId)}
              backgroundColor={BRUTALIST_THEME.colors.success}
              size="sm"
            >
              <Typography
                variant="bodyBold"
                style={styles.buttonText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                + ADD MONEY
              </Typography>
            </BrutalistButton>
          </View>
          <View style={{ flex: 1 }}>
            <BrutalistButton
              onPress={() => onViewTransactions(goalId)}
              backgroundColor={BRUTALIST_THEME.colors.warning}
              size="sm"
            >
              <Typography
                variant="bodyBold"
                style={styles.buttonText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                HISTORY
              </Typography>
            </BrutalistButton>
          </View>
        </View>
      </View>
    </BrutalistCard>
  );
});
