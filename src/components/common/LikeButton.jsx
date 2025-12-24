import React, { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
  ActivityIndicator,
} from "react-native";
import { Heart } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistItem } from "../../redux/thunks/wishlistThunk";
import { selectIsInWishlist } from "../../redux/slices/wishlistSlice";

const LikeButton = ({
  medicineId,
  size = 30,
  color = "#FF3040",
  inactiveColor = "#030502",
  onToggle = () => { },
  disabled = false,
}) => {
  const dispatch = useDispatch();
  const isInWishlist = useSelector((state) => selectIsInWishlist(state, medicineId));
  const [isLoading, setIsLoading] = useState(false);
  const [liked, setLiked] = useState(isInWishlist);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bubbleScale = useRef(new Animated.Value(0)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;

  // Sync local state with Redux state
  useEffect(() => {
    setLiked(isInWishlist);
  }, [isInWishlist]);

  const triggerBubble = () => {
    bubbleScale.setValue(0);
    bubbleOpacity.setValue(1);

    Animated.parallel([
      Animated.timing(bubbleScale, {
        toValue: 1.8,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(bubbleOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleLike = async () => {
    console.log('🔵 toggleLike called with medicineId:', medicineId);
    console.log('🔵 disabled:', disabled, 'isLoading:', isLoading);

    if (disabled || isLoading || !medicineId) {
      console.log('🔴 Returning early - disabled:', disabled, 'isLoading:', isLoading, 'medicineId:', medicineId);
      return;
    }

    // Store the previous state for error reversion
    const previousLikedState = liked;
    const newLikedState = !liked;

    console.log('🟢 Proceeding with toggle - previousState:', previousLikedState, 'newState:', newLikedState);

    // Optimistic update
    setLiked(newLikedState);

    // Heart scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.4, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    if (newLikedState) triggerBubble();

    // Call parent callback
    onToggle(newLikedState);

    // Dispatch Redux action
    console.log('🟡 Dispatching toggleWishlistItem for medicineId:', medicineId);
    setIsLoading(true);
    try {
      const result = await dispatch(toggleWishlistItem(medicineId)).unwrap();
      console.log('✅ Wishlist toggled successfully:', result);
    } catch (error) {
      console.error('❌ Error toggling wishlist:', error);
      // Revert to the previous state on error
      setLiked(previousLikedState);
      // Call parent callback with reverted state
      onToggle(previousLikedState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={toggleLike}
      disabled={disabled || isLoading}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {/* Bubble explosion effect */}
        <Animated.View
          style={[
            styles.bubbleCircle,
            {
              opacity: bubbleOpacity,
              transform: [{ scale: bubbleScale }],
            },
          ]}
        />

        {/* Heart icon */}
        {isLoading ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Heart
              size={size}
              color={liked ? color : inactiveColor}
              fill={liked ? color : "transparent"}
            />
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 4,
    borderRadius: 40,
    width: 'auto',
    borderWidth: 1.5,
    borderColor: '#ddd',
  },
  bubbleCircle: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 48, 64, 0.25)",
  },
});

export default LikeButton;
