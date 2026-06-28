import React from 'react';
import { View, ScrollView } from 'react-native';
import { observer } from '@legendapp/state/react';
import { useUnistyles } from 'react-native-unistyles';
import { vaultState$, SavingTransaction, userState$ } from '@/state/store';
import { getCurrencySymbol } from '@/constants/currency';
import { Typography } from '@/ui/Typography';
import { stylesheet } from './styles';

export const GoalHistoryList = observer(({
  goalId,
}: {
  goalId: string | null;
}) => {
  useUnistyles(); // Subscribe to theme changes
  
  const goal$ = goalId ? vaultState$.find((g) => g.id.get() === goalId) : undefined;
  
  if (!goalId || !goal$) return null;

  const transactions = goal$.transactions.get() || [];

  const currencyCode = userState$.currencyCode.get() || 'USD';
  const currencySymbol = getCurrencySymbol(currencyCode);

  return (
    <ScrollView contentContainerStyle={stylesheet.historyListContent} showsVerticalScrollIndicator={false}>
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
                +{currencySymbol}{tx.amount.toLocaleString()}
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
  );
});
