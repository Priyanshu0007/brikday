import React, { useState, useMemo, useEffect } from 'react';
import { View, LayoutChangeEvent, Text } from 'react-native';
import { observer } from '@legendapp/state/react';
import { useUnistyles } from 'react-native-unistyles';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { vaultState$, userState$ } from '@/state/store';
import { getCurrencySymbol } from '@/constants/currency';
import { Typography } from '@/ui/Typography';
import { stylesheet } from './styles';

interface VaultSimulatorProps {
  goalId: string | null;
}

const AnimatedBar = ({ heightPercent, isFuture }: { heightPercent: number; isFuture: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(`${heightPercent}%`, { duration: 300 }),
  }));

  return (
    <View style={stylesheet.chartBarWrapper}>
      <Animated.View
        style={[stylesheet.chartBar, animatedStyle, isFuture && stylesheet.chartBarFuture]}
      />
    </View>
  );
};

const CustomSlider = ({
  min,
  max,
  value,
  onChange,
  label,
  prefix = '',
  suffix = '',
}: {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  label: string;
  prefix?: string;
  suffix?: string;
}) => {
  const { theme } = useUnistyles();
  const [trackWidth, setTrackWidth] = useState(0);
  const thumbSize = 40;

  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (!isDragging.value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (trackWidth > 0 && !isDragging.value) {
      const percentage = (value - min) / (max - min);
      translateX.value = percentage * (trackWidth - thumbSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, min, max, trackWidth, translateX, isDragging.value]);

  const updateInternalValue = (pos: number) => {
    const percentage = Math.max(0, Math.min(1, pos / (trackWidth - thumbSize)));
    const newValue = min + percentage * (max - min);
    setInternalValue(Math.round(newValue));
  };

  const commitValue = (pos: number) => {
    const percentage = Math.max(0, Math.min(1, pos / (trackWidth - thumbSize)));
    const newValue = min + percentage * (max - min);
    onChange(Math.round(newValue));
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onBegin(() => {
      // eslint-disable-next-line react-hooks/immutability
      isDragging.value = true;
    })
    .onChange((event) => {
      const newX = translateX.value + event.changeX;
      // eslint-disable-next-line react-hooks/immutability
      translateX.value = Math.max(0, Math.min(newX, trackWidth - thumbSize));
      runOnJS(updateInternalValue)(translateX.value);
    })
    .onFinalize(() => {
      // eslint-disable-next-line react-hooks/immutability
      isDragging.value = false;
      runOnJS(commitValue)(translateX.value);
    });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={stylesheet.sliderGroup}>
      <View style={stylesheet.sliderLabelRow}>
        <Typography variant="bodyBold">{label}</Typography>
        <Typography variant="mono" style={stylesheet.sliderValueBadge}>
          {prefix ? <Text style={{ fontFamily: theme.fonts.body }}>{prefix}</Text> : null}
          {internalValue}
          {suffix}
        </Typography>
      </View>
      <View style={stylesheet.customSliderTrack} onLayout={handleTrackLayout}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[stylesheet.customSliderThumb, animatedThumbStyle]} />
        </GestureDetector>
      </View>
    </View>
  );
};

export const VaultSimulator = observer(({ goalId }: VaultSimulatorProps) => {
  const goal$ = vaultState$.find((g) => g.id.get() === goalId);

  const currencyCode = userState$.currencyCode.get() || 'USD';
  const currencySymbol = getCurrencySymbol(currencyCode);

  const [weeklySavings, setWeeklySavings] = useState(50);
  const [interestRate, setInterestRate] = useState(5);

  const saved = goal$?.saved?.get() ?? 0;
  const target = goal$?.target?.get() ?? 0;
  const remaining = Math.max(0, target - saved);

  const calculatedMath = useMemo(() => {
    if (remaining === 0) return { weeks: 0, date: new Date(), chartData: [] };
    if (weeklySavings === 0) return { weeks: Infinity, date: null, chartData: [] };

    let n = 0;
    const r = interestRate / 100 / 52;

    if (r === 0) {
      n = remaining / weeklySavings;
    } else {
      const A = remaining;
      const P = weeklySavings;
      const numerator = Math.log((A * r) / P + 1);
      const denominator = Math.log(1 + r);
      n = numerator / denominator;
    }

    const weeks = Math.ceil(n);
    const date = new Date();
    date.setDate(date.getDate() + weeks * 7);

    const chartBars = weeks === Infinity ? 12 : Math.min(12, weeks + 1);
    const data = [];
    const stepWeeks =
      weeks === Infinity ? 4 : Math.max(1, Math.floor(weeks / Math.max(1, chartBars - 1)));

    for (let i = 0; i < chartBars; i++) {
      const currentWeeks = i * stepWeeks;
      let fv = 0;
      if (r === 0) {
        fv = saved + weeklySavings * currentWeeks;
      } else {
        const compoundedSaved = saved * Math.pow(1 + r, currentWeeks);
        const annuity = weeklySavings * ((Math.pow(1 + r, currentWeeks) - 1) / r);
        fv = compoundedSaved + annuity;
      }
      data.push(Math.min(fv, target));
    }

    return { weeks, date, chartData: data };
  }, [remaining, saved, target, weeklySavings, interestRate]);

  const formatDate = (d: Date | null) => {
    if (!d) return 'NEVER';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  if (!goal$ || !goalId) return null;

  return (
    <View style={stylesheet.simulatorContent}>
      {/* Projection Display */}
      <View style={stylesheet.projectionContainer}>
        <Typography variant="mono" style={stylesheet.projectionDate}>
          {formatDate(calculatedMath.date)}
        </Typography>
        <Typography variant="bodyBold" style={stylesheet.projectionWeeks}>
          IN {calculatedMath.weeks === Infinity ? '∞' : calculatedMath.weeks} WEEKS
        </Typography>

        {/* Dynamic Chart */}
        <View style={stylesheet.chartContainer}>
          <View style={stylesheet.chartTargetLine} />
          <Typography variant="mono" style={stylesheet.chartTargetText}>
            TARGET
          </Typography>

          {calculatedMath.chartData.map((val, index) => {
            const heightPercent = target > 0 ? (val / target) * 100 : 0;
            const isFuture = val > saved;
            return <AnimatedBar key={index} heightPercent={heightPercent} isFuture={isFuture} />;
          })}
        </View>
      </View>

      {/* Sliders */}
      <CustomSlider
        label="WEEKLY SAVINGS"
        min={0}
        max={1000}
        value={weeklySavings}
        onChange={setWeeklySavings}
        prefix={currencySymbol}
      />

      <CustomSlider
        label="INTEREST RATE (APY)"
        min={0}
        max={20}
        value={interestRate}
        onChange={setInterestRate}
        suffix="%"
      />
    </View>
  );
});
