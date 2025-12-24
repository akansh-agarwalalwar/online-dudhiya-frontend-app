import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Animated } from "react-native";
import { Handbag, Minus, Plus } from "lucide-react-native";

const AddToBagButton = ({
  label = "Add to Bag",
  iconSize = 22,
  textColor = "#000000",
  borderRadius = 40,
  onPress = () => { },
  onQuantityChange = () => { },
  externalQuantity = null,
}) => {
  const [internalQuantity, setInternalQuantity] = useState(0);
  const quantity = externalQuantity !== null ? externalQuantity : internalQuantity;
  const scaleAnim = new Animated.Value(1);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleAddToBag = () => {
    animatePress();
    const newQuantity = 1;
    if (externalQuantity === null) {
      setInternalQuantity(newQuantity);
    }
    onPress();
    onQuantityChange(newQuantity);
  };

  const handleIncrement = () => {
    animatePress();
    const newQuantity = quantity + 1;
    if (externalQuantity === null) {
      setInternalQuantity(newQuantity);
    }
    onQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    animatePress();
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      if (externalQuantity === null) {
        setInternalQuantity(newQuantity);
      }
      onQuantityChange(newQuantity);
    }
  };

  // Show bag icon when quantity is 0
  if (quantity === 0) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={handleAddToBag}>
        <Animated.View
          style={[
            styles.button,
            {
              borderRadius,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Handbag size={iconSize} color={textColor} strokeWidth={1.7} />
        </Animated.View>
      </TouchableOpacity>
    );
  }

  // Show quantity selector when quantity > 0
  return (
    <Animated.View
      style={[
        styles.quantityContainer,
        {
          borderRadius,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleDecrement}
        style={styles.quantityButton}
      >
        <Minus size={18} color={textColor} strokeWidth={2} />
      </TouchableOpacity>

      <View style={styles.quantityDisplay}>
        <Text style={[styles.quantityText, { color: textColor }]}>{quantity}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleIncrement}
        style={styles.quantityButton}
      >
        <Plus size={18} color={textColor} strokeWidth={2} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: '#F8F8EE',
    width: 45,
    height: 45,
    borderRadius: 40,
    padding: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: '#F8F8EE',
    height: 45,
    borderRadius: 40,
    paddingHorizontal: 4,
    minWidth: '100%',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#E8E8D8',
  },
  quantityDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddToBagButton;
