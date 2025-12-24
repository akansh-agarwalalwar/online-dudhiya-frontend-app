import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import WishlistCard from "../components/core/Order/WishlistCard";
import COLORS from "../constants/Color";
import AppHeader from "../components/common/AppHeader";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../redux/thunks/wishlistThunk";
import {
  selectWishlistItems,
  selectWishlistLoading,
  selectWishlistTotal,
} from "../redux/slices/wishlistSlice";

const WishlistScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  const isLoading = useSelector(selectWishlistLoading);
  const total = useSelector(selectWishlistTotal);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      await dispatch(fetchWishlist()).unwrap();
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWishlist();
    setRefreshing(false);
  };

  const handleRemoveItem = async (wishlistId) => {
    try {
      await dispatch(removeFromWishlist(wishlistId)).unwrap();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleItemPress = (item) => {
    if (item.medicine?.id) {
      navigation.navigate("ProductDetails", {
        id: item.medicine.id
      });
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
      <Text style={styles.emptyText}>
        Start adding your favorite medicines to your wishlist
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <WishlistCard
      item={item}
      onRemove={() => handleRemoveItem(item.id)}
      onPress={() => handleItemPress(item)}
    />
  );

  if (isLoading && items.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="My Wishlist"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading wishlist...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title={`My Wishlist ${total > 0 ? `(${total})` : ''}`}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        style={styles.listContainer}
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
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
  listContainer: {
    flex: 1,
    padding: 20,
  },
  listContent: {
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.GRAY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.DARK,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.GRAY,
    textAlign: "center",
  },
});
