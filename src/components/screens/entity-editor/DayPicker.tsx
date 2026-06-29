import React from 'react';
import { View, Pressable } from 'react-native';
import { Typography } from '@/ui/Typography';
import { stylesheet as styles } from './styles';

export const DayPicker = ({
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
