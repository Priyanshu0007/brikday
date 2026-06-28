"use no memo";
import React from 'react';
import { View } from 'react-native';
import { observer } from '@legendapp/state/react';
import { LegendList } from '@legendapp/list/react-native';
import { vaultState$ } from '@/state/store';
import { Typography } from '@/ui/Typography';
import { GoalCard } from './GoalCard';
import { stylesheet } from './styles';
import { router } from 'expo-router';

export const VaultScreen = observer(function VaultScreen() {
  const goals = vaultState$.get();

  // Stable ID array — only recomputes when goals are added/removed, NOT on saved changes
  const goalIds = React.useMemo(
    () => goals.map((g) => g.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [goals.length],
  );

  const handleGoalPress = React.useCallback((goalId: string) => {
    router.push(`/vault/${goalId}`);
  }, []);

  const renderGoalItem = React.useCallback(
    ({ item }: { item: string }) => (
      <GoalCard
        goalId={item}
        onPress={handleGoalPress}
      />
    ),
    [handleGoalPress],
  );


  return (
    <View style={stylesheet.container}>
      {/* Title Header */}
      <View style={stylesheet.header}>
        <Typography variant="h2" uppercase>
          SAVINGS
        </Typography>
        <Typography variant="mono" style={stylesheet.subtitle}>
          SAVE UP TO BUY THINGS
        </Typography>
      </View>

      {/* Goal Cards List */}
      <LegendList
        data={goalIds}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item}
        recycleItems={false}
        contentContainerStyle={stylesheet.listContent}
        style={stylesheet.list}
      />

    </View>
  );
});
