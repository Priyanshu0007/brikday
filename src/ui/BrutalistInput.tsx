import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleProp, ViewStyle, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
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
  const { theme } = useUnistyles();

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const offset = focused ? 2 : 4;

  return (
    <View style={[stylesheet.wrapper, containerStyle]}>
      {label && (
        <Typography variant="bodyBold" style={stylesheet.label} uppercase>
          {label}
        </Typography>
      )}

      {/* Outer box holding both foreground and background layers */}
      <View style={[stylesheet.inputOuter, { paddingRight: offset, paddingBottom: offset }]}>
        {/* Shadow layer behind */}
        <View
          style={[
            stylesheet.shadowBg,
            {
              top: offset,
              left: offset,
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.border,
            },
          ]}
        />

        {/* Foreground input container */}
        <View style={stylesheet.inputContainer}>
          <TextInput
            style={[stylesheet.input, style]}
            placeholderTextColor={theme.colors.textMuted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </View>
      </View>
    </View>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
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
    backgroundColor: theme.colors.paper,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
  },
  input: {
    fontFamily: theme.fonts.mono,
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: theme.colors.text,
  },
}));
