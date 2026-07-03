import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { observer } from '@legendapp/state/react';
import { appActions, userState$ } from '@/state/store';
import { CURRENCY_OPTIONS } from '@/constants/currency';
import { useUnistyles } from 'react-native-unistyles';
import { SlideContent } from './SlideContent';
import { styles } from './styles';

interface GetStartedSlideProps {
  activeIndex: SharedValue<number>;
}

export const GetStartedSlide = observer(({ activeIndex }: GetStartedSlideProps) => {
  const { theme } = useUnistyles();
  const currentCurrency = userState$.currencyCode.get() || 'USD';

  return (
    <SlideContent index={4} activeIndex={activeIndex}>
      <View style={styles.finalEmoji}>
        <Typography variant="h1" style={styles.emojiTextLarge}>
          🔥
        </Typography>
      </View>

      <Typography variant="h2" style={[styles.slideTitle, { textAlign: 'center' }]}>
        Ready to Build?
      </Typography>
      <Typography variant="body" style={[styles.slideDescription, { textAlign: 'center' }]}>
        Every brick you place today compounds into the life you want tomorrow. No shortcuts, no
        excuses — just raw consistency.
      </Typography>

      <View style={styles.summaryContainer}>
        <BrutalistCard>
          <View style={styles.summaryRow}>
            <Typography variant="bodyBold" style={styles.summaryEmoji}>
              ⚡
            </Typography>
            <Typography variant="body">Set up your daily habits</Typography>
          </View>
        </BrutalistCard>
        <BrutalistCard>
          <View style={styles.summaryRow}>
            <Typography variant="bodyBold" style={styles.summaryEmoji}>
              🪙
            </Typography>
            <Typography variant="body">Create your first savings goal</Typography>
          </View>
        </BrutalistCard>
        <BrutalistCard>
          <View style={styles.summaryRow}>
            <Typography variant="bodyBold" style={styles.summaryEmoji}>
              🧱
            </Typography>
            <Typography variant="body">Add projects to your list</Typography>
          </View>
        </BrutalistCard>
      </View>

      <View style={{ marginTop: 24, width: '100%', alignItems: 'center' }}>
        <Typography variant="bodyBold" style={{ marginBottom: 12 }}>
          SELECT YOUR CURRENCY
        </Typography>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
        >
          {CURRENCY_OPTIONS.map((c) => (
            <Pressable
              key={c.value}
              onPress={() => appActions.updateCurrency(c.value)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderWidth: theme.borderWidth,
                borderColor: theme.colors.border,
                backgroundColor:
                  currentCurrency === c.value ? theme.colors.text : theme.colors.background,
                borderRadius: theme.borderRadius,
                shadowColor: theme.colors.border,
                shadowOffset:
                  currentCurrency === c.value ? { width: 0, height: 0 } : { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 0,
                transform: [
                  { translateY: currentCurrency === c.value ? 2 : 0 },
                  { translateX: currentCurrency === c.value ? 2 : 0 },
                ],
              }}
            >
              <Typography
                variant="bodyBold"
                color={currentCurrency === c.value ? theme.colors.background : theme.colors.text}
              >
                {c.label}
              </Typography>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.motivationBox}>
        <Typography variant="mono" style={styles.motivationText}>
          {"\"DISCIPLINE IS THE BRIDGE BETWEEN\nGOALS AND ACCOMPLISHMENT\""}
        </Typography>
      </View>
    </SlideContent>
  );
});
