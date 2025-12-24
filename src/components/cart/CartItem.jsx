import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Minus, Plus, Heart } from 'lucide-react-native';
import COLORS from '../../constants/Color';

const CartItem = ({
  item,
  onQuantityChange = () => {},
  onToggleFavorite = () => {},
  onRemoveItem = () => {},
}) => {
  const {
    id,
    name,
    description,
    price,
    originalPrice,
    discount,
    quantity = 1,
    image,
    isFavorite = false,
  } = item;

  const handleIncrement = () => {
    onQuantityChange(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    } else {
      onRemoveItem(id);
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <View style={styles.container}>
      {/* Discount Badge */}
      {discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discount}%</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image || 'https://via.placeholder.com/80x120' }} 
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.productName} numberOfLines={2}>
              {name}
            </Text>
            {/* <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => onToggleFavorite(id)}
            >
              <Heart 
                size={20} 
                color={isFavorite ? COLORS.ERROR : COLORS.GRAY}
                fill={isFavorite ? COLORS.ERROR : 'transparent'}
              />
            </TouchableOpacity> */}
          </View>

          <Text style={styles.productDescription} numberOfLines={2}>
            {description}
          </Text>

          {/* Price and Quantity Row */}
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              {originalPrice && originalPrice > price && (
                <Text style={styles.originalPrice}>
                  {formatPrice(originalPrice)}
                </Text>
              )}
              <Text style={styles.currentPrice}>
                {formatPrice(price)}
              </Text>
            </View>

            {/* Quantity Controls */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={handleDecrement}
              >
                <Minus size={16} color={COLORS.DARK} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={handleIncrement}
              >
                <Plus size={16} color={COLORS.DARK} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    // marginHorizontal: 16,
    // marginVertical: 6,
    // borderRadius: 12,
    elevation: 2,
    paddingHorizontal: 8,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.ERROR,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  discountText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK,
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
  },
  favoriteButton: {
    padding: 4,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.GRAY,
    lineHeight: 18,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.GRAY,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.DARK,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK,
    minWidth: 24,
    textAlign: 'center',
    marginHorizontal: 8,
  },
});

export default CartItem;