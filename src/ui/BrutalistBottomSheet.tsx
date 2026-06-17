/* eslint-disable react-hooks/immutability */
"use no memo";
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
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
  const { theme } = useUnistyles();

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
      backgroundColor={theme.colors.paper}
      cornerRadius={theme.borderRadius}
    >
      <View style={stylesheet.sheetContent}>
        {/* Header */}
        <View style={stylesheet.header}>
          <Typography variant="h2" uppercase>
            {title}
          </Typography>
        </View>

        {/* Content - wrapped in GestureHandlerRootView for pressto buttons */}
        <GestureHandlerRootView style={stylesheet.content}>
          {children}
        </GestureHandlerRootView>
      </View>
    </TrueSheet>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  sheetContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: 20,
    marginTop: 8,
  },
  content: {
    paddingBottom: 0,
  },
}));
