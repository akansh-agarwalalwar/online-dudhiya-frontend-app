import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Minus, ShoppingCart } from 'lucide-react-native';
import { formatPrice } from '../../utils/priceUtils';
import COLORS from '../../constants/Color';

/**
 * AddToCartBar Component
 * Sticky bottom bar for adding product to cart
 */
const AddToCartBar = ({ 
  price, 
  onAddToCart, 
  inStock = true,
  loading = false 
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart && inStock) {
      onAddToCart(quantity);
    }
  };

  return (
    <View style={styles.container}>
      {/* Quantity Selector */}
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Quantity</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={handleDecrement}
            style={[styles.quantityButton, quantity === 1 && styles.disabledButton]}
            disabled={quantity === 1}
          >
            <Minus size={18} color={quantity === 1 ? '#ccc' : '#333'} />
          </TouchableOpacity>

          <Text style={styles.quantityValue}>{quantity}</Text>

          <TouchableOpacity
            onPress={handleIncrement}
            style={styles.quantityButton}
          >
            <Plus size={18} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add to Cart Button */}
      <TouchableOpacity
        onPress={handleAddToCart}
        style={[
          styles.addToCartButton,
          !inStock && styles.disabledCartButton,
          loading && styles.loadingButton,
        ]}
        disabled={!inStock || loading}
      >
        <ShoppingCart size={20} color="#fff" />
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonText}>
            {!inStock ? 'Out of Stock' : loading ? 'Adding...' : 'Add to Cart'}
          </Text>
          {inStock && price && (
            <Text style={styles.buttonPrice}>₹{formatPrice(price * quantity)}</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AddToCartBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    gap: 12,
  },
  quantityContainer: {
    flex: 0.4,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 0.6,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
    gap: 8,
  },
  disabledCartButton: {
    backgroundColor: '#ccc',
  },
  loadingButton: {
    opacity: 0.7,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPrice: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
});
