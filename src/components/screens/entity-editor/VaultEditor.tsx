import React, { useState } from 'react';
import { View } from 'react-native';
import { observer } from '@legendapp/state/react';
import { appState$, appActions } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { styles } from './styles';

export const VaultEditor = observer(() => {
  const goals = appState$.vaultGoals.get();
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
      <BrutalistButton onPress={handleAdd} backgroundColor={BRUTALIST_THEME.colors.success} style={{ marginBottom: 16 }}>
        + NEW VAULT GOAL
      </BrutalistButton>
      {goals.map((goal) => (
        <BrutalistCard key={goal.id} backgroundColor="#FFFFFF" style={{ marginBottom: 8 }}>
          <View style={styles.listItemRow}>
            <View style={styles.listItemContent}>
              <Typography variant="bodyBold">{goal.title}</Typography>
              <Typography variant="caption" style={{ color: BRUTALIST_THEME.colors.textMuted }}>
                TARGET: ${goal.target.toLocaleString()}
              </Typography>
            </View>
            <View style={styles.listItemActions}>
              <BrutalistButton onPress={() => handleEdit(goal.id)} size="sm" backgroundColor={BRUTALIST_THEME.colors.warning}>
                EDIT
              </BrutalistButton>
              <BrutalistButton onPress={() => setDeletingId(goal.id)} size="sm" backgroundColor={BRUTALIST_THEME.colors.danger}>
                DEL
              </BrutalistButton>
            </View>
          </View>
        </BrutalistCard>
      ))}

      <BrutalistBottomSheet
        visible={isAdding || editingId !== null}
        onClose={() => { setEditingId(null); setIsAdding(false); }}
        title={isAdding ? 'NEW VAULT GOAL' : 'EDIT VAULT GOAL'}
      >
        <View style={styles.formContainer}>
          <BrutalistInput
            label="GOAL DESCRIPTION"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. M4 MACBOOK PRO"
          />
          <BrutalistInput
            label="TARGET FUNDING LIMIT ($)"
            value={target}
            onChangeText={setTarget}
            keyboardType="numeric"
            placeholder="e.g. 3500"
          />
          <BrutalistButton onPress={handleSave} backgroundColor={BRUTALIST_THEME.colors.success} style={{ marginTop: 20 }}>
            SAVE
          </BrutalistButton>
        </View>
      </BrutalistBottomSheet>

      <BrutalistBottomSheet
        visible={deletingId !== null}
        onClose={() => setDeletingId(null)}
        title="CONFIRM DELETION"
      >
        <View style={styles.formContainer}>
          <Typography variant="body" style={{ marginBottom: 20 }}>
            Are you sure you want to delete this vault goal?
          </Typography>
          <View style={styles.formActions}>
            <BrutalistButton onPress={() => setDeletingId(null)} backgroundColor={BRUTALIST_THEME.colors.paper} style={{ flex: 1 }}>
              CANCEL
            </BrutalistButton>
            <BrutalistButton onPress={() => deletingId && confirmDelete(deletingId)} backgroundColor={BRUTALIST_THEME.colors.danger} style={{ flex: 1 }}>
              DELETE
            </BrutalistButton>
          </View>
        </View>
      </BrutalistBottomSheet>
    </View>
  );
});
