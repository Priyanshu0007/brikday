import React from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { Typography } from '@/ui/Typography';
import { triggerHaptic } from '@/ui/haptics';

const COMMON_EMOJIS = [
  '💪',
  '🏃‍♂️',
  '📚',
  '🧘',
  '💧',
  '🎨',
  '💻',
  '🏋️',
  '🍳',
  '✍️',
  '🎵',
  '🌿',
  '🍎',
  '💤',
  '🧠',
  '💸',
  '🧹',
  '🚲',
  '🎸',
  '📱',
  '☀️',
  '☕',
  '🚀',
  '🎯',
  '🧘‍♀️',
  '🧗',
  '🔥',
  '💡',
  '📖',
  '📅',
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

const numColumns = 5;
const screenWidth = Dimensions.get('window').width;
// Assuming some padding around the modal, say 32 (16 on each side), gap 8
const availableWidth = screenWidth - 32;
const cardSize = (availableWidth - (numColumns - 1) * 8) / numColumns;

export const EmojiPicker = ({ onSelect, selectedEmoji }: EmojiPickerProps) => {
  const { theme } = useUnistyles();

  const handleSelect = (emoji: string) => {
    triggerHaptic('selection');
    onSelect(emoji);
  };

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = selectedEmoji === item;

    return (
      <BrutalistCard
        onPress={() => handleSelect(item)}
        backgroundColor={isSelected ? theme.colors.warning : theme.colors.paper}
        style={[styles.emojiCard, { width: cardSize, height: cardSize }]}
      >
        <Typography style={styles.emojiText}>{item}</Typography>
      </BrutalistCard>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={COMMON_EMOJIS}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    height: 300,
    width: '100%',
  },
  listContent: {
    paddingVertical: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  emojiCard: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  emojiText: {
    fontSize: 24,
  },
}));
