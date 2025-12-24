import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const ProductItem = ({ image, name, onPress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      <Text style={styles.label}>
        {name?.length > 10 ? `${name.slice(0, 10)}..` : name}
      </Text>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  item: {
    marginRight: 25,
    alignItems: "center",
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 12,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
});
