import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { BRUTALIST_THEME } from './theme';
import { Typography } from './Typography';

interface BrutalistInputProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function BrutalistInput({
  label,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: BrutalistInputProps) {
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: any) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const offset = focused ? 2 : 4;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Typography variant="bodyBold" style={styles.label} uppercase>
          {label}
        </Typography>
      )}
      
      {/* Outer box holding both foreground and background layers */}
      <View 
        style={[
          styles.inputOuter, 
          { paddingRight: offset, paddingBottom: offset }
        ]}
      >
        {/* Shadow layer behind */}
        <View
          style={[
            styles.shadowBg,
            {
              top: offset,
              left: offset,
              borderRadius: BRUTALIST_THEME.borderRadius,
              backgroundColor: BRUTALIST_THEME.colors.border,
            },
          ]}
        />
        
        {/* Foreground input container */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, style]}
            placeholderTextColor="#888888"
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    marginVertical: 8,
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
  },
  inputOuter: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  shadowBg: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
  },
  input: {
    fontFamily: BRUTALIST_THEME.fonts.mono,
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: BRUTALIST_THEME.colors.text,
  },
});
