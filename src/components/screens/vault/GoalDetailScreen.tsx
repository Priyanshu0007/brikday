import React, { useState, useRef } from 'react';
import { View, ScrollView, Alert, Pressable, Text } from 'react-native';
import { observer } from '@legendapp/state/react';
import { useUnistyles } from 'react-native-unistyles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appActions, vaultState$, userState$ } from '@/state/store';
import { getCurrencySymbol } from '@/constants/currency';
import { Typography } from '@/ui/Typography';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { GoalHistoryList } from './GoalHistoryList';
import { VaultSimulator } from './VaultSimulator';
import { stylesheet } from './styles';
import { PressableScale } from 'pressto';
import PagerView from 'react-native-pager-view';

export const GoalDetailScreen = observer(({ goalId }: { goalId: string }) => {
  const { theme } = useUnistyles();
  const goal$ = vaultState$.find((g) => g.id.get() === goalId);

  const pagerRef = useRef<PagerView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [addSavingVisible, setAddSavingVisible] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [sourceInput, setSourceInput] = useState('');
  const [commentInput, setCommentInput] = useState('');

  if (!goal$) return null;

  const saved = goal$.saved.get();
  const target = goal$.target.get();
  const title = goal$.title.get();

  const progress = target > 0 ? saved / target : 0;
  const percentage = Math.round(progress * 100);

  const currencyCode = userState$.currencyCode.get() || 'USD';
  const currencySymbol = getCurrencySymbol(currencyCode);

  const handleSaveTransactionSubmit = () => {
    const parsedAmount = parseFloat(amountInput);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive savings amount.');
      return;
    }
    appActions.addSavingTransaction(
      goalId,
      parsedAmount,
      sourceInput || 'Manual Savings',
      commentInput || '',
    );
    setAddSavingVisible(false);
    setAmountInput('');
    setSourceInput('');
    setCommentInput('');
  };

  return (
    <SafeAreaView style={stylesheet.detailContainer} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={stylesheet.detailHeader}>
        <PressableScale
          onPress={() => router.back()}
          style={stylesheet.backButton}
          activeScale={0.9}
        >
          <Typography variant="bodyBold">◀ BACK</Typography>
        </PressableScale>
        <Typography variant="h3" uppercase style={stylesheet.detailTitle} numberOfLines={2}>
          {title}
        </Typography>
      </View>

      {/* Progress Section */}
      <View style={stylesheet.detailProgressContainer}>
        <View style={stylesheet.sliderHeader}>
          <Typography variant="h2">{percentage}%</Typography>
          <Typography variant="mono" style={stylesheet.savedCaption}>
            <Text style={{ fontFamily: theme.fonts.body }}>{currencySymbol}</Text>
            {saved.toLocaleString()} /{' '}
            <Text style={{ fontFamily: theme.fonts.body }}>{currencySymbol}</Text>
            {target.toLocaleString()} SAVED
          </Typography>
        </View>
        <View style={stylesheet.staticTrackContainer}>
          <View style={stylesheet.track}>
            <View style={[stylesheet.progressFill, { width: `${Math.min(percentage, 100)}%` }]} />
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={stylesheet.detailTabBar}>
        {['HISTORY', 'SIMULATE'].map((tab, idx) => (
          <Pressable
            key={tab}
            onPress={() => {
              setActiveIndex(idx);
              pagerRef.current?.setPage(idx);
            }}
            style={[stylesheet.detailTab, activeIndex === idx && stylesheet.detailTabActive]}
          >
            <Typography
              variant="mono"
              style={
                activeIndex === idx ? stylesheet.detailTabTextActive : stylesheet.detailTabText
              }
            >
              {tab}
            </Typography>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
      >
        <View key="0" style={stylesheet.detailContent}>
          <GoalHistoryList goalId={goalId} />
        </View>
        <View key="1" style={stylesheet.detailContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <VaultSimulator goalId={goalId} />
          </ScrollView>
        </View>
      </PagerView>

      {/* Sticky Footer */}
      <View style={stylesheet.stickyFooter}>
        <BrutalistButton
          onPress={() => setAddSavingVisible(true)}
          backgroundColor={theme.colors.success}
          size="lg"
        >
          <Typography variant="h3">+ ADD MONEY</Typography>
        </BrutalistButton>
      </View>

      {/* Add Money Bottom Sheet */}
      <BrutalistBottomSheet
        visible={addSavingVisible}
        onClose={() => setAddSavingVisible(false)}
        title={`SAVE FOR ${title.toUpperCase()}`}
      >
        <ScrollView
          contentContainerStyle={stylesheet.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <BrutalistInput
            label={`Amount (${currencySymbol})`}
            placeholder="e.g. 500"
            keyboardType="numeric"
            value={amountInput}
            onChangeText={setAmountInput}
          />
          <BrutalistInput
            label="Saved From"
            placeholder="e.g. Freelance project, Salary bonus"
            value={sourceInput}
            onChangeText={setSourceInput}
          />
          <BrutalistInput
            label="Comments"
            placeholder="Any additional notes"
            value={commentInput}
            onChangeText={setCommentInput}
          />

          <BrutalistButton
            onPress={handleSaveTransactionSubmit}
            backgroundColor={theme.colors.success}
            style={stylesheet.submitBtn}
          >
            SAVE MONEY
          </BrutalistButton>
        </ScrollView>
      </BrutalistBottomSheet>
    </SafeAreaView>
  );
});
