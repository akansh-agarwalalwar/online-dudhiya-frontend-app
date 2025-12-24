import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import ProductCardPage from "../components/core/product/ProductCardPage";
import AppHeader from "../components/common/AppHeader";
import ScreenWrapper from "../components/common/ScreenWrapper";
import { fetchHomeSections } from "../redux/thunks/productThunk"; // adjust path as needed
import { fetchCategories } from "../redux/thunks/categoryThunk";
import { selectCategories } from "../redux/slices/categorySlice";
import SkeletonPlaceholder from "react-native-skeleton-placeholder"; // install if not present
import { Milk, Filter, X } from "lucide-react-native";

const Product = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Get params locally to handle updates
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Categories from Redux
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector((state) => state.categories.loading);

  // Sync route params with local state
  useEffect(() => {
    const { categoryId, categorySlug, categoryName } = route?.params || {};
    if (categorySlug) {
      setSelectedCategory({ id: categoryId, slug: categorySlug, name: categoryName });
    } else {
      setSelectedCategory(null);
    }
  }, [route.params]);

  // Fetch categories if not available
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  // Adjust selector to get loading, products, and error
  const { loading, products: allProducts = [], error } = useSelector((state) => state.products || {});

  // Build params for API call
  const params = {
    page: 1,
    limit: 20,
    // Add category filter if provided
    ...(selectedCategory?.slug && { categoryIds: selectedCategory.slug }),
  };

  useEffect(() => {
    dispatch(fetchHomeSections(params));
  }, [dispatch, selectedCategory]);


  const handleCategoryPress = (category) => {
    if (!category) {
      // "All" selected
      setSelectedCategory(null);
      // Update navigation params to reflect "All" state without reloading page structure
      navigation.setParams({ categoryId: null, categorySlug: null, categoryName: null });
    } else {
      setSelectedCategory({ id: category.id, slug: category.slug, name: category.name });
      // Update navigation params just to keep URL/state in sync if needed
      navigation.setParams({ categoryId: category.id, categorySlug: category.slug, categoryName: category.name });
    }
  };

  const renderCategoryPill = ({ item }) => {
    // Check if this is the "All" pill (item is null or special object) OR a valid category
    const isAll = item.id === 'all';
    const isSelected = isAll
      ? selectedCategory === null
      : selectedCategory?.slug === item.slug;

    return (
      <TouchableOpacity
        style={[
          styles.categoryPill,
          isSelected && styles.categoryPillSelected
        ]}
        onPress={() => handleCategoryPress(isAll ? null : item)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.categoryPillText,
          isSelected && styles.categoryPillTextSelected
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProduct = ({ item, index }) => {
    if (!item) return null; // Prevent rendering if item is undefined/null
    return (
      <View style={styles.cardWrapper}>
        <ProductCardPage product={item} />
      </View>
    );
  };

  // Skeletons for loading state
  const renderSkeletons = () => (
    <FlatList
      data={Array.from({ length: 6 })}
      keyExtractor={(_, idx) => `skeleton-${idx}`}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "center" }}
      contentContainerStyle={{ gap: 12 }}
      renderItem={() => (
        <View style={styles.cardWrapper}>
          <SkeletonPlaceholder borderRadius={8}>
            <SkeletonPlaceholder.Item width={160} height={220} marginBottom={10} />
          </SkeletonPlaceholder>
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );

  // Prepare data for category list: "All" + actual categories
  const categoryList = [{ id: 'all', name: 'All Products' }, ...categories];

  return (
    <ScreenWrapper bottomSafeArea={true} topSafeArea={false} style={styles.container}>
      <AppHeader
        title={selectedCategory?.name ? `${selectedCategory.name}` : "Explore Products"}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Category Filter Section */}
      <View style={styles.filterContainer}>
        <FlatList
          data={categoryList}
          renderItem={renderCategoryPill}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterListContent}
        />
      </View>

      {loading ? (
        renderSkeletons()
      ) : allProducts.length === 0 ? (
        // Empty State
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateIcon}>
            <Milk size={100} color="#333" style={{ textAlign: "center" }} />
          </Text>
          <Text style={styles.emptyStateTitle}>No Products Found</Text>
          <Text style={styles.emptyStateMessage}>
            {selectedCategory?.name
              ? `No products available in "${selectedCategory.name}" category.`
              : "No products available at the moment."}
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => handleCategoryPress(null)}
          >
            <Text style={styles.emptyStateButtonText}>View All Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={allProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "center" }}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F0",
  },
  // Filter Styles
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: "#F8F8F0",
  },
  filterListContent: {
    paddingHorizontal: 15,
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  categoryPillSelected: {
    backgroundColor: "#2F5795",
    borderColor: "#2F5795",
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  categoryPillTextSelected: {
    color: "#fff",
    fontWeight: "600",
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
  cardWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    justifyContent: "space-around",
  },

  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 80,
    marginBottom: 20,
    textAlign: 'center'
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  emptyStateButton: {
    backgroundColor: "#2F5795",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Product;