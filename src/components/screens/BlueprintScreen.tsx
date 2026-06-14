import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { observer } from '@legendapp/state/react';
import { blueprintState$, appActions } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';

export const BlueprintScreen = observer(function BlueprintScreen() {
  const projects = blueprintState$.get();

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
      backgroundColor="#FFFFFF"
      style={styles.cardSpacing}
    >
      <View style={styles.cardHeader}>
        <Typography
          variant="mono"
          style={styles.categoryBadge}
          color={neglected ? '#FFFFFF' : BRUTALIST_THEME.colors.textMuted}
        >
          {category}
        </Typography>
        
        <Typography
          variant="mono"
          style={[styles.statusIndicator, neglected && styles.decayText]}
          color={neglected ? '#FFFFFF' : BRUTALIST_THEME.colors.text}
        >
          {neglected ? '● IGNORED' : '● ACTIVE'}
        </Typography>
      </View>

      <Typography
        variant="h3"
        color={neglected ? '#FFFFFF' : BRUTALIST_THEME.colors.text}
        style={styles.projectTitle}
      >
        {title}
      </Typography>

      {neglected ? (
        <Typography variant="caption" style={{ color: '#FFD2D2', marginBottom: 12 }}>
          ⚠️ You haven't worked on this recently.
        </Typography>
      ) : (
        <Typography variant="caption" style={{ color: BRUTALIST_THEME.colors.textMuted, marginBottom: 12 }}>
          ✓ Doing great. Keep it up!
        </Typography>
      )}

      {/* Accountability trigger toggle button */}
      <BrutalistButton
        onPress={() => appActions.toggleProjectNeglect(projectId)}
        backgroundColor={neglected ? BRUTALIST_THEME.colors.success : BRUTALIST_THEME.colors.danger}
        size="sm"
      >
        {neglected ? 'WORK ON IT' : 'IGNORE PROJECT'}
      </BrutalistButton>
    </BrutalistCard>
  );
});

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Title */}
      <View style={styles.header}>
        <Typography variant="h2" uppercase>
          PROJECTS
        </Typography>
        <Typography variant="mono" style={styles.subtitle}>
          YOUR PROJECTS AND TASKS
        </Typography>
      </View>

      {/* Kanban Layout columns */}
      <View style={styles.kanbanLayout}>
        {/* Column 1: Neglected / Decaying */}
        {neglectedProjects.length > 0 && (
          <View style={styles.column}>
            <View style={[styles.columnHeader, { backgroundColor: BRUTALIST_THEME.colors.danger }]}>
              <Typography variant="bodyBold" color="#FFFFFF" uppercase>
                IGNORED PROJECTS ({neglectedProjects.length})
              </Typography>
            </View>
            {neglectedProjects.map(p => <ProjectCard key={p.id} projectId={p.id} />)}
          </View>
        )}

        {/* Column 2: Operational */}
        <View style={styles.column}>
          <View style={[styles.columnHeader, { backgroundColor: BRUTALIST_THEME.colors.success }]}>
            <Typography variant="bodyBold" color="#000000" uppercase>
              ACTIVE PROJECTS ({activeProjects.length})
            </Typography>
          </View>
          {activeProjects.map(p => <ProjectCard key={p.id} projectId={p.id} />)}
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: BRUTALIST_THEME.colors.textMuted,
    marginTop: 4,
  },
  kanbanLayout: {
    gap: 20,
  },
  column: {
    width: '100%',
  },
  columnHeader: {
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
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
});
