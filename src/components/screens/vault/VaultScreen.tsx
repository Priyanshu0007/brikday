"use no memo";
import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { observer } from '@legendapp/state/react';
import { LegendList } from '@legendapp/list/react-native';
import { vaultState$, appActions } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { GoalCard } from './GoalCard';
import { GoalHistorySheet } from './GoalHistorySheet';
import { styles } from './styles';

export const VaultScreen = observer(function VaultScreen() {
  const goals = vaultState$.get();

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
          SAVINGS
        </Typography>
        <Typography variant="mono" style={styles.subtitle}>
          SAVE UP TO BUY THINGS
        </Typography>
      </View>

      {/* Goal Cards List */}
      <LegendList
        data={goalIds}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item}
        recycleItems={false}
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
              SAVE MONEY
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
