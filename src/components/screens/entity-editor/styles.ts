import { StyleSheet } from 'react-native-unistyles';

export const stylesheet = StyleSheet.create((theme) => ({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.paper,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRightWidth: 2,
    borderRightColor: theme.colors.border,
  },
  tabActive: {
    backgroundColor: theme.colors.text,
  },
  tabText: {
    color: theme.colors.text,
  },
  tabTextActive: {
    color: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemContent: {
    flex: 1,
  },
  listItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  formContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    marginBottom: 4,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: theme.colors.text,
    borderRadius: 4,
    backgroundColor: theme.colors.background,
  },
  dayButtonSelected: {
    backgroundColor: theme.colors.text,
  },
  dayText: {
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  dayTextSelected: {
    color: theme.colors.background,
  },
  swipeActionContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingLeft: 8,
    paddingBottom: 4, // Align with card shadow offset
    gap: 8,
  },
  swipeActionButton: {
    aspectRatio: 1, // Make it perfectly square based on its height
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
}));
