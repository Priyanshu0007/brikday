import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { appState$, appActions, ScheduleType } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';

const DayPicker = ({
  selectedDays,
  onChange,
}: {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}) => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const toggleDay = (idx: number) => {
    if (selectedDays.includes(idx)) {
      onChange(selectedDays.filter((d) => d !== idx));
    } else {
      onChange([...selectedDays, idx].sort());
    }
  };

  return (
    <View style={styles.dayPickerContainer}>
      {days.map((day, idx) => {
        const isSelected = selectedDays.includes(idx);
        return (
          <Pressable
            key={idx}
            style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
            onPress={() => toggleDay(idx)}
          >
            <Typography
              variant="caption"
              style={[styles.dayText, isSelected && styles.dayTextSelected]}
            >
              {day}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
};

// --- ENGINE EDITOR ---
const EngineEditor = observer(() => {
  const habits = appState$.habits.get();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('daily');
  const [specificDays, setSpecificDays] = useState<number[]>([]);

  const handleEdit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      setTitle(habit.title);
      setScheduleType(habit.scheduleType);
      setSpecificDays(habit.specificDays || []);
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleAdd = () => {
    setTitle('');
    setScheduleType('daily');
    setSpecificDays([]);
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (isAdding) {
      appActions.addHabit(title, scheduleType, specificDays);
    } else if (editingId) {
      appActions.updateHabit(editingId, { title, scheduleType, specificDays });
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
      <BrutalistButton onPress={handleAdd} backgroundColor={BRUTALIST_THEME.colors.success} style={{ marginBottom: 16 }}>
        + NEW HABIT
      </BrutalistButton>
      {habits.map((habit) => (
        <BrutalistCard key={habit.id} backgroundColor="#FFFFFF" style={{ marginBottom: 8 }}>
          <View style={styles.listItemRow}>
            <View style={styles.listItemContent}>
              <Typography variant="bodyBold">{habit.title}</Typography>
              <Typography variant="caption" style={{ color: BRUTALIST_THEME.colors.textMuted }}>
                SCHEDULE: {habit.scheduleType.toUpperCase()}
              </Typography>
            </View>
            <View style={styles.listItemActions}>
              <BrutalistButton onPress={() => handleEdit(habit.id)} size="sm" backgroundColor={BRUTALIST_THEME.colors.warning}>
                EDIT
              </BrutalistButton>
              <BrutalistButton onPress={() => setDeletingId(habit.id)} size="sm" backgroundColor={BRUTALIST_THEME.colors.danger}>
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
        <View style={styles.formContainer}>
          <BrutalistInput
            label="HABIT INSTRUCTION"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. 100 PUSHUPS"
          />
          
          <Typography variant="bodyBold" style={{ marginTop: 16, marginBottom: 8 }}>
            SCHEDULE TYPE
          </Typography>
          <View style={styles.segmentedControl}>
            {(['daily', 'alternate_days', 'specific_days'] as ScheduleType[]).map((type) => {
              const label = type === 'alternate_days' ? 'ALT DAYS' : type === 'specific_days' ? 'SPEC DAYS' : 'DAILY';
              return (
                <BrutalistButton
                  key={type}
                  onPress={() => setScheduleType(type)}
                  backgroundColor={scheduleType === type ? BRUTALIST_THEME.colors.primary : '#FFFFFF'}
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
            backgroundColor={BRUTALIST_THEME.colors.success}
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
        <View style={styles.formContainer}>
          <Typography variant="body" style={{ marginBottom: 20 }}>
            Are you sure you want to delete this habit? This action cannot be undone.
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

// --- VAULT EDITOR ---
const VaultEditor = observer(() => {
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

// --- BLUEPRINT EDITOR ---
const BlueprintEditor = observer(() => {
  const projects = appState$.blueprintProjects.get();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const handleEdit = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      setTitle(project.title);
      setCategory(project.category);
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleAdd = () => {
    setTitle('');
    setCategory('');
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (isAdding) {
      appActions.addProject(title, category);
    } else if (editingId) {
      appActions.updateProject(editingId, { title, category });
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const confirmDelete = (id: string) => {
    appActions.deleteProject(id);
    setDeletingId(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <BrutalistButton onPress={handleAdd} backgroundColor={BRUTALIST_THEME.colors.success} style={{ marginBottom: 16 }}>
        + NEW PROJECT
      </BrutalistButton>
      {projects.map((project) => (
        <BrutalistCard key={project.id} backgroundColor="#FFFFFF" style={{ marginBottom: 8 }}>
          <View style={styles.listItemRow}>
            <View style={styles.listItemContent}>
              <Typography variant="bodyBold">{project.title}</Typography>
              <Typography variant="caption" style={{ color: BRUTALIST_THEME.colors.textMuted }}>
                CATEGORY: {project.category}
              </Typography>
            </View>
            <View style={styles.listItemActions}>
              <BrutalistButton onPress={() => handleEdit(project.id)} size="sm" backgroundColor={BRUTALIST_THEME.colors.warning}>
                EDIT
              </BrutalistButton>
              <BrutalistButton onPress={() => setDeletingId(project.id)} size="sm" backgroundColor={BRUTALIST_THEME.colors.danger}>
                DEL
              </BrutalistButton>
            </View>
          </View>
        </BrutalistCard>
      ))}

      <BrutalistBottomSheet
        visible={isAdding || editingId !== null}
        onClose={() => { setEditingId(null); setIsAdding(false); }}
        title={isAdding ? 'NEW PROJECT' : 'EDIT PROJECT'}
      >
        <View style={styles.formContainer}>
          <BrutalistInput
            label="PROJECT TITLE"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. VeloCity App"
          />
          <BrutalistInput
            label="CATEGORY"
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. WORK"
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
            Are you sure you want to delete this project?
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

export const EntityEditorScreen = observer(() => {
  const [activeTab, setActiveTab] = useState<'engine' | 'vault' | 'blueprint'>('engine');

  const renderActiveEditor = () => {
    switch (activeTab) {
      case 'engine': return <EngineEditor />;
      case 'vault': return <VaultEditor />;
      case 'blueprint': return <BlueprintEditor />;
    }
  };

  return (
    <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Typography variant="h2">DATABASE EDITOR</Typography>
        <BrutalistButton onPress={() => router.back()} size="sm" backgroundColor={BRUTALIST_THEME.colors.danger}>
          CLOSE
        </BrutalistButton>
      </View>

      <View style={styles.tabsContainer}>
        {(['engine', 'vault', 'blueprint'] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Typography variant="bodyBold" style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.toUpperCase()}
            </Typography>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {renderActiveEditor()}
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: BRUTALIST_THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: BRUTALIST_THEME.colors.border,
    backgroundColor: BRUTALIST_THEME.colors.paper,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRightWidth: 2,
    borderRightColor: BRUTALIST_THEME.colors.border,
  },
  tabActive: {
    backgroundColor: '#000000',
  },
  tabText: {
    color: '#000000',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemContent: {
    flex: 1,
  },
  listItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  formContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  dayButtonSelected: {
    backgroundColor: '#000000',
  },
  dayText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
});
