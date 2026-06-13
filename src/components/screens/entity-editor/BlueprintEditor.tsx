import React, { useState } from 'react';
import { View } from 'react-native';
import { observer } from '@legendapp/state/react';
import { blueprintState$, appActions } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { styles } from './styles';

export const BlueprintEditor = observer(() => {
  const projects = blueprintState$.get();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const handleEdit = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      setTitle(project.title);
      setCategory(project.category);
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleAdd = () => {
    setTitle('');
    setCategory('');
    setEditingId(null);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (isAdding) {
      appActions.addProject(title, category);
    } else if (editingId) {
      appActions.updateProject(editingId, { title, category });
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const confirmDelete = (id: string) => {
    appActions.deleteProject(id);
    setDeletingId(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <BrutalistButton onPress={handleAdd} backgroundColor={BRUTALIST_THEME.colors.success} style={{ marginBottom: 16 }}>
        + NEW PROJECT
      </BrutalistButton>
      {projects.map((project) => (
        <BrutalistCard key={project.id} backgroundColor="#FFFFFF" style={{ marginBottom: 8 }}>
          <View style={styles.listItemRow}>
            <View style={styles.listItemContent}>
              <Typography variant="bodyBold">{project.title}</Typography>
              <Typography variant="caption" style={{ color: BRUTALIST_THEME.colors.textMuted }}>
                CATEGORY: {project.category}
              </Typography>
            </View>
            <View style={styles.listItemActions}>
              <BrutalistButton onPress={() => handleEdit(project.id)} size="sm" backgroundColor={BRUTALIST_THEME.colors.warning}>
                EDIT
              </BrutalistButton>
              <BrutalistButton onPress={() => setDeletingId(project.id)} size="sm" backgroundColor={BRUTALIST_THEME.colors.danger}>
                DEL
              </BrutalistButton>
            </View>
          </View>
        </BrutalistCard>
      ))}

      <BrutalistBottomSheet
        visible={isAdding || editingId !== null}
        onClose={() => { setEditingId(null); setIsAdding(false); }}
        title={isAdding ? 'NEW PROJECT' : 'EDIT PROJECT'}
      >
        <View style={styles.formContainer}>
          <BrutalistInput
            label="PROJECT TITLE"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. VeloCity App"
          />
          <BrutalistInput
            label="CATEGORY"
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. WORK"
          />
          <BrutalistButton onPress={handleSave} backgroundColor={BRUTALIST_THEME.colors.success} style={{ marginTop: 20 }}>
            SAVE
          </BrutalistButton>
        </View>
      </BrutalistBottomSheet>

      <BrutalistBottomSheet
        visible={deletingId !== null}
        onClose={() => setDeletingId(null)}
        title="CONFIRM DELETION"
      >
        <View style={styles.formContainer}>
          <Typography variant="body" style={{ marginBottom: 20 }}>
            Are you sure you want to delete this project?
          </Typography>
          <View style={styles.formActions}>
            <BrutalistButton onPress={() => setDeletingId(null)} backgroundColor={BRUTALIST_THEME.colors.paper} style={{ flex: 1 }}>
              CANCEL
            </BrutalistButton>
            <BrutalistButton onPress={() => deletingId && confirmDelete(deletingId)} backgroundColor={BRUTALIST_THEME.colors.danger} style={{ flex: 1 }}>
              DELETE
            </BrutalistButton>
          </View>
        </View>
      </BrutalistBottomSheet>
    </View>
  );
});
