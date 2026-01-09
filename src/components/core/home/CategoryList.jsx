import React, { useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import CategoryCard from "./CategoryCard";
import COLORS from "../../../constants/Color";
import { useCategories, useCategorySelection } from "../../../hooks/useCategories";
import CategoryListSkeleton from "./CategoryListSkeleton";

// Background color palette for category cards
const BG_COLORS = [
  "#E6FFE9", // soft mint
  "#FFF8D9", // pastel cream
  "#FFECEC", // light rose
  "#E8F6FF", // baby blue

  "#F3E8FF", // soft lavender
  "#FFEFD5", // papaya cream
  "#E0FFF4", // aqua mint
  "#FFF0F5", // lavender blush
  "#F0FFF0", // honeydew
  "#F5FFFA", // mint cream
  "#FDF5E6", // old lace
  "#E6F7FF", // sky tint
  "#FFF7F0", // peach tint
  "#F9E6FF", // pastel purple
  "#E9FFE6", // soft green
];

const CategoryList = ({ onSelect }) => {
  // Use custom hook for category management
  const {
    activeCategories: categories,
    loading,
    error,
    refreshing,
    shouldRefreshData,
    loadCategories,
    refreshCategoryList,
    getErrorMessage,
  } = useCategories();

  // Add random background colors to categories
  const categoriesWithColors = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      bg: BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)]
    }));
  }, [categories]);

  // Use category selection hook
  const { handleCategorySelect } = useCategorySelection(onSelect);

  // Fetch categories on component mount
  useEffect(() => {
    if (shouldRefreshData()) {
      loadCategories();
    }
  }, [shouldRefreshData, loadCategories]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refreshCategoryList();
  }, [refreshCategoryList]);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  // Handle category selection
  const onCategoryPress = useCallback((category) => {
    handleCategorySelect(category);
  }, [handleCategorySelect]);
  // Loading state
  if (loading && categoriesWithColors.length === 0) {
    return <CategoryListSkeleton count={6} />;
  }

  // Error state
  if (error && categoriesWithColors.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Shop By Category</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{getErrorMessage()}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Empty state
  if (!loading && !error && categoriesWithColors.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Shop By Category</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Shop By Category</Text>
        <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
          <Text style={[styles.seeAll, refreshing && styles.seeAllDisabled]}>
            {refreshing ? 'Refreshing...' : 'See All'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categoriesWithColors}
        contentContainerStyle={{
          paddingHorizontal: 10,
          marginTop: 40,
          paddingBottom: 10,
          overflow: 'visible'
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryCard item={item} onPress={onCategoryPress} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
        getItemLayout={(data, index) => ({
          length: 90, // Approximate width of each category card
          offset: 90 * index,
          index,
        })}
      />
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  seeAll: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
  seeAllDisabled: {
    color: "#999",
  },

  // Loading state styles
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },

  // Error state styles
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // Empty state styles
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontWeight: "500",
  },
});
