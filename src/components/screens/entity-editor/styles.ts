import { StyleSheet } from 'react-native';
import { BRUTALIST_THEME } from '@/ui/theme';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: BRUTALIST_THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: BRUTALIST_THEME.colors.border,
    backgroundColor: BRUTALIST_THEME.colors.paper,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRightWidth: 2,
    borderRightColor: BRUTALIST_THEME.colors.border,
  },
  tabActive: {
    backgroundColor: '#000000',
  },
  tabText: {
    color: '#000000',
  },
  tabTextActive: {
    color: '#FFFFFF',
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
    borderColor: '#000000',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  dayButtonSelected: {
    backgroundColor: '#000000',
  },
  dayText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
});
