/* eslint-disable react-hooks/immutability */
"use no memo";
import React, { useEffect } from 'react';
import { StyleSheet, View, Modal, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { BRUTALIST_THEME } from './theme';
import { Typography } from './Typography';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BrutalistBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BrutalistBottomSheet({
  visible,
  onClose,
  title,
  children,
}: BrutalistBottomSheetProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Slide up and fade in backdrop
      translateY.value = withSpring(0, { damping: 18, stiffness: 100 });
      backdropOpacity.value = withTiming(0.5, { duration: 250 });
    } else {
      // Slide down and fade out backdrop
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
      backdropOpacity.value = withTiming(0, { duration: 250 });
    }
  }, [visible, translateY, backdropOpacity]);

  const handleDismiss = () => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
    backdropOpacity.value = withTiming(0, { duration: 200 });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow dragging down
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 120 || event.velocityY > 600) {
        // Dragged down far enough or fast enough - close
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, () => {
          runOnJS(onClose)();
        });
        backdropOpacity.value = withTiming(0, { duration: 200 });
      } else {
        // Snap back up
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleDismiss}
      animationType="none"
    >
      <View style={styles.container}>
        {/* Backdrop overlay */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss} />
        </Animated.View>

        {/* Bottom Sheet Card */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, animatedStyle]}>
            {/* Grab Handle */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Typography variant="h2" uppercase>
                {title}
              </Typography>
            </View>

            {/* Scrollable / Interactive Content */}
            <View style={styles.content}>{children}</View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  sheet: {
    backgroundColor: BRUTALIST_THEME.colors.paper,
    borderTopWidth: BRUTALIST_THEME.borderWidth,
    borderLeftWidth: BRUTALIST_THEME.borderWidth,
    borderRightWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '80%',
    shadowColor: BRUTALIST_THEME.colors.border,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRUTALIST_THEME.colors.border,
    borderWidth: 1,
    borderColor: BRUTALIST_THEME.colors.border,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    marginBottom: 20,
  },
  content: {
    // Add extra padding to keep clear of gesture boundaries
    paddingBottom: 10,
  },
});
