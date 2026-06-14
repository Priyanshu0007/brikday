import React from 'react';
import { View, ScrollView } from 'react-native';
import { observer } from '@legendapp/state/react';
import { vaultState$, SavingTransaction } from '@/state/store';
import { Typography } from '@/ui/Typography';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { styles } from './styles';

export const GoalHistorySheet = observer(({
  goalId,
  visible,
  onClose,
}: {
  goalId: string | null;
  visible: boolean;
  onClose: () => void;
}) => {
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
      <ScrollView contentContainerStyle={styles.historyListContent}>
        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Typography variant="body" style={styles.emptyText}>
              NO SAVINGS YET.
            </Typography>
          </View>
        ) : (
          transactions.map((tx: SavingTransaction) => (
            <View key={tx.id} style={styles.txnItem}>
              <View style={styles.txnHeader}>
                <Typography variant="bodyBold" style={styles.txnAmount}>
                  +${tx.amount.toLocaleString()}
                </Typography>
                <Typography variant="mono" style={styles.txnDate}>
                  {new Date(tx.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
              </View>
              <Typography variant="mono" style={styles.txnSource}>
                FROM: {tx.source}
              </Typography>
              {tx.comment ? (
                <Typography variant="caption" style={styles.txnComment}>
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
