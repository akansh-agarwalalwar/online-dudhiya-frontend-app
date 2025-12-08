import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import COLORS from '../../constants/Color';

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({ 
  size = 'large',
  color = COLORS.PRIMARY,
  overlay = false 
}) => {
  return (
    <View style={[styles.container, overlay && styles.overlay]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
});

export default LoadingScreen;