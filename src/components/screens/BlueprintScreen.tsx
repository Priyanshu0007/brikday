import React from 'react';
import { View, ScrollView } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { observer } from '@legendapp/state/react';
import { blueprintState$, appActions } from '@/state/store';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';

export const BlueprintScreen = observer(function BlueprintScreen() {
  const projects = blueprintState$.get();
  const { theme } = useUnistyles();

  // Separate active vs decaying projects for a kanban feel
  const activeProjects = projects.filter((p) => !p.neglected);
  const neglectedProjects = projects.filter((p) => p.neglected);

  const ProjectCard = observer(({ projectId }: { projectId: string }) => {
    const project$ = blueprintState$.find((p) => p.id.get() === projectId);
    if (!project$) return null;

    const neglected = project$.neglected.get();
    const category = project$.category.get();
    const title = project$.title.get();

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
            {neglectedProjects.map(p => <ProjectCard key={p.id} projectId={p.id} />)}
          </View>
        )}

        {/* Column 2: Operational */}
        <View style={stylesheet.column}>
          <View style={[stylesheet.columnHeader, { backgroundColor: theme.colors.success }]}>
            <Typography variant="bodyBold" color={theme.colors.background} uppercase>
              ACTIVE PROJECTS ({activeProjects.length})
            </Typography>
          </View>
          {activeProjects.map(p => <ProjectCard key={p.id} projectId={p.id} />)}
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
}));
