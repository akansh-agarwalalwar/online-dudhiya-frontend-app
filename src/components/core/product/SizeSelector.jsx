import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../../../constants/Color";

const SizeSelector = ({ sizes, selectedSize, onSelect }) => {
  return (
    <View style={styles.chipContainer}>
      {sizes.map((size, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.chip,
            selectedSize === size && styles.chipSelected,
          ]}
          onPress={() => onSelect(size)}
        >
          <Text
            style={[
              styles.chipText,
              selectedSize === size && styles.chipTextSelected,
            ]}
          >
            {size}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: "#F5F5F5",
    paddingVertical: 3,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: "#1976D2",
  },
  chipText: {
    fontSize: 14,
    color: "#333",
  },
  chipTextSelected: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default SizeSelector;
