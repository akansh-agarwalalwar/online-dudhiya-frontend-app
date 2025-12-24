import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus, Icon } from 'lucide-react-native';
import Sizebadge from '../product/Sizebadge';
import { calculateDiscount, getBestDiscount, getPrimarySize, formatPrice } from '../../../utils/priceUtils';
import { addToCart, updateCartItem, deleteCartItem } from '../../../redux/thunks/cartThunk';
import { selectMedicineQuantityInCart } from '../../../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  if (!product) {
    return null;
  }

  console.log(product, 'at product card');

  // Handle new data structure
  const {
    images = [],
    title,
    isVeg = "Yes",
    sizes = [],
    has_sizes,
    mrp: fallbackMrp,
    sale_price: fallbackSalePrice,
    packaging_size,
    id
  } = product;

  // Get primary image
  const productImage = images && images.length > 0 ? images[0] : null;

  // Determine pricing based on whether product has sizes
  let displayPrice, displayMrp, discountPercent, primarySizeName, primarySize;

  if (has_sizes && sizes.length > 0) {
    // Product has sizes - use primary size pricing
    primarySize = getPrimarySize(sizes);
    displayPrice = primarySize?.salePrice;
    displayMrp = primarySize?.mrp;
    primarySizeName = primarySize?.sizeName;
    discountPercent = calculateDiscount(displayMrp, displayPrice);
  } else {
    // Product doesn't have sizes - use fallback pricing
    displayPrice = fallbackSalePrice;
    displayMrp = fallbackMrp;
    primarySizeName = packaging_size || "1 unit";
    discountPercent = calculateDiscount(displayMrp, displayPrice);
  }

  const discount = discountPercent > 0 ? `${discountPercent}% OFF` : null;

  // Get quantity from cart
  const count = useSelector((state) =>
    selectMedicineQuantityInCart(
      state,
      id,
      primarySize?.id
    )
  );

  // Get cart items to find the specific cart item
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find(item =>
    item.medicine.id === id &&
    (primarySize ? item.sizeId === primarySize.id : !item.sizeId)
  );

  // Handle add function
  const handleAdd = async (e) => {
    e?.stopPropagation();

    try {
      const payload = {
        medicineId: id,
        quantity: 1,
      };

      // Add sizeId if product has sizes
      if (has_sizes && primarySize) {
        payload.sizeId = primarySize.id;
      }

      await dispatch(addToCart(payload)).unwrap();
    } catch (error) {
      Alert.alert('Error', error || 'Failed to add item to cart');
    }
  };

  // Handle increment
  const handleIncrement = async (e) => {
    e?.stopPropagation();

    if (cartItem) {
      try {
        await dispatch(updateCartItem({
          itemId: cartItem.id,
          quantity: cartItem.quantity + 1
        })).unwrap();
      } catch (error) {
        Alert.alert('Error', 'Failed to update quantity');
      }
    }
  };

  // Handle decrement/remove
  const handleRemove = async (e) => {
    e?.stopPropagation();

    if (cartItem) {
      try {
        const newQuantity = cartItem.quantity - 1;
        if (newQuantity > 0) {
          await dispatch(updateCartItem({
            itemId: cartItem.id,
            quantity: newQuantity
          })).unwrap();
        } else {
          await dispatch(deleteCartItem(cartItem.id)).unwrap();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update quantity');
      }
    }
  };

  const handleNavigateToDetails = () => {
    navigation.navigate('ProductDetails', {
      productfromRoute: product,
      id: id
    });
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={handleNavigateToDetails}
    >

      {/* Discount Badge */}
      {discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}</Text>
        </View>
      )}

      {/* Product Image */}
      {productImage ? (
        <Image
          source={{ uri: productImage }}
          style={styles.productImage}
          defaultSource={require('../../../assets/images/product/milk.png')}
        />
      ) : (
        <Image
          source={require('../../../assets/images/product/milk.png')}
          style={styles.productImage}
        />
      )}

      {/* Volume Badge */}
      {primarySizeName && (
        <Sizebadge
          size={50}
          text={primarySizeName}
          bgColor="#E53935"
          textColor="#fff"
          style={styles.volumeBadge}
        />
      )}

      {/* Veg / Non-Veg Mark */}
      <View style={styles.vegMarkBorder}>
        <View style={[styles.vegDot, { backgroundColor: isVeg === "Yes" ? 'green' : 'red' }]} />
      </View>


      {/* Product Title */}
      <Text numberOfLines={2} style={styles.titleText}>
        {title}
      </Text>

      {/* Render sizes in a flex row, separated by commas, show only 2, and '+N' if more */}
      {has_sizes && sizes.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
          {sizes.slice(0, 2).map((size, idx) => (
            <React.Fragment key={size.id || idx}>
              <Text style={styles.volumeSubText}>{size.sizeName}</Text>
              {idx < Math.min(1, sizes.length - 1) && (
                <Text style={styles.volumeSubText}>, </Text>
              )}
            </React.Fragment>
          ))}
          {sizes.length > 2 && (
            <Text style={styles.volumeSubText}> +{sizes.length - 2}</Text>
          )}
        </View>
      )}

      {/* Price Row */}
      <View style={styles.priceRow}>
        {displayPrice && (
          <Text style={styles.offerPrice}>₹{formatPrice(displayPrice)}</Text>
        )}
        {displayMrp && displayMrp !== displayPrice && (
          <Text style={styles.actualPrice}>₹{formatPrice(displayMrp)}</Text>
        )}
        {!displayPrice && !displayMrp && (
          <Text style={styles.offerPrice}>Price on request</Text>
        )}
      </View>
      {/* Add / Remove Buttons */}
      <View style={styles.actionRow} onStartShouldSetResponder={() => true}>
        {count === 0 ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAdd}
          >
            <Text style={styles.addButtonText}>
              <Plus size={16} color="#00cd5cff" />
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.counterBox}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleRemove}
            >
              <Minus size={18} color="#000" />
            </TouchableOpacity>

            <Text style={styles.countText}>{count}</Text>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleIncrement}
            >
              <Plus size={18} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>

    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    margin: 10,
    elevation: 4,
    overflow: 'hidden',
  },

  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomRightRadius: 14,
    zIndex: 5,
  },

  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },

  volumeBadge: {
    position: 'absolute',
    top: 130,
    right: 10,
    zIndex: 5,
  },

  volumeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  vegMarkBorder: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: 'green',
    position: 'absolute',
    top: 15,
    right: 15,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  vegDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },

  infoBar: {
    backgroundColor: '#000',
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginTop: -5,
  },

  infoText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },



  titleText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },

  volumeSubText: {
    marginTop: 4,
    color: '#777',
    fontSize: 13,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },

  offerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  actualPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },

  actionRow: {
    marginTop: 8,
    alignItems: 'center',
  },

  addButton: {
    backgroundColor: '#e5e5e5ff',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
    position: 'absolute',
    right: 10,
    bottom: 10,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#1ced00ff',
    fontSize: 14,
    fontWeight: '700',
  },

  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: '100%',
  },

  iconButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 2,
  },

  countText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    minWidth: 30,
    textAlign: 'center',
  },
});
