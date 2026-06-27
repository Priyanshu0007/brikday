import React, { useState } from 'react';
import { View } from 'react-native';
import { observer } from '@legendapp/state/react';
import { habitTemplates$, appActions, ScheduleType } from '@/state/store';
import { useUnistyles } from 'react-native-unistyles';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { EmojiPicker } from '@/ui/EmojiPicker';
import { DayPicker } from './DayPicker';
import { stylesheet } from './styles';

export const EngineEditor = observer(() => {
  const { theme } = useUnistyles();
  const habits = habitTemplates$.get()?.filter(h => !h.archivedAt) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState<string | undefined>(undefined);
  const [scheduleType, setScheduleType] = useState<ScheduleType>('daily');
  const [specificDays, setSpecificDays] = useState<number[]>([]);

  const handleEdit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      setTitle(habit.title);
      setEmoji(habit.emoji);
      setScheduleType(habit.scheduleType);
      setSpecificDays(habit.specificDays || []);
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleAdd = () => {
    setTitle('');
    setEmoji(undefined);
    setScheduleType('daily');
    setSpecificDays([]);
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (isAdding) {
      appActions.addHabit(title, emoji, scheduleType, specificDays);
    } else if (editingId) {
      appActions.updateHabit(editingId, { title, emoji, scheduleType, specificDays });
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const confirmDelete = (id: string) => {
    appActions.deleteHabit(id);
    setDeletingId(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <BrutalistButton onPress={handleAdd} backgroundColor={theme.colors.success} style={{ marginBottom: 16 }}>
        + NEW HABIT
      </BrutalistButton>
      {habits.map((habit) => (
        <BrutalistCard key={habit.id} backgroundColor={theme.colors.background} style={{ marginBottom: 8 }}>
          <View style={stylesheet.listItemRow}>
            <View style={stylesheet.listItemContent}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                <Typography style={{ marginRight: 6 }}>{habit.emoji || '⚡'}</Typography>
                <Typography variant="bodyBold" style={{ flex: 1, flexWrap: 'wrap' }}>{habit.title}</Typography>
              </View>
              <Typography variant="caption" style={{ color: theme.colors.textMuted }}>
                HOW OFTEN: {habit.scheduleType === 'alternate_days' ? 'EVERY OTHER DAY' : habit.scheduleType === 'specific_days' ? 'CHOOSE DAYS' : 'EVERY DAY'}
              </Typography>
            </View>
            <View style={stylesheet.listItemActions}>
              <BrutalistButton onPress={() => handleEdit(habit.id)} size="sm" backgroundColor={theme.colors.warning}>
                EDIT
              </BrutalistButton>
              <BrutalistButton onPress={() => setDeletingId(habit.id)} size="sm" backgroundColor={theme.colors.danger}>
                DEL
              </BrutalistButton>
            </View>
          </View>
        </BrutalistCard>
      ))}

      <BrutalistBottomSheet
        visible={isAdding || editingId !== null}
        onClose={() => { setEditingId(null); setIsAdding(false); }}
        title={isAdding ? 'NEW HABIT' : 'EDIT HABIT'}
      >
        <View style={stylesheet.formContainer}>
          <BrutalistInput
            label="HABIT NAME"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. 100 PUSHUPS"
          />
          
          <Typography variant="bodyBold" style={{ marginTop: 16, marginBottom: 8 }}>
            EMOJI ICON
          </Typography>
          <EmojiPicker selectedEmoji={emoji} onSelect={setEmoji} />

          <Typography variant="bodyBold" style={{ marginTop: 16, marginBottom: 8 }}>
            HOW OFTEN
          </Typography>
          <View style={stylesheet.segmentedControl}>
            {(['daily', 'alternate_days', 'specific_days'] as ScheduleType[]).map((type) => {
              const label = type === 'alternate_days' ? 'OTHER DAYS' : type === 'specific_days' ? 'CHOOSE DAYS' : 'EVERY DAY';
              const isActive = scheduleType === type;
              return (
                <BrutalistButton
                  key={type}
                  onPress={() => setScheduleType(type)}
                  backgroundColor={isActive ? theme.colors.warning : theme.colors.background}
                  size="sm"
                  style={{ flex: 1, marginHorizontal: 2 }}
                >
                  {label}
                </BrutalistButton>
              );
            })}
          </View>

          {scheduleType === 'specific_days' && (
            <>
              <Typography variant="bodyBold" style={{ marginTop: 16, marginBottom: 8 }}>
                SELECT DAYS
              </Typography>
              <DayPicker selectedDays={specificDays} onChange={setSpecificDays} />
            </>
          )}

          <BrutalistButton
            onPress={handleSave}
            backgroundColor={theme.colors.success}
            style={{ marginTop: 20 }}
          >
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
            Are you sure you want to delete this habit? This action cannot be undone.
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
