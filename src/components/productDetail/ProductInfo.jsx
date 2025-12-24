import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { calculateDiscount, formatPrice } from '../../utils/priceUtils';
import COLORS from '../../constants/Color';

/**
 * ProductInfo Component
 * Displays product title, pricing, ratings, and basic information
 */
const ProductInfo = ({ product, selectedSize }) => {
  if (!product) return null;

  const {
    productName,
    slug,
    packagingSize,
    hasSizes,
    mrp: productMrp,
    salePrice: productSalePrice,
    productCompany,
    prescriptionRequired,
  } = product;

  // Determine pricing based on size selection
  let displayMrp, displaySalePrice, discountPercent, sizeName;

  if (hasSizes && selectedSize) {
    displayMrp = selectedSize.mrp;
    displaySalePrice = selectedSize.salePrice;
    sizeName = selectedSize.sizeName;
  } else {
    displayMrp = productMrp;
    displaySalePrice = productSalePrice;
    sizeName = packagingSize;
  }

  discountPercent = calculateDiscount(displayMrp, displaySalePrice);

  // Mock rating data (replace with actual data when available)
  const rating = 4.2;
  const ratingCount = 413;

  return (
    <View style={styles.container}>
      {/* Product Name */}
      <Text style={styles.productName}>{productName}</Text>

      {/* Size/Packaging Info */}
      {sizeName && (
        <Text style={styles.sizeInfo}>{sizeName}</Text>
      )}

      {/* Brand/Company */}
      {productCompany && (
        <Text style={styles.companyName}>by {productCompany}</Text>
      )}

      {/* Price Section */}
      <View style={styles.priceContainer}>
        <Text style={styles.salePrice}>₹{formatPrice(displaySalePrice)}</Text>
        
        {displayMrp && displayMrp !== displaySalePrice && (
          <>
            <Text style={styles.mrpPrice}>₹{formatPrice(displayMrp)}</Text>
            {discountPercent > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discountPercent}% OFF</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Tax Info */}
      <Text style={styles.taxInfo}>Inclusive of all taxes</Text>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingValue}>{rating}</Text>
          <Star size={16} color="#FFD700" fill="#FFD700" />
        </View>
        <Text style={styles.ratingCount}>
          {ratingCount} Ratings & Reviews
        </Text>
      </View>

      {/* Prescription Badge */}
      {prescriptionRequired && (
        <View style={styles.prescriptionBadge}>
          <Text style={styles.prescriptionText}>
            ⚕️ Prescription Required
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProductInfo;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    lineHeight: 28,
    marginBottom: 4,
  },
  sizeInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  salePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginRight: 12,
  },
  mrpPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  taxInfo: {
    fontSize: 12,
    color: '#777',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: '#555',
  },
  prescriptionBadge: {
    marginTop: 12,
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  prescriptionText: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: '600',
  },
});
