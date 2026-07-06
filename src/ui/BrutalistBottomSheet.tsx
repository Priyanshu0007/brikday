/* eslint-disable react-hooks/immutability */
'use no memo';
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
  /** Enable native scroll handling for long content. Uses fractional detents instead of 'auto'. */
  scrollable?: boolean;
  /** Sticky footer content pinned to the bottom of the sheet (only used with scrollable). */
  footer?: React.ReactNode;
}

export function BrutalistBottomSheet({
  visible,
  onClose,
  title,
  children,
  scrollable = false,
  footer,
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

  // 'auto' detent is not supported with scrollable — use fractional detents
  const detents = scrollable ? [0.9] : ['auto'] as const;

  const headerElement = (
    <View style={stylesheet.header}>
      <Typography variant="h2" uppercase>
        {title}
      </Typography>
    </View>
  );

  const footerElement = footer ? (
    <GestureHandlerRootView style={stylesheet.footerContainer}>
      {footer}
    </GestureHandlerRootView>
  ) : undefined;

  return (
    <TrueSheet
      ref={sheetRef}
      detents={detents}
      scrollable={scrollable}
      onDidDismiss={() => {
        isPresented.current = false;
        onClose();
      }}
      backgroundColor={theme.colors.paper}
      cornerRadius={theme.borderRadius}
      grabber={false}
      header={scrollable ? headerElement : undefined}
      footer={scrollable ? footerElement : undefined}
    >
      {scrollable ? (
        <GestureHandlerRootView style={stylesheet.scrollableContent}>
          {children}
        </GestureHandlerRootView>
      ) : (
        <View style={stylesheet.sheetContent}>
          {headerElement}
          <GestureHandlerRootView style={stylesheet.content}>{children}</GestureHandlerRootView>
        </View>
      )}
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
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 0,
  },
  scrollableContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.paper,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
}));
