import React from 'react';
import { View, ScrollView } from 'react-native';
import { observer } from '@legendapp/state/react';
import { useUnistyles } from 'react-native-unistyles';
import { vaultState$, SavingTransaction } from '@/state/store';
import { Typography } from '@/ui/Typography';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { stylesheet } from './styles';

export const GoalHistorySheet = observer(({
  goalId,
  visible,
  onClose,
}: {
  goalId: string | null;
  visible: boolean;
  onClose: () => void;
}) => {
  useUnistyles(); // Subscribe to theme changes
  
  const goal$ = goalId ? vaultState$.find((g) => g.id.get() === goalId) : undefined;
  
  if (!goalId || !goal$) return null;

  const title = goal$.title.get();
  const transactions = goal$.transactions.get() || [];

  return (
    <BrutalistBottomSheet
      visible={visible}
      onClose={onClose}
      title={`${title} HISTORY`}
    >
      <ScrollView contentContainerStyle={stylesheet.historyListContent}>
        {transactions.length === 0 ? (
          <View style={stylesheet.emptyContainer}>
            <Typography variant="body" style={stylesheet.emptyText}>
              NO SAVINGS YET.
            </Typography>
          </View>
        ) : (
          transactions.map((tx: SavingTransaction) => (
            <View key={tx.id} style={stylesheet.txnItem}>
              <View style={stylesheet.txnHeader}>
                <Typography variant="bodyBold" style={stylesheet.txnAmount}>
                  +${tx.amount.toLocaleString()}
                </Typography>
                <Typography variant="mono" style={stylesheet.txnDate}>
                  {new Date(tx.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
              </View>
              <Typography variant="mono" style={stylesheet.txnSource}>
                FROM: {tx.source}
              </Typography>
              {tx.comment ? (
                <Typography variant="caption" style={stylesheet.txnComment}>
                  &quot;{tx.comment}&quot;
                </Typography>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </BrutalistBottomSheet>
  );
});
