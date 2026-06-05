import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BRUTALIST_THEME } from './theme';

interface BrutalistCardProps {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  neglected?: boolean;
  accentColor?: string;
}

export function BrutalistCard({
  children,
  backgroundColor = BRUTALIST_THEME.colors.paper,
  style,
  neglected = false,
  accentColor,
}: BrutalistCardProps) {
  
  // When neglected, the card decays: turns background to danger red, and doubles the shadow offset.
  const activeBgColor = neglected 
    ? BRUTALIST_THEME.colors.danger 
    : (accentColor || backgroundColor);
  
  const offset = neglected ? 8 : 4;

  return (
    <View 
      style={[
        styles.cardWrapper, 
        style, 
        { paddingRight: offset, paddingBottom: offset }
      ]}
    >
      {/* Shadow layer behind */}
      <View
        style={[
          styles.shadowLayer,
          {
            top: offset,
            left: offset,
            borderRadius: BRUTALIST_THEME.borderRadius,
            backgroundColor: BRUTALIST_THEME.colors.border,
          },
        ]}
      />
      
      {/* Foreground card layer */}
      <View
        style={[
          styles.card,
          { 
            backgroundColor: activeBgColor,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    alignSelf: 'stretch',
    marginVertical: 6,
    position: 'relative',
  },
  shadowLayer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  card: {
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    padding: 16,
  },
});
