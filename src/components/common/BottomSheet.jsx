import React, { useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import COLORS from "../../constants/Color";

const BottomSheet = ({ visible, onClose, children }) => {
  const height = 420;
  const offset = useSharedValue(height);
  const startY = useSharedValue(0);

  useEffect(() => {
    offset.value = visible ? withTiming(0, { duration: 350 }) : withTiming(height, { duration: 350 });
  }, [visible]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = offset.value;
    })
    .onUpdate((event) => {
      offset.value = Math.max(0, startY.value + event.translationY);
    })
    .onEnd((event) => {
      const shouldClose = event.velocityY > 500 || offset.value > height * 0.3;
      
      if (shouldClose) {
        offset.value = withTiming(height, { duration: 250 });
        runOnJS(onClose)();
      } else {
        offset.value = withTiming(0, { duration: 250 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, animatedStyle]}>
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.OVERLAY,
  },
  sheet: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 300,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: -8,
  },
});

export default BottomSheet;
