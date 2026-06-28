import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'mono' | 'caption';
  color?: string;
  uppercase?: boolean;
  style?: StyleProp<TextStyle>;
}

export function Typography({
  children,
  variant = 'body',
  color,
  uppercase = false,
  style,
  ...props
}: TypographyProps) {
  const { theme } = useUnistyles();
  const isHeading = ['h1', 'h2', 'h3'].includes(variant);
  const textTransform = (
    uppercase || (isHeading && uppercase !== false) ? 'uppercase' : undefined
  ) as TextStyle['textTransform'];

  const finalColor = color || theme.colors.text;

  return (
    <Text
      style={[stylesheet.base, stylesheet[variant], { color: finalColor, textTransform }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  base: {
    fontFamily: theme.fonts.body,
  },
  h1: {
    fontFamily: theme.fonts.heading,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 'bold',
  },
  h2: {
    fontFamily: theme.fonts.heading,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  h3: {
    fontFamily: theme.fonts.heading,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  body: {
    fontFamily: theme.fonts.body,
    fontSize: 15,
    lineHeight: 20,
  },
  bodyBold: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  mono: {
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    lineHeight: 18,
  },
  caption: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.textMuted,
  },
}));
