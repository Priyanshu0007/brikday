import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { observer } from '@legendapp/state/react';
import { appState$, appActions, Project } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';

export const BlueprintScreen = observer(function BlueprintScreen() {
  const projects = appState$.blueprintProjects.get();

  // Separate active vs decaying projects for a kanban feel
  const activeProjects = projects.filter((p) => !p.neglected);
  const neglectedProjects = projects.filter((p) => p.neglected);

  const renderProjectCard = (project: Project) => {
    return (
      <BrutalistCard
        key={project.id}
        neglected={project.neglected}
        backgroundColor="#FFFFFF"
        style={styles.cardSpacing}
      >
        <View style={styles.cardHeader}>
          <Typography
            variant="mono"
            style={styles.categoryBadge}
            color={project.neglected ? '#FFFFFF' : BRUTALIST_THEME.colors.textMuted}
          >
            {project.category}
          </Typography>
          
          <Typography
            variant="mono"
            style={[styles.statusIndicator, project.neglected && styles.decayText]}
            color={project.neglected ? '#FFFFFF' : BRUTALIST_THEME.colors.text}
          >
            {project.neglected ? '● DECAYING' : '● OPERATIONAL'}
          </Typography>
        </View>

        <Typography
          variant="h3"
          color={project.neglected ? '#FFFFFF' : BRUTALIST_THEME.colors.text}
          style={styles.projectTitle}
        >
          {project.title}
        </Typography>

        {project.neglected ? (
          <Typography variant="caption" style={{ color: '#FFD2D2', marginBottom: 12 }}>
            🚨 WARNING: Neglected project. Decay status has increased shadow size and converted theme colors.
          </Typography>
        ) : (
          <Typography variant="caption" style={{ color: BRUTALIST_THEME.colors.textMuted, marginBottom: 12 }}>
            ✓ Consistent commits registered. Structure is holding.
          </Typography>
        )}

        {/* Accountability trigger toggle button */}
        <BrutalistButton
          onPress={() => appActions.toggleProjectNeglect(project.id)}
          backgroundColor={project.neglected ? BRUTALIST_THEME.colors.success : BRUTALIST_THEME.colors.danger}
          size="sm"
        >
          {project.neglected ? 'EXECUTE & RESTORE' : 'NEGLECT PROJECT'}
        </BrutalistButton>
      </BrutalistCard>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Title */}
      <View style={styles.header}>
        <Typography variant="h2" uppercase>
          THE BLUEPRINT
        </Typography>
        <Typography variant="mono" style={styles.subtitle}>
          CIRCLE // PROJECTS VISUAL DEGRADATION STATUS
        </Typography>
      </View>

      {/* Kanban Layout columns */}
      <View style={styles.kanbanLayout}>
        {/* Column 1: Neglected / Decaying */}
        {neglectedProjects.length > 0 && (
          <View style={styles.column}>
            <View style={[styles.columnHeader, { backgroundColor: BRUTALIST_THEME.colors.danger }]}>
              <Typography variant="bodyBold" color="#FFFFFF" uppercase>
                DECAYING SECTOR ({neglectedProjects.length})
              </Typography>
            </View>
            {neglectedProjects.map(renderProjectCard)}
          </View>
        )}

        {/* Column 2: Operational */}
        <View style={styles.column}>
          <View style={[styles.columnHeader, { backgroundColor: BRUTALIST_THEME.colors.success }]}>
            <Typography variant="bodyBold" color="#000000" uppercase>
              OPERATIONAL SECTOR ({activeProjects.length})
            </Typography>
          </View>
          {activeProjects.map(renderProjectCard)}
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
