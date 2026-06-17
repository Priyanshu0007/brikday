import { StyleSheet } from 'react-native-unistyles';

export const stylesheet = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: theme.colors.background,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
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
    backgroundColor: theme.colors.border,
    color: theme.colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 2,
  },
  savedCaption: {
    color: theme.colors.textMuted,
    marginBottom: 12,
    fontFamily: theme.fonts.mono,
  },
  track: {
    height: 16,
    backgroundColor: theme.colors.paper,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.warning,
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
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  txnItem: {
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.background,
    padding: 12,
    marginVertical: 6,
    shadowColor: theme.colors.border,
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
    color: theme.colors.success,
  },
  txnDate: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  txnSource: {
    fontSize: 11,
    color: theme.colors.text,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  txnComment: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
}));
