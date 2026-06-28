import { useLocalSearchParams } from 'expo-router';
import { GoalDetailScreen } from '@/components/screens/vault/GoalDetailScreen';

export default function GoalDetailRoute() {
  const { id } = useLocalSearchParams();
  const goalId = Array.isArray(id) ? id[0] : id;

  if (!goalId) return null;

  return <GoalDetailScreen goalId={goalId} />;
}
