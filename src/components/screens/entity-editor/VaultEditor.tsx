import React, { useState } from 'react';
import { View } from 'react-native';
import { observer } from '@legendapp/state/react';
import { vaultState$, appActions } from '@/state/store';
import { useUnistyles } from 'react-native-unistyles';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { stylesheet } from './styles';

export const VaultEditor = observer(() => {
  const { theme } = useUnistyles();
  const goals = vaultState$.get();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  const handleEdit = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      setTitle(goal.title);
      setTarget(goal.target.toString());
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleAdd = () => {
    setTitle('');
    setTarget('');
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSave = () => {
    const targetVal = parseFloat(target);
    if (isAdding && !isNaN(targetVal)) {
      appActions.addVaultGoal(title, targetVal);
    } else if (editingId && !isNaN(targetVal)) {
      appActions.updateVaultGoal(editingId, { title, target: targetVal });
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const confirmDelete = (id: string) => {
    appActions.deleteVaultGoal(id);
    setDeletingId(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <BrutalistButton onPress={handleAdd} backgroundColor={theme.colors.success} style={{ marginBottom: 16 }}>
        + NEW SAVINGS GOAL
      </BrutalistButton>
      {goals.map((goal) => (
        <BrutalistCard key={goal.id} backgroundColor={theme.colors.background} style={{ marginBottom: 8 }}>
          <View style={stylesheet.listItemRow}>
            <View style={stylesheet.listItemContent}>
              <Typography variant="bodyBold">{goal.title}</Typography>
              <Typography variant="caption" style={{ color: theme.colors.textMuted }}>
                TARGET: ${goal.target.toLocaleString()}
              </Typography>
            </View>
            <View style={stylesheet.listItemActions}>
              <BrutalistButton onPress={() => handleEdit(goal.id)} size="sm" backgroundColor={theme.colors.warning}>
                EDIT
              </BrutalistButton>
              <BrutalistButton onPress={() => setDeletingId(goal.id)} size="sm" backgroundColor={theme.colors.danger}>
                DEL
              </BrutalistButton>
            </View>
          </View>
        </BrutalistCard>
      ))}

      <BrutalistBottomSheet
        visible={isAdding || editingId !== null}
        onClose={() => { setEditingId(null); setIsAdding(false); }}
        title={isAdding ? 'NEW SAVINGS GOAL' : 'EDIT SAVINGS GOAL'}
      >
        <View style={stylesheet.formContainer}>
          <BrutalistInput
            label="GOAL NAME"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. M4 MACBOOK PRO"
          />
          <BrutalistInput
            label="GOAL AMOUNT ($)"
            value={target}
            onChangeText={setTarget}
            keyboardType="numeric"
            placeholder="e.g. 3500"
          />
          <BrutalistButton onPress={handleSave} backgroundColor={theme.colors.success} style={{ marginTop: 20 }}>
            SAVE
          </BrutalistButton>
        </View>
      </BrutalistBottomSheet>

      <BrutalistBottomSheet
        visible={deletingId !== null}
        onClose={() => setDeletingId(null)}
        title="CONFIRM DELETION"
      >
        <View style={stylesheet.formContainer}>
          <Typography variant="body" style={{ marginBottom: 20 }}>
            Are you sure you want to delete this savings goal?
          </Typography>
          <View style={stylesheet.formActions}>
            <BrutalistButton onPress={() => setDeletingId(null)} backgroundColor={theme.colors.paper} style={{ flex: 1 }}>
              CANCEL
            </BrutalistButton>
            <BrutalistButton onPress={() => deletingId && confirmDelete(deletingId)} backgroundColor={theme.colors.danger} style={{ flex: 1 }}>
              DELETE
            </BrutalistButton>
          </View>
        </View>
      </BrutalistBottomSheet>
    </View>
  );
});
