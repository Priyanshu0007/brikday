import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.text,
    letterSpacing: -1,
  },
  brandSubtitle: {
    color: theme.colors.textMuted,
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
    color: theme.colors.text,
  },
  slideDescription: {
    color: theme.colors.textMuted,
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

  // Tip box
  tipBox: {
    marginTop: 12,
    backgroundColor: theme.colors.paper,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tipText: {
    fontSize: 10,
    textAlign: 'center',
    color: theme.colors.textMuted,
  },

  // Pill badge
  pillBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.paper,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  pillText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: theme.colors.text,
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
    color: theme.colors.textMuted,
  },

  // ── Profile Slide ──────────────────────
  profileSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  avatarPickerContainer: {
    marginTop: 4,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarChip: {
    width: 48,
    height: 48,
    borderWidth: 2.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarChipSelected: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.border,
  },
  avatarChipEmoji: {
    fontSize: 22,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  currencyChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.paper,
    borderRadius: theme.borderRadius,
  },
  currencyChipSelected: {
    backgroundColor: theme.colors.text,
  },

  // ── Habit Picker Slide ─────────────────
  habitPickerScroll: {
    flex: 1,
  },
  habitPickerContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  habitCounterContainer: {
    alignSelf: 'center',
    marginBottom: 12,
    backgroundColor: theme.colors.paper,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  habitCounterReady: {
    backgroundColor: theme.colors.success,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  habitChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
  },
  habitChipSelected: {
    backgroundColor: theme.colors.success,
  },
  habitChipEmoji: {
    fontSize: 16,
  },
  habitChipTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: theme.colors.text,
  },
  habitChipCheck: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  customHabitSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  customHabitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customHabitInput: {
    flex: 1,
  },
  addedCustomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.success,
    marginTop: 8,
  },

  // ── Theme Slide ────────────────────────
  themeOptionsContainer: {
    gap: 12,
  },
  themeCard: {
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    overflow: 'hidden',
  },
  themeCardSelected: {
    borderWidth: 4,
    borderColor: theme.colors.success,
  },
  themeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  themeCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  themeCheckBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themePreview: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 6,
  },
  themePreviewBar: {
    height: 12,
    borderRadius: 2,
    borderWidth: 1.5,
  },

  // ── Notification Slide ─────────────────
  notifContainer: {
    gap: 16,
  },
  notifToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
  },
  notifToggleLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notifToggleEmoji: {
    fontSize: 20,
  },
  timePickerContainer: {
    marginTop: 4,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  timeButton: {
    width: 40,
    height: 40,
    borderWidth: 2.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeDisplay: {
    minWidth: 80,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: theme.colors.text,
  },
  timeLabel: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 1,
  },
  motivationBox: {
    marginTop: 16,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  motivationText: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 16,
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
  },

  // ── Final Slide ────────────────────────
  finalEmoji: {
    alignSelf: 'center',
    marginBottom: 4,
  },
  emojiTextLarge: {
    fontSize: 56,
    lineHeight: 72,
  },

  // ── Toggle switch (brutalist) ──────────
  toggleTrack: {
    width: 52,
    height: 30,
    borderWidth: 2.5,
    borderColor: theme.colors.border,
    borderRadius: 3,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackActive: {
    backgroundColor: theme.colors.success,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.border,
  },

  // Validation error
  validationError: {
    textAlign: 'center',
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
}));
