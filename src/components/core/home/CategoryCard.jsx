import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const CategoryCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.bg }]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 100,
    borderRadius: 14,
    padding: 0,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow:'visible',
  },
  image: {
    position: "absolute",
    top: -40,
    width: '100%',
    height: 110,   
  },
  title: {
    position: "absolute",
    bottom: 10,
    marginTop: 8,
    fontWeight: "600",
    fontSize: 14,
    color: "#222",
  },
});
