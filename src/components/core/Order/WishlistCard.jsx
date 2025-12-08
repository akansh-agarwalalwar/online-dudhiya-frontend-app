import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Star, Heart } from "lucide-react-native";
import COLORS from "../../../constants/Color";

const WishlistCard = ({ item, onToggleFavorite }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>

        <View style={styles.row}>
          <View style={styles.authorRow}>
            <Text style={styles.seller}>{item.seller}</Text>
          </View>

          <View style={styles.ratingRow}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.favorite} onPress={onToggleFavorite}>
        <Heart
          size={22}
          color={item.isFavorite ? COLORS.ERROR : COLORS.GRAY}
          fill={item.isFavorite ? COLORS.ERROR : "transparent"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default WishlistCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.WHITE,
    marginBottom: 14,
    alignItems: "center",
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.DARK,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerImg: {
    width: 26,
    height: 26,
    borderRadius: 20,
    marginRight: 6,
  },
  seller: {
    fontSize: 13,
    color: COLORS.GRAY,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.DARK,
    marginLeft: 4,
  },
    favorite: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
    },

});
