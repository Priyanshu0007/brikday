import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { observer } from '@legendapp/state/react';
import { blueprintState$, appActions } from '@/state/store';
import { useUnistyles } from 'react-native-unistyles';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { stylesheet } from './styles';

export const BlueprintEditor = observer(() => {
  const { theme } = useUnistyles();
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
      <BrutalistButton
        onPress={handleAdd}
        backgroundColor={theme.colors.success}
        style={{ marginBottom: 16 }}
      >
        + NEW PROJECT
      </BrutalistButton>
      {projects.map((project) => (
        <Swipeable
          key={project.id}
          containerStyle={{ marginBottom: 8 }}
          renderRightActions={() => (
            <View style={stylesheet.swipeActionContainer}>
              <TouchableOpacity
                style={[stylesheet.swipeActionButton, { backgroundColor: theme.colors.warning }]}
                onPress={() => handleEdit(project.id)}
              >
                <Typography variant="caption" style={{ color: theme.colors.background, fontWeight: 'bold' }}>
                  EDIT
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[stylesheet.swipeActionButton, { backgroundColor: theme.colors.danger }]}
                onPress={() => setDeletingId(project.id)}
              >
                <Typography variant="caption" style={{ color: theme.colors.background, fontWeight: 'bold' }}>
                  DEL
                </Typography>
              </TouchableOpacity>
            </View>
          )}
        >
          <BrutalistCard
            backgroundColor={theme.colors.background}
            style={{ marginVertical: 0 }}
          >
            <View style={stylesheet.listItemRow}>
              <View style={stylesheet.listItemContent}>
                <Typography variant="bodyBold">{project.title}</Typography>
                <Typography variant="caption" style={{ color: theme.colors.textMuted }}>
                  CATEGORY: {project.category}
                </Typography>
              </View>
            </View>
          </BrutalistCard>
        </Swipeable>
      ))}

      <BrutalistBottomSheet
        visible={isAdding || editingId !== null}
        onClose={() => {
          setEditingId(null);
          setIsAdding(false);
        }}
        title={isAdding ? 'NEW PROJECT' : 'EDIT PROJECT'}
      >
        <View style={stylesheet.formContainer}>
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
          <BrutalistButton
            onPress={handleSave}
            backgroundColor={theme.colors.success}
            style={{ marginTop: 20 }}
          >
            SAVE
          </BrutalistButton>
        </View>
      </BrutalistBottomSheet>

      <BrutalistBottomSheet
        visible={deletingId !== null}
        onClose={() => setDeletingId(null)}
        title="CONFIRM DELETION"
      >
        <View style={stylesheet.formContainer}>
          <Typography variant="body" style={{ marginBottom: 20 }}>
            Are you sure you want to delete this project?
          </Typography>
          <View style={stylesheet.formActions}>
            <BrutalistButton
              onPress={() => setDeletingId(null)}
              backgroundColor={theme.colors.paper}
              style={{ flex: 1 }}
            >
              CANCEL
            </BrutalistButton>
            <BrutalistButton
              onPress={() => deletingId && confirmDelete(deletingId)}
              backgroundColor={theme.colors.danger}
              style={{ flex: 1 }}
            >
              DELETE
            </BrutalistButton>
          </View>
        </View>
      </BrutalistBottomSheet>
    </View>
  );
});
