import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Plus, Minus, Icon } from 'lucide-react-native';
import Sizebadge from '../product/Sizebadge';
const ProductCard = ({ product }) => {
  const [count, setCount] = useState(0);

  if (!product) {
    return null;
  }

  const {
    productImage,
    offerPrice,
    actualPrice,
    title,
    isVeg,
    sizes = []
  } = product;

  // Calculate discount percentage
  const discountPercent = actualPrice && offerPrice 
    ? Math.round(((actualPrice - offerPrice) / actualPrice) * 100)
    : 0;

  const discount = discountPercent > 0 ? `${discountPercent}% OFF` : null;
  const defaultSize = sizes[0] || "1 unit";

  // Handle add and remove functions
  const handleAdd = () => {
    setCount(prevCount => prevCount + 1);
  };

  const handleRemove = () => {
    setCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
  };

  return (
    <View style={styles.cardContainer}>
      
      {/* Discount Badge */}
      {discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}</Text>
        </View>
      )}

      {/* Product Image */}
      <Image 
        source={{ uri: productImage }} 
        style={styles.productImage}
        defaultSource={require('../../../assets/images/product/milk.png')}
      />

      {/* Volume Badge */}
      {/* <View style={styles.volumeBadge}> */}
      <Sizebadge
        size={50}
        text={defaultSize}
        bgColor="#E53935"
        textColor="#fff"
        style={styles.volumeBadge}
      />
      {/* </View> */}

      {/* Veg / Non-Veg Mark */}
      <View style={styles.vegMarkBorder}>
        <View style={[styles.vegDot, { backgroundColor: isVeg ? 'green' : 'red' }]} />
      </View>


      {/* Product Title */}
      <Text numberOfLines={2} style={styles.titleText}>
        {title}
      </Text>

      {/* Render sizes in a flex row, separated by commas, show only 2, and '+N' if more */}
      {sizes.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
          {sizes.slice(0, 2).map((size, idx) => (
            <React.Fragment key={idx}>
              <Text style={styles.volumeSubText}>{size}</Text>
              {idx < Math.min(1, sizes.length - 1) && (
                <Text style={styles.volumeSubText}>, </Text>
              )}
            </React.Fragment>
          ))}
          {sizes.length > 2 && (
            <Text style={styles.volumeSubText}>+{sizes.length - 2}</Text>
          )}
        </View>
      )}

      {/* Price Row */}
      <View style={styles.priceRow}>
        <Text style={styles.offerPrice}>₹{offerPrice}</Text>
        <Text style={styles.actualPrice}>₹{actualPrice}</Text>
      </View>
      {/* Add / Remove Buttons */}
      <View style={styles.actionRow}>
        {count === 0 ? (
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>
              <Plus size={16} color="#00cd5cff" />
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.counterBox}>
            <TouchableOpacity style={styles.iconButton} onPress={handleRemove}>
              <Minus size={18} color="#000" />
            </TouchableOpacity>

            <Text style={styles.countText}>{count}</Text>

            <TouchableOpacity style={styles.iconButton} onPress={handleAdd}>
              <Plus size={18} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>

    </View>
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
    height:"auto",
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
    right:10,
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
