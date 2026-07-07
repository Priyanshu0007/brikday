import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BrutalistCard } from './BrutalistCard';
import { BrutalistButton } from './BrutalistButton';
import { Typography } from './Typography';

interface EmptyStateProps {
  /** Large emoji displayed in a circular badge */
  emoji: string;
  /** Uppercase title text (e.g. "NO SAVINGS GOALS YET") */
  title: string;
  /** Descriptive body text below the title */
  description: string;
  /** Label for the action button */
  ctaLabel?: string;
  /** Callback when the action button is pressed */
  onCtaPress?: () => void;
  /** Optional style override for the outer wrapper */
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  emoji,
  title,
  description,
  ctaLabel,
  onCtaPress,
  style,
}: EmptyStateProps) {
  return (
    <BrutalistCard style={[stylesheet.card, style]}>
      <View style={stylesheet.content}>
        {/* Emoji badge */}
        <View style={stylesheet.badge}>
          <Typography style={stylesheet.badgeEmoji}>{emoji}</Typography>
        </View>

        {/* Title */}
        <Typography variant="h3" uppercase style={stylesheet.title}>
          {title}
        </Typography>

        {/* Description */}
        <Typography variant="body" style={stylesheet.description}>
          {description}
        </Typography>

        {/* CTA button */}
        {ctaLabel && onCtaPress && (
          <BrutalistButton
            onPress={onCtaPress}
            style={stylesheet.cta}
            size="md"
          >
            {ctaLabel}
          </BrutalistButton>
        )}
      </View>
    </BrutalistCard>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  card: {
    marginTop: 24,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.warning,
    borderWidth: 3,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  badgeEmoji: {
    fontSize: 32,
    lineHeight: 38,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 20,
  },
  description: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginBottom: 24,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  cta: {
    minWidth: 200,
  },
}));
