import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
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

const PREDEFINED_CATEGORIES = [
  { name: 'HEALTH', emoji: '💪', color: '#4ADE80' },
  { name: 'WORK', emoji: '💼', color: '#FB923C' },
  { name: 'LEARNING', emoji: '📚', color: '#38BDF8' },
  { name: 'MINDFULNESS', emoji: '🧘', color: '#E879F9' },
  { name: 'FITNESS', emoji: '🏃', color: '#FBBF24' },
  { name: 'CREATIVE', emoji: '🎨', color: '#A78BFA' },
  { name: 'FINANCE', emoji: '💰', color: '#F472B6' },
  { name: 'OTHER', emoji: '⚡', color: '#94A3B8' },
];

const getCategoryDisplay = (name: string) => {
  const predefined = PREDEFINED_CATEGORIES.find(c => c.name === name.toUpperCase());
  return predefined ? `${predefined.emoji} ${name.toUpperCase()}` : name.toUpperCase();
};

export const EngineEditor = observer(() => {
  const { theme } = useUnistyles();
  const habits = habitTemplates$.get()?.filter((h) => h && h.id && h.title && !h.archivedAt) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState<string | undefined>(undefined);
  const [scheduleType, setScheduleType] = useState<ScheduleType>('daily');
  const [specificDays, setSpecificDays] = useState<number[]>([]);
  const [category, setCategory] = useState<string>('');
  const [categoryColor, setCategoryColor] = useState<string>('#94A3B8');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  const handleEdit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      setTitle(habit.title);
      setEmoji(habit.emoji);
      setScheduleType(habit.scheduleType);
      setSpecificDays(habit.specificDays || []);
      
      const cat = habit.category || '';
      const color = habit.categoryColor || '#94A3B8';
      setCategory(cat);
      setCategoryColor(color);
      
      const isPredef = PREDEFINED_CATEGORIES.some(p => p.name === cat.toUpperCase());
      if (cat && !isPredef) {
        setIsCustomCategory(true);
        setCustomCategoryName(cat);
      } else {
        setIsCustomCategory(false);
        setCustomCategoryName('');
      }
      
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleAdd = () => {
    setTitle('');
    setEmoji(undefined);
    setScheduleType('daily');
    setSpecificDays([]);
    setCategory('');
    setCategoryColor('#94A3B8');
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSave = () => {
    const finalCategory = isCustomCategory ? customCategoryName.trim().toUpperCase() : category.toUpperCase();
    const finalColor = categoryColor;

    const updates = {
      title,
      emoji,
      scheduleType,
      specificDays,
      category: finalCategory || undefined,
      categoryColor: finalCategory ? finalColor : undefined,
    };

    if (isAdding) {
      appActions.addHabit(title, emoji, scheduleType, specificDays, Date.now(), updates.category, updates.categoryColor);
    } else if (editingId) {
      appActions.updateHabit(editingId, updates);
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
      <BrutalistButton
        onPress={handleAdd}
        backgroundColor={theme.colors.success}
        style={{ marginBottom: 16 }}
      >
        + NEW HABIT
      </BrutalistButton>
      {habits.map((habit) => (
        <Swipeable
          key={habit.id}
          containerStyle={{ marginBottom: 8 }}
          renderRightActions={() => (
            <View style={stylesheet.swipeActionContainer}>
              <TouchableOpacity
                style={[stylesheet.swipeActionButton, { backgroundColor: theme.colors.warning }]}
                onPress={() => handleEdit(habit.id)}
              >
                <Typography variant="caption" style={{ color: theme.colors.background, fontWeight: 'bold' }}>
                  EDIT
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[stylesheet.swipeActionButton, { backgroundColor: theme.colors.danger }]}
                onPress={() => setDeletingId(habit.id)}
              >
                <Typography variant="caption" style={{ color: theme.colors.background, fontWeight: 'bold' }}>
                  DEL
                </Typography>
              </TouchableOpacity>
            </View>
          )}
        >
          <BrutalistCard
            backgroundColor={theme.colors.background}
            style={{ marginVertical: 0 }}
          >
            <View style={stylesheet.listItemRow}>
              <View style={stylesheet.listItemContent}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                  <Typography style={{ marginRight: 6 }}>{habit.emoji || '⚡'}</Typography>
                  <Typography variant="bodyBold" style={{ flex: 1, flexWrap: 'wrap' }}>
                    {habit.title}
                  </Typography>
                </View>
                <Typography variant="caption" style={{ color: theme.colors.textMuted }}>
                  HOW OFTEN:{' '}
                  {habit.scheduleType === 'alternate_days'
                    ? 'EVERY OTHER DAY'
                    : habit.scheduleType === 'specific_days'
                      ? 'CHOOSE DAYS'
                      : 'EVERY DAY'}
                </Typography>
                {habit.category && (
                  <View style={[stylesheet.categoryBadge, { backgroundColor: habit.categoryColor || '#94A3B8' }]}>
                    <Typography variant="caption" style={{ color: '#000000', fontSize: 10, fontWeight: 'bold' }}>
                      {getCategoryDisplay(habit.category)}
                    </Typography>
                  </View>
                )}
              </View>
            </View>
          </BrutalistCard>
        </Swipeable>
      ))}

      <BrutalistBottomSheet
        visible={isAdding || editingId !== null}
        onClose={() => {
          setEditingId(null);
          setIsAdding(false);
        }}
        title={isAdding ? 'NEW HABIT' : 'EDIT HABIT'}
        scrollable
        footer={
          <BrutalistButton
            onPress={handleSave}
            backgroundColor={theme.colors.success}
          >
            SAVE
          </BrutalistButton>
        }
      >
        <ScrollView contentContainerStyle={stylesheet.formContainer} showsVerticalScrollIndicator={false}>
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
            CATEGORY
          </Typography>
          <View style={stylesheet.categoryGrid}>
            {PREDEFINED_CATEGORIES.map((cat) => {
              const isSelected = !isCustomCategory && category === cat.name;
              return (
                <TouchableOpacity
                  key={cat.name}
                  style={[
                    stylesheet.categoryChip,
                    { backgroundColor: isSelected ? cat.color : theme.colors.background },
                    isSelected && { borderWidth: 3 }
                  ]}
                  onPress={() => {
                    setIsCustomCategory(false);
                    setCategory(cat.name);
                    setCategoryColor(cat.color);
                  }}
                >
                  <Typography
                    variant="caption"
                    style={{
                      color: isSelected ? '#000000' : theme.colors.text,
                      fontWeight: 'bold'
                    }}
                  >
                    {cat.emoji} {cat.name}
                  </Typography>
                </TouchableOpacity>
              );
            })}
            
            <TouchableOpacity
              style={[
                stylesheet.categoryChip,
                { backgroundColor: isCustomCategory ? categoryColor : theme.colors.background },
                isCustomCategory && { borderWidth: 3 }
              ]}
              onPress={() => {
                setIsCustomCategory(true);
                if (!customCategoryName) {
                  setCategoryColor('#4ADE80'); // default to green for custom
                }
              }}
            >
              <Typography
                variant="caption"
                style={{
                  color: isCustomCategory ? '#000000' : theme.colors.text,
                  fontWeight: 'bold'
                }}
              >
                ✏️ CUSTOM...
              </Typography>
            </TouchableOpacity>
          </View>

          {isCustomCategory && (
            <View style={{ marginTop: 4 }}>
              <BrutalistInput
                label="CUSTOM CATEGORY NAME"
                value={customCategoryName}
                onChangeText={setCustomCategoryName}
                placeholder="e.g. MORNING ROUTINE"
              />
              
              <Typography variant="bodyBold" style={{ marginTop: 16, marginBottom: 8 }}>
                SELECT CATEGORY COLOR
              </Typography>
              <View style={stylesheet.colorRow}>
                {['#4ADE80', '#FB923C', '#38BDF8', '#E879F9', '#FBBF24', '#A78BFA', '#F472B6', '#94A3B8'].map((color) => {
                  const isSelected = categoryColor === color;
                  return (
                    <TouchableOpacity
                      key={color}
                      style={[
                        stylesheet.colorOption,
                        { backgroundColor: color },
                        isSelected && stylesheet.colorOptionSelected
                      ]}
                      onPress={() => setCategoryColor(color)}
                    />
                  );
                })}
              </View>
            </View>
          )}

          <Typography variant="bodyBold" style={{ marginTop: 16, marginBottom: 8 }}>
            HOW OFTEN
          </Typography>
          <View style={stylesheet.segmentedControl}>
            {(['daily', 'alternate_days', 'specific_days'] as ScheduleType[]).map((type) => {
              const label =
                type === 'alternate_days'
                  ? 'OTHER DAYS'
                  : type === 'specific_days'
                    ? 'CHOOSE DAYS'
                    : 'EVERY DAY';
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
        </ScrollView>
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
            <BrutalistButton
              onPress={() => setDeletingId(null)}
              backgroundColor={theme.colors.paper}
              style={{ flex: 1 }}
            >
              CANCEL
            </BrutalistButton>
            <BrutalistButton
              onPress={() => deletingId && confirmDelete(deletingId)}
              backgroundColor={theme.colors.danger}
              style={{ flex: 1 }}
            >
              DELETE
            </BrutalistButton>
          </View>
        </View>
      </BrutalistBottomSheet>
    </View>
  );
});
