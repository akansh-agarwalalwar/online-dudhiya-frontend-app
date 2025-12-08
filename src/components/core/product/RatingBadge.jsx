import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RatingBadge = ({ rating, count }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.ratingText}>{rating}★</Text>
      <Text style={styles.countText}>{count} Ratings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  ratingText: {
    backgroundColor: "#DEF7D9",
    color: "#1B8A3B",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  countText: { marginLeft: 6, color: "#777", fontSize: 12 },
});

export default RatingBadge;
