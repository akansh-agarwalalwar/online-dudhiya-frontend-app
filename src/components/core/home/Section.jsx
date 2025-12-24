import React, { useState, useCallback, memo } from "react";
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import ProductCard from "../product/ProductCard";

const { width } = Dimensions.get("window");

// Soft light color palette
const SOFT_COLORS = [
  '#FDEBD0', // light peach
  '#D6EAF8', // light blue
  '#D5F5E3', // light green
  '#F9E79F', // light yellow
  '#FADBD8', // light pink
  '#E8DAEF', // light lavender
  '#FCF3CF', // light cream
  '#EBF5FB', // very light blue
  '#F6DDCC', // light tan
  '#EAF2F8', // pale blue
];

const getRandomSoftColor = () => {
  return SOFT_COLORS[Math.floor(Math.random() * SOFT_COLORS.length)];
};

const Section = ({ section }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  // Pick a random soft color for the banner background (memoized per section)
  const [bannerBgColor] = useState(getRandomSoftColor());

  // Validate section data
  if (!section) {
    return null;
  }
  console.log(section, 'at section component');

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const toggleShowAll = useCallback(() => {
    setShowAllProducts(!showAllProducts);
  }, [showAllProducts]);

  // Get products from either 'products' or 'medicines' array (handling new data structure)
  const products = section.products || section.medicines || [];

  // Display limited products initially, all when expanded
  const displayProducts = showAllProducts
    ? products
    : products.slice(0, 6);

  const hasMoreProducts = products && products.length > 6;

  const renderProductItem = useCallback(({ item }) => (
    <ProductCard product={item} />
  ), []);

  const renderEmptyComponent = useCallback(() => (
    <View style={styles.emptyProductsContainer}>
      <Text style={styles.emptyProductsText}>No products available</Text>
    </View>
  ), []);

  return (
    <View style={styles.sectionContainer}>
      {/* Render Banner if available */}
      {((section.showSectionImage && section.sectionImage) || section.imageUrl) && (
        <View style={[styles.bannerWrapper, { backgroundColor: bannerBgColor }]}>
          {imageLoading && !imageError && (
            <View style={styles.imageLoadingContainer}>
              <ActivityIndicator size="small" color="#1ea6ff" />
            </View>
          )}

          {!imageError && (
            <Image
              source={{ uri: section.sectionImage || section.imageUrl }}
              style={styles.bannerImage}
              onLoad={handleImageLoad}
              onError={handleImageError}
              resizeMode="cover"
            />
          )}

          {imageError && (
            <View style={styles.imageErrorContainer}>
              <Text style={styles.imageErrorText}>Image not available</Text>
            </View>
          )}

          {/* Title over banner */}
          {(section.title || section.name) && (
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerText} numberOfLines={2}>
                {section.title || section.name}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Section Header for non-banner sections */}
      {!section.showSectionImage && !section.imageUrl && (
        <View style={styles.sectionHeader}>
          {(section.title || section.name) && (
            <Text style={styles.sectionTitle} numberOfLines={1}>
              {section.title || section.name}
            </Text>
          )}
          {hasMoreProducts && (
            <TouchableOpacity onPress={toggleShowAll} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>
                {showAllProducts ? 'View Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Product List */}
      {products && products.length > 0 ? (
        <FlatList
          horizontal={!showAllProducts}
          numColumns={showAllProducts ? 2 : 1}
          numberOfLines={2}
          key={showAllProducts ? 'grid' : 'horizontal'}
          data={displayProducts}
          keyExtractor={(item) => (item.id || item.slug || Math.random()).toString()}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={renderProductItem}
          contentContainerStyle={
            showAllProducts
              ? styles.gridContainer
              : styles.horizontalContainer
          }
          columnWrapperStyle={showAllProducts ? { alignItems: 'flex-start' } : undefined}
          scrollEnabled={!showAllProducts}
          getItemLayout={showAllProducts ? undefined : (data, index) => ({
            length: 160,
            offset: 160 * index,
            index,
          })}
          removeClippedSubviews={true}
          maxToRenderPerBatch={6}
          windowSize={5}
          initialNumToRender={4}
        />
      ) : (
        renderEmptyComponent()
      )}

      {/* View All button for banner sections */}
      {/* {(section.showSectionImage || section.imageUrl) && hasMoreProducts && (
        <View style={styles.viewAllContainer}>
          <TouchableOpacity onPress={toggleShowAll} style={styles.viewAllButtonBanner}>
            <Text style={styles.viewAllTextBanner}>
              {showAllProducts ? 'View Less' : `View All (${products.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 28,
    backgroundColor: '#fff',
    // borderRadius: 16,
    // marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },

  // Banner container with enhanced styling
  bannerWrapper: {
    width: '100%',
    height: 180,
    position: 'relative',
    // backgroundColor will be set dynamically
  },

  bannerImage: {
    width: "100%",
    height: "100%",
  },

  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },

  imageErrorContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },

  imageErrorText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },

  // Enhanced title container over banner
  bannerTextContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  bannerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    lineHeight: 28,
  },

  // Section header for non-banner sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    flex: 1,
  },

  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1ea6ff',
    borderRadius: 20,
  },

  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  // Product containers
  horizontalContainer: {
    position: 'relative',
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },

  gridContainer: {
    position: 'relative',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  emptyProductsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyProductsText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
    textAlign: 'center',
  },

  // View all button for banner sections
  viewAllContainer: {
    position: 'absolute',
    top: 170,
    right: 10,
  },

  viewAllButtonBanner: {
    // backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    // borderWidth: 2,
    // borderColor: '#1ea6ff',
  },

  viewAllTextBanner: {
    fontSize: 14,
    fontWeight: '600',
    color: '#323232ff',
  },
});

export default memo(Section);
