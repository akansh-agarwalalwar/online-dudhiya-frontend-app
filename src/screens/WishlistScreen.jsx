import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import WishlistCard from "../components/core/Order/WishlistCard";
import COLORS from "../constants/Color";
import AppHeader from "../components/common/AppHeader";

const WishlistScreen = ( { navigation }) => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Fresh Organic Tomatoes",
      image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
      seller: "Green Farm",
      sellerImage:
        "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
      isFavorite: true,
    },
    {
      id: 2,
      name: "Premium Golden Apples",
      image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
      seller: "Fruit Valley",
      sellerImage:
        "https://randomuser.me/api/portraits/men/46.jpg",
      rating: 5.0,
      isFavorite: false,
    },
    {
      id: 3,
      name: "Fresh Spinach Leaves",
      image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
      seller: "Healthy Greens",
      sellerImage:
        "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4.8,
      isFavorite: true,
    },
    {
      id: 4,
      name: "Farm Fresh Strawberries",
      image: "https://images.unsplash.com/photo-1560807707-8cc77767d783",
      seller: "Berry House",
      sellerImage:
        "https://randomuser.me/api/portraits/men/31.jpg",
      rating: 5.0,
      isFavorite: false,
    },
  ]);

  const toggleFavorite = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, isFavorite: !it.isFavorite } : it
      )
    );
  };

  return (
    <View style={styles.container}>
        <AppHeader
            title="My Wishlist"
            showBackButton
            onBackPress={() => navigation.goBack()}
        />

      <FlatList
      style={{ flex: 1, padding: 20 }}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <WishlistCard
            item={item}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
      />
    </View>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.DARK,
  },
});
