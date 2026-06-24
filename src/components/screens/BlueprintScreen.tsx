import { appActions, blueprintState$ } from '@/state/store';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { triggerHaptic } from '@/ui/haptics';
import { Typography } from '@/ui/Typography';
import { observer } from '@legendapp/state/react';
import { PressableScale } from 'pressto';
import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const MilestoneItem = ({ m, projectId, neglected, theme }: any) => {
  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(m.completed ? 1 : 0, { duration: 300 }) }],
    opacity: withTiming(m.completed ? 1 : 0, { duration: 300 }),
  }), [m.completed]);

  const animatedTextOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(m.completed ? 0.4 : 1, { duration: 300 }),
  }), [m.completed]);

  return (
    <View style={stylesheet.milestoneItemContainer}>
      <PressableScale
        onPress={() => {
          triggerHaptic('light');
          appActions.toggleMilestone(projectId, m.id);
        }}
        style={stylesheet.milestoneToggle}
      >
        <View style={[stylesheet.checkbox, m.completed && stylesheet.checkboxChecked]}>
          <Animated.View style={[stylesheet.checkboxInner, animatedScale]} />
        </View>
      </PressableScale>

      <Animated.View style={[{ flex: 1 }, animatedTextOpacity]}>
        <TextInput
          value={m.title}
          onChangeText={(text) => appActions.editMilestone(projectId, m.id, text)}
          style={[
            stylesheet.milestoneInput,
            m.completed && { textDecorationLine: 'line-through' },
            { color: neglected ? '#FFFFFF' : theme.colors.text }
          ]}
          editable={!m.completed}
          placeholderTextColor={theme.colors.textMuted}
        />
      </Animated.View>

      <PressableScale
        onPress={() => {
          triggerHaptic('heavy');
          appActions.deleteMilestone(projectId, m.id);
        }}
        style={stylesheet.deleteMilestoneButton}
      >
        <Typography variant="mono" style={{ color: theme.colors.danger, fontSize: 14 }}>
          ✕
        </Typography>
      </PressableScale>
    </View>
  );
};

