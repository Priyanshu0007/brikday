"use no memo";
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { observer } from '@legendapp/state/react';
import { LegendList } from '@legendapp/list/react-native';
import { appState$, appActions, SavingTransaction } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { BrutalistInput } from '@/ui/BrutalistInput';

const GoalHistorySheet = observer(({
  goalId,
  visible,
  onClose,
}: {
  goalId: string | null;
  visible: boolean;
  onClose: () => void;
}) => {
  const goal$ = goalId ? appState$.vaultGoals.find((g) => g.id.get() === goalId) : undefined;
  
  // Render empty sheet to allow exit animation if needed, but return null if totally absent
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
              NO TRANSACTIONS LOGGED FOR THIS ACQUISITION.
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

const GoalCard = observer(({
  goalId,
  onAddSaving,
  onViewTransactions,
}: {
  goalId: string;
  onAddSaving: (id: string) => void;
  onViewTransactions: (id: string) => void;
}) => {
  const goal$ = appState$.vaultGoals.find((g) => g.id.get() === goalId);
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
          ${saved.toLocaleString()} / ${target.toLocaleString()} SAVED (FULL PAY)
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
                + ADD SAVING
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

export const VaultScreen = observer(function VaultScreen() {
  const goals = appState$.vaultGoals.get();

  const [addSavingVisible, setAddSavingVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const [amountInput, setAmountInput] = useState('');
  const [sourceInput, setSourceInput] = useState('');
  const [commentInput, setCommentInput] = useState('');

  // Stable ID array — only recomputes when goals are added/removed, NOT on saved changes
  const goalIds = React.useMemo(
    () => goals.map((g) => g.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [goals.length],
  );

  const handleAddSavingPress = (goalId: string) => {
    setSelectedGoalId(goalId);
    setAmountInput('');
    setSourceInput('');
    setCommentInput('');
    setAddSavingVisible(true);
  };

  const handleViewTransactionsPress = (goalId: string) => {
    setSelectedGoalId(goalId);
    setHistoryVisible(true);
  };

  const handleSaveTransactionSubmit = () => {
    if (!selectedGoalId) return;
    const parsedAmount = parseFloat(amountInput);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive savings amount.');
      return;
    }
    appActions.addSavingTransaction(
      selectedGoalId,
      parsedAmount,
      sourceInput || 'Manual Savings',
      commentInput || ''
    );
    setAddSavingVisible(false);
  };

  // Stable render function — never recreated
  const renderGoalItem = React.useCallback(
    ({ item }: { item: string }) => (
      <GoalCard
        goalId={item}
        onAddSaving={handleAddSavingPress}
        onViewTransactions={handleViewTransactionsPress}
      />
    ),
    [],
  );

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.header}>
        <Typography variant="h2" uppercase>
          THE VAULT
        </Typography>
        <Typography variant="mono" style={styles.subtitle}>
          ZERO EMI // FULL CASH ACQUISITIONS
        </Typography>
      </View>

      {/* Goal Cards List */}
      <LegendList
        data={goalIds}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      {/* Add Saving Bottom Sheet */}
      {selectedGoal && (
        <BrutalistBottomSheet
          visible={addSavingVisible}
          onClose={() => setAddSavingVisible(false)}
          title={`SAVE FOR ${selectedGoal.title}`}
        >
          <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
            <BrutalistInput
              label="Amount ($)"
              placeholder="e.g. 500"
              keyboardType="numeric"
              value={amountInput}
              onChangeText={setAmountInput}
            />
            <BrutalistInput
              label="Saved From"
              placeholder="e.g. Freelance project, Salary bonus"
              value={sourceInput}
              onChangeText={setSourceInput}
            />
            <BrutalistInput
              label="Comments"
              placeholder="Any additional notes"
              value={commentInput}
              onChangeText={setCommentInput}
            />
            
            <BrutalistButton
              onPress={handleSaveTransactionSubmit}
              backgroundColor={BRUTALIST_THEME.colors.success}
              style={styles.submitBtn}
            >
              CONFIRM SAVINGS
            </BrutalistButton>
          </ScrollView>
        </BrutalistBottomSheet>
      )}

      {/* History Bottom Sheet */}
      <GoalHistorySheet
        goalId={selectedGoalId}
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 10,
    color: BRUTALIST_THEME.colors.textMuted,
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100, // Clear the bottom tabs
  },
  cardSpacing: {
    marginVertical: 8,
  },
  sliderContainer: {
    paddingVertical: 4,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  percentBadge: {
    backgroundColor: BRUTALIST_THEME.colors.border,
    color: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 2,
  },
  savedCaption: {
    color: BRUTALIST_THEME.colors.textMuted,
    marginBottom: 12,
    fontFamily: BRUTALIST_THEME.fonts.mono,
  },
  track: {
    height: 16,
    backgroundColor: BRUTALIST_THEME.colors.paper,
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BRUTALIST_THEME.colors.warning,
  },
  staticTrackContainer: {
    height: 16,
    marginVertical: 8,
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  formContent: {
    paddingBottom: 4,
  },
  submitBtn: {
    marginTop: 16,
  },
  historyListContent: {
    paddingBottom: 4,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: BRUTALIST_THEME.fonts.mono,
    fontSize: 12,
    color: BRUTALIST_THEME.colors.textMuted,
  },
  txnItem: {
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginVertical: 6,
    shadowColor: BRUTALIST_THEME.colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  txnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  txnAmount: {
    fontSize: 16,
    color: BRUTALIST_THEME.colors.success,
  },
  txnDate: {
    fontSize: 11,
    color: BRUTALIST_THEME.colors.textMuted,
  },
  txnSource: {
    fontSize: 11,
    color: BRUTALIST_THEME.colors.text,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  txnComment: {
    fontSize: 11,
    color: BRUTALIST_THEME.colors.textMuted,
    fontStyle: 'italic',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
