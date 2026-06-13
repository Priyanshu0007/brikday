import React, { useState, useRef } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { observer } from '@legendapp/state/react';
import PagerView from 'react-native-pager-view';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { EngineEditor } from './EngineEditor';
import { VaultEditor } from './VaultEditor';
import { BlueprintEditor } from './BlueprintEditor';
import { styles } from './styles';

export const EntityEditorScreen = observer(() => {
  const [activeTab, setActiveTab] = useState<'engine' | 'vault' | 'blueprint'>('engine');
  const pagerRef = useRef<PagerView>(null);
  const tabs = ['engine', 'vault', 'blueprint'] as const;

  const handleTabPress = (tab: typeof tabs[number], index: number) => {
    setActiveTab(tab);
    pagerRef.current?.setPage(index);
  };

  return (
    <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Typography variant="h2">DATABASE EDITOR</Typography>
        <BrutalistButton onPress={() => router.back()} size="sm" backgroundColor={BRUTALIST_THEME.colors.danger}>
          CLOSE
        </BrutalistButton>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => handleTabPress(tab, index)}
          >
            <Typography variant="bodyBold" style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.toUpperCase()}
            </Typography>
          </Pressable>
        ))}
      </View>

      <PagerView
        style={styles.content}
        initialPage={0}
        ref={pagerRef}
        scrollEnabled={false}
        onPageSelected={(e) => setActiveTab(tabs[e.nativeEvent.position])}
      >
        <View key="engine" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <EngineEditor />
          </ScrollView>
        </View>
        <View key="vault" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <VaultEditor />
          </ScrollView>
        </View>
        <View key="blueprint" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <BlueprintEditor />
          </ScrollView>
        </View>
      </PagerView>
    </SafeAreaView>
  );
});
