import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Star, Heart, Trash2 } from "lucide-react-native";
import COLORS from "../../../constants/Color";

const WishlistCard = ({ item, onRemove, onPress }) => {
  const medicine = item?.medicine || {};
  const images = medicine?.images || [];
  const primaryImage = images[0]?.url || images[0];
  const likeCount = medicine?.likeCount || 0;
  const salePrice = medicine?.salePrice || medicine?.sale_price;
  const mrp = medicine?.mrp;

  // Calculate discount percentage
  const discountPercentage = mrp && salePrice
    ? Math.round(((mrp - salePrice) / mrp) * 100)
    : 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Product Image */}
      <Image
        source={{ uri: primaryImage || 'https://via.placeholder.com/70' }}
        style={styles.image}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {medicine?.productName || medicine?.product_name || 'Medicine'}
        </Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          {salePrice && (
            <Text style={styles.price}>₹{parseFloat(salePrice).toFixed(2)}</Text>
          )}
          {mrp && mrp > salePrice && (
            <Text style={styles.mrp}>₹{parseFloat(mrp).toFixed(2)}</Text>
          )}
          {discountPercentage > 0 && (
            <Text style={styles.discount}>{discountPercentage}% OFF</Text>
          )}
        </View>

        {/* Like Count */}
        {likeCount > 0 && (
          <View style={styles.likeRow}>
            <Heart size={14} color={COLORS.ERROR} fill={COLORS.ERROR} />
            <Text style={styles.likeCount}>
              {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </Text>
          </View>
        )}

        {/* Stock Status */}
        {medicine?.inStock !== undefined && (
          <Text style={[
            styles.stockText,
            { color: medicine.inStock ? COLORS.SUCCESS : COLORS.ERROR }
          ]}>
            {medicine.inStock ? 'In Stock' : 'Out of Stock'}
          </Text>
        )}
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={(e) => {
          e.stopPropagation();
          onRemove && onRemove();
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Trash2 size={20} color={COLORS.ERROR} />
      </TouchableOpacity>
    </TouchableOpacity>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: COLORS.LIGHT_GRAY,
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
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.PRIMARY,
    marginRight: 8,
  },
  mrp: {
    fontSize: 14,
    color: COLORS.GRAY,
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discount: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.SUCCESS,
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  likeCount: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginLeft: 4,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