const ProjectCard = observer(({ projectId, theme }: { projectId: string; theme: any }) => {
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const project$ = blueprintState$.find((p) => p.id.get() === projectId);
  if (!project$) return null;

  const neglected = project$.neglected.get();
  const category = project$.category.get();
  const title = project$.title.get();
  const rawMilestones = project$.milestones?.get() || [];
  const milestones = rawMilestones.filter((m: any) => m !== null && m !== undefined);

  const completedCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;

  const handleToggleMilestone = (milestoneId: string) => {
    triggerHaptic('light');
    appActions.toggleMilestone(projectId, milestoneId);
  };

  const handleAddMilestone = () => {
    if (newMilestoneTitle.trim()) {
      triggerHaptic('success');
      appActions.addMilestone(projectId, newMilestoneTitle);
      setNewMilestoneTitle('');
    }
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    triggerHaptic('heavy');
    appActions.deleteMilestone(projectId, milestoneId);
  };

  const handleEditMilestone = (milestoneId: string, newTitle: string) => {
    appActions.editMilestone(projectId, milestoneId, newTitle);
  };

  const progressPercent = totalCount === 0 ? 0 : completedCount / totalCount;
  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progressPercent * 100}%`, { duration: 500 }),
    };
  }, [progressPercent]);

  return (
    <BrutalistCard
      neglected={neglected}
      backgroundColor={theme.colors.background}
      style={stylesheet.cardSpacing}
    >
      <View style={stylesheet.cardHeader}>
        <Typography
          variant="mono"
          style={stylesheet.categoryBadge}
          color={neglected ? '#FFFFFF' : theme.colors.textMuted}
        >
          {category}
        </Typography>

        <Typography
          variant="mono"
          style={[stylesheet.statusIndicator, neglected && stylesheet.decayText]}
          color={neglected ? '#FFFFFF' : theme.colors.text}
        >
          {neglected ? '● IGNORED' : '● ACTIVE'}
        </Typography>
      </View>

      <Typography
        variant="h3"
        color={neglected ? '#FFFFFF' : theme.colors.text}
        style={stylesheet.projectTitle}
      >
        {title}
      </Typography>

      {/* Milestones Progress */}
      {totalCount > 0 && (
        <View style={stylesheet.progressContainer}>
          <View style={stylesheet.progressLineWrapper}>
            <Animated.View
              style={[
                stylesheet.progressLineFill,
                animatedProgressStyle,
                { backgroundColor: theme.colors.success }
              ]}
            />
          </View>
          <Typography variant="mono" style={stylesheet.progressText}>
            {completedCount}/{totalCount} MILESTONES SECURED
          </Typography>

          <View style={stylesheet.milestonesList}>
            {milestones.map((m) => (
              <MilestoneItem key={m.id} m={m} projectId={projectId} neglected={neglected} theme={theme} />
            ))}
          </View>
        </View>
      )}

      {/* Add Milestone Input */}
      <View style={stylesheet.addMilestoneContainer}>
        <BrutalistInput
          placeholder="+ NEW MILESTONE"
          value={newMilestoneTitle}
          onChangeText={setNewMilestoneTitle}
          onSubmitEditing={handleAddMilestone}
          returnKeyType="done"
          style={stylesheet.addMilestoneInput}
          placeholderTextColor={theme.colors.textMuted}
        />
      </View>

      {neglected ? (
        <Typography variant="caption" style={{ color: '#FFD2D2', marginBottom: 12 }}>
          ⚠️ You haven't worked on this recently.
        </Typography>
      ) : (
        <Typography variant="caption" style={{ color: theme.colors.textMuted, marginBottom: 12 }}>
          ✓ Doing great. Keep it up!
        </Typography>
      )}

      {/* Accountability trigger toggle button */}
      <BrutalistButton
        onPress={() => appActions.toggleProjectNeglect(projectId)}
        backgroundColor={neglected ? theme.colors.success : theme.colors.danger}
        size="sm"
      >
        {neglected ? 'WORK ON IT' : 'IGNORE PROJECT'}
      </BrutalistButton>
    </BrutalistCard>
  );
});

export const BlueprintScreen = observer(function BlueprintScreen() {
  const projects = blueprintState$.get();
  const { theme } = useUnistyles();

  // Separate active vs decaying projects for a kanban feel
  const activeProjects = projects.filter((p) => !p.neglected);
  const neglectedProjects = projects.filter((p) => p.neglected);



  return (
    <ScrollView style={stylesheet.container} contentContainerStyle={stylesheet.scrollContent}>
      {/* Title */}
      <View style={stylesheet.header}>
        <Typography variant="h2" uppercase>
          PROJECTS
        </Typography>
        <Typography variant="mono" style={stylesheet.subtitle}>
          YOUR PROJECTS AND TASKS
        </Typography>
      </View>

      {/* Kanban Layout columns */}
      <View style={stylesheet.kanbanLayout}>
        {/* Column 1: Neglected / Decaying */}
        {neglectedProjects.length > 0 && (
          <View style={stylesheet.column}>
            <View style={[stylesheet.columnHeader, { backgroundColor: theme.colors.danger }]}>
              <Typography variant="bodyBold" color="#FFFFFF" uppercase>
                IGNORED PROJECTS ({neglectedProjects.length})
              </Typography>
            </View>
            {neglectedProjects.map(p => <ProjectCard key={p.id} projectId={p.id} theme={theme} />)}
          </View>
        )}

        {/* Column 2: Operational */}
        <View style={stylesheet.column}>
          <View style={[stylesheet.columnHeader, { backgroundColor: theme.colors.success }]}>
            <Typography variant="bodyBold" color={theme.colors.background} uppercase>
              ACTIVE PROJECTS ({activeProjects.length})
            </Typography>
          </View>
          {activeProjects.map(p => <ProjectCard key={p.id} projectId={p.id} theme={theme} />)}
        </View>
      </View>
    </ScrollView>
  );
});

const stylesheet = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120, // Clear bottom tab bar
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  kanbanLayout: {
    gap: 20,
  },
  column: {
    width: '100%',
  },
  columnHeader: {
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  cardSpacing: {
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusIndicator: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  decayText: {
    fontWeight: '900',
  },
  projectTitle: {
    fontSize: 18,
    marginBottom: 6,
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressLineWrapper: {
    height: 12,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressLineFill: {
    height: '100%',
    borderRightWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  progressText: {
    fontSize: 10,
    marginBottom: 12,
    color: theme.colors.textMuted,
  },
  milestonesList: {
    gap: 8,
  },
  milestoneItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milestoneToggle: {
    padding: 2,
  },
  milestoneInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    padding: 0, // Reset default padding
  },
  deleteMilestoneButton: {
    padding: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.success,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: theme.colors.border,
  },
  milestoneCompletedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  addMilestoneContainer: {
    marginBottom: 16,
  },
  addMilestoneInput: {
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
}));
