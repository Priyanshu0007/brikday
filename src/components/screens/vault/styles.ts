import { StyleSheet } from 'react-native';
import { BRUTALIST_THEME } from '@/ui/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 10,
    color: BRUTALIST_THEME.colors.textMuted,
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100, // Clear the bottom tabs
  },
  cardSpacing: {
    marginVertical: 8,
  },
  sliderContainer: {
    paddingVertical: 4,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  percentBadge: {
    backgroundColor: BRUTALIST_THEME.colors.border,
    color: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 2,
  },
  savedCaption: {
    color: BRUTALIST_THEME.colors.textMuted,
    marginBottom: 12,
    fontFamily: BRUTALIST_THEME.fonts.mono,
  },
  track: {
    height: 16,
    backgroundColor: BRUTALIST_THEME.colors.paper,
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BRUTALIST_THEME.colors.warning,
  },
  staticTrackContainer: {
    height: 16,
    marginVertical: 8,
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  formContent: {
    paddingBottom: 4,
  },
  submitBtn: {
    marginTop: 16,
  },
  historyListContent: {
    paddingBottom: 4,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: BRUTALIST_THEME.fonts.mono,
    fontSize: 12,
    color: BRUTALIST_THEME.colors.textMuted,
  },
  txnItem: {
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginVertical: 6,
    shadowColor: BRUTALIST_THEME.colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  txnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  txnAmount: {
    fontSize: 16,
    color: BRUTALIST_THEME.colors.success,
  },
  txnDate: {
    fontSize: 11,
    color: BRUTALIST_THEME.colors.textMuted,
  },
  txnSource: {
    fontSize: 11,
    color: BRUTALIST_THEME.colors.text,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  txnComment: {
    fontSize: 11,
    color: BRUTALIST_THEME.colors.textMuted,
    fontStyle: 'italic',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
