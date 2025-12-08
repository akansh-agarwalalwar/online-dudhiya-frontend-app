import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';



export const ScreenWrapper = ({
  children,
  bottomSafeArea = true,
  topSafeArea = true,
  leftSafeArea = true,
  rightSafeArea = true,
  backgroundColor,
  style,
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor,
  statusBarTranslucent = false,
}) => {
  const theme = useTheme();

  // Determine which edges should have safe area applied
  const safeAreaEdges = [];
  if (topSafeArea) safeAreaEdges.push('top');
  if (bottomSafeArea) safeAreaEdges.push('bottom');
  if (leftSafeArea) safeAreaEdges.push('left');
  if (rightSafeArea) safeAreaEdges.push('right');

  // Use provided background color or fall back to theme
  const containerBackgroundColor = backgroundColor || theme.colors.background;
  const statusBackground = statusBarBackgroundColor || containerBackgroundColor;

  const containerStyle = [
    styles.container,
    { backgroundColor: containerBackgroundColor },
    style,
  ];

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBackground}
        translucent={statusBarTranslucent}
      />
      <SafeAreaView 
        style={containerStyle}
        edges={safeAreaEdges}
      >
        {children}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;