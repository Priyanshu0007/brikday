/* eslint-disable react-hooks/immutability */
"use no memo";
import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BRUTALIST_THEME } from './theme';
import { Typography } from './Typography';

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
  const sheetRef = useRef<TrueSheet>(null);
  const isPresented = useRef(false);

  useEffect(() => {
    if (visible) {
      isPresented.current = true;
      sheetRef.current?.present();
    } else if (isPresented.current) {
      sheetRef.current?.dismiss();
      isPresented.current = false;
    }
  }, [visible]);

  return (
    <TrueSheet
      ref={sheetRef}
      detents={['auto']}
      onDidDismiss={() => {
        isPresented.current = false;
        onClose();
      }}
      backgroundColor={BRUTALIST_THEME.colors.paper}
      cornerRadius={BRUTALIST_THEME.borderRadius}
    >
      <View style={styles.sheetContent}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2" uppercase>
            {title}
          </Typography>
        </View>

        {/* Content - wrapped in GestureHandlerRootView for pressto buttons */}
        <GestureHandlerRootView style={styles.content}>
          {children}
        </GestureHandlerRootView>
      </View>
    </TrueSheet>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    marginBottom: 20,
    marginTop: 8,
  },
  content: {
    paddingBottom: 0,
  },
});
