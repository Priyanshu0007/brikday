import React from 'react';
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { BRUTALIST_THEME } from './theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'mono' | 'caption';
  color?: string;
  uppercase?: boolean;
  style?: StyleProp<TextStyle>;
}

export function Typography({
  children,
  variant = 'body',
  color = BRUTALIST_THEME.colors.text,
  uppercase = false,
  style,
  ...props
}: TypographyProps) {
  const isHeading = ['h1', 'h2', 'h3'].includes(variant);
  const textTransform = (uppercase || (isHeading && uppercase !== false) ? 'uppercase' : undefined) as TextStyle['textTransform'];

  const fontStyle = StyleSheet.flatten([
    styles.base,
    styles[variant],
    { color, textTransform },
    style,
  ]);

  return (
    <Text style={fontStyle} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: BRUTALIST_THEME.fonts.body,
  },
  h1: {
    fontFamily: BRUTALIST_THEME.fonts.heading,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 'bold',
  },
  h2: {
    fontFamily: BRUTALIST_THEME.fonts.heading,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  h3: {
    fontFamily: BRUTALIST_THEME.fonts.heading,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  body: {
    fontFamily: BRUTALIST_THEME.fonts.body,
    fontSize: 15,
    lineHeight: 20,
  },
  bodyBold: {
    fontFamily: BRUTALIST_THEME.fonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  mono: {
    fontFamily: BRUTALIST_THEME.fonts.mono,
    fontSize: 13,
    lineHeight: 18,
  },
  caption: {
    fontFamily: BRUTALIST_THEME.fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: BRUTALIST_THEME.colors.textMuted,
  },
});
