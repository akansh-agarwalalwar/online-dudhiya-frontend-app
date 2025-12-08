import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProductCard from "../components/core/product/ProductCard";
import ProductCardPage from "../components/core/product/ProductCardPage";
import { products } from "../config/Produts.json";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/common/AppHeader";
import ScreenWrapper from "../components/common/ScreenWrapper";

const Product = () => {
  const navigation = useNavigation();
  // Get all products from the JSON data
  const allProducts = products;

  const renderProduct = ({ item, index }) => {

    return (
      <View style={styles.cardWrapper}>
        <ProductCardPage product={item} />
      </View>
    );
  };

  return (
    <ScreenWrapper bottomSafeArea={true} topSafeArea={false} style={styles.container}>
      <AppHeader
        title="Product Details"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={allProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        numColumns={1}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
  },
  showcaseButton: {
    backgroundColor: "#1ea6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  showcaseButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  countText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 15,
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    justifyContent: "space-around",
  },
});

export default Product;