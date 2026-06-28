import React from 'react';
import { View } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { observer } from '@legendapp/state/react';
import { userState$ } from '@/state/store';
import { getCurrencySymbol } from '@/constants/currency';
import { SlideContent } from './SlideContent';
import { styles } from './styles';
import { useUnistyles } from 'react-native-unistyles';

interface VaultSlideProps {
  activeIndex: SharedValue<number>;
}

export const VaultSlide = observer(({ activeIndex }: VaultSlideProps) => {
  const { theme } = useUnistyles();
  const currencyCode = userState$.currencyCode.get() || 'USD';
  const currencySymbol = getCurrencySymbol(currencyCode);

  return (
    <SlideContent index={2} activeIndex={activeIndex}>
        <View style={[styles.pillBadge, { backgroundColor: '#FEF3C7' }]}>
          <Typography variant="mono" style={styles.pillText}>🪙 SAVINGS</Typography>
        </View>

        <Typography variant="h2" style={styles.slideTitle}>
          Save First, Buy Later
        </Typography>
        <Typography variant="body" style={styles.slideDescription}>
          Want something expensive? Create a savings goal. Log each deposit with its source. When you hit 100%, buy it outright. No EMIs, no debt, full ownership.
        </Typography>

        {/* Visual Preview */}
        <View style={styles.previewContainer}>
          <BrutalistCard>
            <Typography variant="bodyBold">M3 MACBOOK PRO</Typography>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '60%', backgroundColor: theme.colors.warning }]} />
            </View>
            <View style={styles.progressRow}>
              <Typography variant="caption">{currencySymbol}2,100 saved</Typography>
              <Typography variant="caption" style={styles.progressRight}>{currencySymbol}3,500 goal</Typography>
            </View>
          </BrutalistCard>

          <BrutalistCard accentColor={theme.colors.success}>
            <Typography variant="bodyBold">IPAD PRO OLED</Typography>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '100%', backgroundColor: theme.colors.success }]} />
            </View>
            <View style={styles.progressRow}>
              <Typography variant="caption">{currencySymbol}1,500 saved</Typography>
              <Typography variant="caption" style={styles.progressRight}>✅ READY TO BUY</Typography>
            </View>
          </BrutalistCard>
        </View>

        <View style={styles.tipBox}>
          <Typography variant="mono" style={styles.tipText}>
            TIP: Tap "+ Add Money" to add savings
          </Typography>
        </View>
      </SlideContent>
  );
});
