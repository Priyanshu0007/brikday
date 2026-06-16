import { BRUTALIST_THEME } from '@/ui/theme';
import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRUTALIST_THEME.colors.background,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  brandTitle: {
    fontSize: 36,
    lineHeight: 40,
    color: BRUTALIST_THEME.colors.text,
    letterSpacing: -1,
  },
  brandSubtitle: {
    color: BRUTALIST_THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 1.5,
  },

  // Pager
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  slideOuter: {
    flex: 1,
    justifyContent: 'center',
  },
  slideInner: {
    paddingHorizontal: 24,
  },

  // Welcome Slide
  welcomeEmoji: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  emojiText: {
    fontSize: 48,
  },

  // Slide Content
  slideTitle: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 8,
    color: BRUTALIST_THEME.colors.text,
  },
  slideDescription: {
    color: BRUTALIST_THEME.colors.textMuted,
    lineHeight: 22,
    marginBottom: 16,
    fontSize: 14,
  },

  // Concept Cards (Slide 0)
  conceptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  conceptIcon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  conceptText: {
    flex: 1,
  },

  // Habit Preview (Slide 1)
  previewContainer: {
    gap: 4,
  },
  habitPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  habitPreviewText: {
    flex: 1,
    gap: 2,
  },
  checkboxDone: {
    width: 26,
    height: 26,
    borderWidth: 2.5,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: 3,
    backgroundColor: BRUTALIST_THEME.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 14,
    lineHeight: 16,
    color: '#000',
  },
  checkboxPending: {
    width: 26,
    height: 26,
    borderWidth: 2.5,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  doneText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: BRUTALIST_THEME.colors.textMuted,
  },

  // Progress bar (Slide 2)
  progressBarBg: {
    height: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressRight: {
    fontWeight: 'bold',
  },

  // Project Preview (Slide 3)
  projectPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeTag: {
    backgroundColor: BRUTALIST_THEME.colors.success + '30',
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: BRUTALIST_THEME.colors.border,
  },
  activeTagText: {
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Final Slide
  finalEmoji: {
    alignSelf: 'center',
    marginBottom: 4,
  },
  emojiTextLarge: {
    fontSize: 56,
    lineHeight: 72,
  },
  summaryContainer: {
    gap: 4,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  motivationBox: {
    marginTop: 16,
    borderTopWidth: 2,
    borderTopColor: BRUTALIST_THEME.colors.border,
    paddingTop: 12,
  },
  motivationText: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 16,
    color: BRUTALIST_THEME.colors.textMuted,
    letterSpacing: 0.8,
  },

  // Tip box
  tipBox: {
    marginTop: 12,
    backgroundColor: BRUTALIST_THEME.colors.paper,
    borderWidth: 1.5,
    borderColor: BRUTALIST_THEME.colors.border,
    borderStyle: 'dashed',
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tipText: {
    fontSize: 10,
    textAlign: 'center',
    color: BRUTALIST_THEME.colors.textMuted,
  },

  // Pill badge
  pillBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FE',
    borderRadius: 3,
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  pillText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  pageCounter: {
    textAlign: 'center',
    fontSize: 10,
    color: BRUTALIST_THEME.colors.textMuted,
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'underline',
  },
});
