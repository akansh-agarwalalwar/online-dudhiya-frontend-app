import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { formatPrice, calculateDiscount } from '../../utils/priceUtils';
import COLORS from '../../constants/Color';

/**
 * ProductSizeSelector Component
 * Allows users to select different product sizes with price display
 */
const ProductSizeSelector = ({ sizes = [], selectedSize, onSizeSelect }) => {
  // Don't render if no sizes available
  if (!sizes || sizes.length === 0) {
    return null;
  }

  // Filter out deleted sizes and sort by sortOrder
  const availableSizes = sizes
    .filter(size => size.inStock !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (availableSizes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Size</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sizesContainer}
      >
        {availableSizes.map((size) => {
          const isSelected = selectedSize?.id === size.id;
          const discount = calculateDiscount(size.mrp, size.salePrice);

          return (
            <TouchableOpacity
              key={size.id}
              onPress={() => onSizeSelect(size)}
              style={[
                styles.sizeCard,
                isSelected && styles.selectedSizeCard,
                !size.inStock && styles.outOfStockCard,
              ]}
              disabled={!size.inStock}
            >
              {/* Size Name */}
              <Text style={[
                styles.sizeName,
                isSelected && styles.selectedText,
              ]}>
                {size.sizeName}
              </Text>

              {/* Price */}
              <Text style={[
                styles.sizePrice,
                isSelected && styles.selectedText,
              ]}>
                ₹{formatPrice(size.salePrice)}
              </Text>

              {/* MRP (if different) */}
              {size.mrp && size.mrp !== size.salePrice && (
                <Text style={styles.sizeMrp}>
                  ₹{formatPrice(size.mrp)}
                </Text>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <View style={[
                  styles.discountBadge,
                  isSelected && styles.selectedDiscountBadge,
                ]}>
                  <Text style={styles.discountText}>{discount}% OFF</Text>
                </View>
              )}

              {/* Out of Stock Overlay */}
              {!size.inStock && (
                <View style={styles.outOfStockOverlay}>
                  <Text style={styles.outOfStockText}>Out of Stock</Text>
                </View>
              )}

              {/* Selected Indicator */}
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ProductSizeSelector;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },
  sizesContainer: {
    gap: 12,
  },
  sizeCard: {
    minWidth: 120,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedSizeCard: {
    backgroundColor: '#E8F5E9',
    borderColor: COLORS.PRIMARY,
  },
  outOfStockCard: {
    opacity: 0.5,
  },
  sizeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedText: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  sizePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  sizeMrp: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  selectedDiscountBadge: {
    backgroundColor: COLORS.PRIMARY,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
  outOfStockText: {
    color: '#E53935',
    fontSize: 12,
    fontWeight: '700',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
