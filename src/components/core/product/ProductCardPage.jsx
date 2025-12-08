import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // <-- Add this import
import RatingBadge from "./RatingBadge";
import SizeSelector from "./SizeSelector";
import { calculateDiscount } from "../../../utils/priceUtils";
import COLORS from "../../../constants/Color";

const ProductCardPage = ({ product }) => {
  const navigation = useNavigation(); // <-- Add this hook
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const discountPercent = calculateDiscount(
    product.actualPrice,
    product.offerPrice
  );

  const {
    productImage,
    title,
    rating = 4.3,
    ratingCount = 1000,
    sizes,
    offerPrice,
    actualPrice,
    brand,
    category,
    description,
    deliveryTime,
    inStock = true
  } = product;

  // Wrap the card in TouchableOpacity for navigation
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetails', { product })}
    >
      <View style={styles.card}>
        {/* Product Row */}
        <View style={styles.row}>
          {/* IMAGE */}
          <Image source={{ uri: productImage }} style={styles.image} />

          {/* RIGHT SIDE CONTENT */}
          <View style={styles.infoSection}>
            
            {/* BRAND & CATEGORY */}
            {(brand || category) && (
              <View style={styles.brandCategoryRow}>
                {brand && <Text style={styles.brandText}>{brand}</Text>}
                {category && <Text style={styles.categoryText}>{category}</Text>}
              </View>
            )}
            
            {/* TITLE */}
            <Text style={styles.title}>
              {title}
            </Text>

            {/* DESCRIPTION */}
            {description && (
              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
            )}

            {/* Rating */}
            <RatingBadge rating={rating} count={ratingCount} />  
          </View>
        </View>
        {/* DELIVERY TIME */}
            {/* {deliveryTime && inStock && (
              <Text style={styles.deliveryTime}>🚛 Delivery: {deliveryTime}</Text>
            )} */}

            {/* Size Selector */}
            <SizeSelector
              sizes={sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />

            {/* PRICE SECTION */}
            <View style={styles.priceRow}>
              <Text style={styles.offerPrice}>₹{offerPrice}</Text>
              <Text style={styles.actualPrice}>₹{actualPrice}</Text>

              {discountPercent > 0 && (
                <Text style={styles.discountText}>{discountPercent}% OFF</Text>
              )}
            </View>

        {/* ACTION BUTTONS */}
        <View style={styles.btnRow}>
          {!inStock ? (
            <View style={styles.outOfStockBtn}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          ) : (
            <>
              {/* <TouchableOpacity style={styles.buyOnceBtn}>
                <Text style={styles.buyOnceText}>Buy Once</Text>
              </TouchableOpacity> */}

              <TouchableOpacity style={styles.subscribeBtn}>
                <Text style={styles.subscribeText}>
                  Add to Bag @ ₹{offerPrice}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCardPage;


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 12,
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },

  row: { flexDirection: "row" },
  image: { width: 140, height: 120, resizeMode: "cover", borderRadius: 10 },

  infoSection: { flex: 1, marginLeft: 12 },

  brandCategoryRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 4,
    gap: 8 
  },
  brandText: { 
    fontSize: 11, 
    fontWeight: "600", 
    color: "#666",
    textTransform: "uppercase" 
  },
  categoryText: { 
    fontSize: 10, 
    color: "#888",
    fontStyle: "italic" 
  },

  title: { fontSize: 16, fontWeight: "700", color: "#222" },

  description: { 
    fontSize: 13, 
    color: "#666", 
    marginTop: 4, 
    lineHeight: 18 
  },

  deliveryTime: { 
    fontSize: 12, 
    color: "#2E7D32", 
    marginTop: 4,
    fontWeight: "600" 
  },

  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  offerPrice: { fontSize: 24, fontWeight: "700", color: COLORS.PRIMARY },
  actualPrice: {
    fontSize: 18,
    marginLeft: 6,
    color: "#888",
    textDecorationLine: "line-through",
  },
  discountText: {
    marginLeft: 8,
    color: "red",
    fontWeight: "700",
    fontSize: 12,
  },

  btnRow: { flexDirection: "row", marginTop: 12 },

  buyOnceBtn: {
    width: "40%",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buyOnceText: { color: "#555" },

  subscribeBtn: {
    width: "100%",
    backgroundColor: COLORS.PRIMARY,
    marginLeft: 8,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  subscribeText: { color: "#FFF", fontWeight: "700" },

  outOfStockBtn: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockText: { color: "#999", fontWeight: "600" },
});

