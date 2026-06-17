import React, { useState, useRef } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { observer } from '@legendapp/state/react';
import PagerView from 'react-native-pager-view';
import { useUnistyles } from 'react-native-unistyles';
import { Typography } from '@/ui/Typography';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { EngineEditor } from './EngineEditor';
import { VaultEditor } from './VaultEditor';
import { BlueprintEditor } from './BlueprintEditor';
import { stylesheet } from './styles';

export const EntityEditorScreen = observer(() => {
  const { theme } = useUnistyles();
  const [activeTab, setActiveTab] = useState<'engine' | 'vault' | 'blueprint'>('engine');
  const pagerRef = useRef<PagerView>(null);
  const tabs = ['engine', 'vault', 'blueprint'] as const;
  const tabLabels: Record<typeof tabs[number], string> = {
    engine: 'HABITS',
    vault: 'SAVINGS',
    blueprint: 'PROJECTS',
  };

  const handleTabPress = (tab: typeof tabs[number], index: number) => {
    setActiveTab(tab);
    pagerRef.current?.setPage(index);
  };

  return (
    <SafeAreaView style={stylesheet.modalContainer} edges={['top', 'bottom']}>
      <View style={stylesheet.header}>
        <Typography variant="h2">YOUR DATA</Typography>
        <BrutalistButton onPress={() => router.back()} size="sm" backgroundColor={theme.colors.danger}>
          CLOSE
        </BrutalistButton>
      </View>

      <View style={stylesheet.tabsContainer}>
        {tabs.map((tab, index) => (
          <Pressable
            key={tab}
            style={[stylesheet.tab, activeTab === tab && stylesheet.tabActive]}
            onPress={() => handleTabPress(tab, index)}
          >
            <Typography variant="bodyBold" style={[stylesheet.tabText, activeTab === tab && stylesheet.tabTextActive]}>
              {tabLabels[tab]}
            </Typography>
          </Pressable>
        ))}
      </View>

      <PagerView
        style={stylesheet.content}
        initialPage={0}
        ref={pagerRef}
        scrollEnabled={false}
        onPageSelected={(e) => setActiveTab(tabs[e.nativeEvent.position])}
      >
        <View key="engine" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={stylesheet.scrollContent}>
            <EngineEditor />
          </ScrollView>
        </View>
        <View key="vault" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={stylesheet.scrollContent}>
            <VaultEditor />
          </ScrollView>
        </View>
        <View key="blueprint" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={stylesheet.scrollContent}>
            <BlueprintEditor />
          </ScrollView>
        </View>
      </PagerView>
    </SafeAreaView>
  );
});
