import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import RatingBadge from "./RatingBadge";
import SizeSelector from "./SizeSelector";
import { calculateDiscount } from "../../../utils/priceUtils";
import COLORS from "../../../constants/Color";
import LikeButton from "../../common/LikeButton";
import AddToBagButton from "../../common/AddToBagButton";
import { addToCart, updateCartItem, deleteCartItem } from "../../../redux/thunks/cartThunk";
import { selectMedicineQuantityInCart } from "../../../redux/slices/cartSlice";

const { height } = Dimensions.get('window');

const ProductCardPage = ({ product = {} }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedSize, setSelectedSize] = useState(
    Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));

  // Get quantity from cart for this specific product and size
  const quantity = useSelector((state) =>
    selectMedicineQuantityInCart(
      state,
      product.id,
      selectedSize?.id
    )
  );

  // Get cart items to find the specific cart item
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find(item =>
    item.medicine.id === product.id &&
    (selectedSize ? item.sizeId === selectedSize.id : !item.sizeId)
  );

  const discountPercent = calculateDiscount(
    product.mrp,
    product.sale_price
  );

  const displayMrp = selectedSize ? selectedSize.mrp : product.mrp;
  const displaySalePrice = selectedSize ? selectedSize.salePrice : product.sale_price;

  const handleNavigateToDetails = () => {
    navigation.navigate('ProductDetails', {
      productfromRoute: product,
      id: product.id
    });
  };

  // Open size modal with animation
  const openSizeModal = () => {
    setShowSizeModal(true);
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  // Close size modal with animation
  const closeSizeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setShowSizeModal(false));
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product?.id) {
      Alert.alert('Error', 'Product information is missing');
      return;
    }

    // Check if product has sizes array with items
    const productSizes = product.sizes || [];

    console.log('Product sizes array:', productSizes);
    console.log('Product ID:', product.id);

    // If product has sizes, show size selector modal
    if (productSizes.length > 0) {
      console.log('Opening size modal - product has', productSizes.length, 'sizes');
      openSizeModal();
      return;
    }

    // Product doesn't have sizes, add directly
    console.log('Adding product without size - no sizes available');
    try {
      const payload = {
        medicineId: product.id,
        quantity: 1,
        product: product,
      };

      await dispatch(addToCart(payload)).unwrap();
    } catch (error) {
      Alert.alert('Error', error || 'Failed to add item to cart');
    }
  };

  // Handle add to cart with selected size
  const handleAddToCartWithSize = async (size) => {
    try {
      const payload = {
        medicineId: product.id,
        quantity: 1,
        sizeId: size.id,
        product: product,
      };

      await dispatch(addToCart(payload)).unwrap();
      closeSizeModal();
      setSelectedSize(size); // Update selected size for display
    } catch (error) {
      Alert.alert('Error', error || 'Failed to add item to cart');
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (newQuantity) => {
    if (!cartItem) return;

    try {
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
  };

  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const backdropOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  // Wrap the card in TouchableOpacity for navigation
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleNavigateToDetails}
      >
        <View style={styles.card}>
          {/* Product Row */}
          <View style={styles.row}>
            {/* IMAGE */}
            <Image source={{ uri: product.images[0] }} style={styles.image} />

          </View>
          <View style={{ position: 'absolute', top: 10, right: '10' }}>
            <LikeButton
              medicineId={product.id}
              size={24}
              color="#E91E63"
              onToggle={(value) => {
                console.log("🔷 ProductCardPage - Liked status:", value, "for product:", product.id, product.product_name);
              }}
            />
          </View>


          <View style={[styles.infoSection, quantity > 0 && styles.infoSectionColumn]}>

            {/* TITLE */}
            <Text style={[styles.title, quantity > 0 && { width: '100%' }]} numberOfLines={2} ellipsizeMode="tail">
              {product.product_name}
            </Text>
            <AddToBagButton
              label="Add to Cart"
              backgroundColor="#4CAF50"
              externalQuantity={quantity}
              onQuantityChange={handleQuantityChange}
              onPress={handleAddToCart}
            />
          </View>
          {
            product.has_sizes && (
              <>
                <Text style={{ fontSize: 12, color: '#555', paddingHorizontal: 12, marginBottom: 8 }}>Available Sizes:</Text>
                <SizeSelector
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSelectSize={(size) => setSelectedSize(size)}
                />
              </>
            )
          }
          {/* PRICE SECTION */}
          <View style={styles.priceRow}>
            <Text style={styles.offerPrice}>Rs. {displaySalePrice}</Text>
            <Text style={styles.actualPrice}>Rs. {displayMrp}</Text>

          </View>
        </View>
        {discountPercent > 0 && (
          <Text style={styles.discountText}>{discountPercent}% OFF</Text>
        )}
      </TouchableOpacity>

      {/* Size Selector Modal */}
      <Modal
        visible={showSizeModal}
        transparent
        animationType="none"
        onRequestClose={closeSizeModal}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.modalBackdrop, { opacity: backdropOpacity }]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={closeSizeModal}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalTranslateY }] }
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Select Size</Text>
              <Text style={styles.modalSubtitle}>{product.product_name}</Text>
            </View>

            <ScrollView style={styles.sizesContainer}>
              {product.sizes?.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.sizeOption,
                    !size.inStock && styles.sizeOptionDisabled
                  ]}
                  onPress={() => size.inStock && handleAddToCartWithSize(size)}
                  disabled={!size.inStock}
                >
                  <View style={styles.sizeInfo}>
                    <Text style={styles.sizeName}>{size.sizeName}</Text>
                    {!size.inStock && (
                      <Text style={styles.outOfStockText}>Out of Stock</Text>
                    )}
                  </View>
                  <View style={styles.sizePriceContainer}>
                    <Text style={styles.sizePrice}>₹{size.salePrice}</Text>
                    {size.mrp !== size.salePrice && (
                      <Text style={styles.sizeMrp}>₹{size.mrp}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeSizeModal}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default ProductCardPage;


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // padding: 12,
    borderRadius: 12,
    // elevation: 2,
  },

  row: { flexDirection: "row" },
  image: { width: '100%', height: 150, resizeMode: "cover", borderRadius: 6 },

  infoSection: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, paddingHorizontal: 12 },

  infoSectionColumn: { flexDirection: 'column', gap: 8, alignItems: 'flex-start' },

  brandCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8
  },
  brandText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase"
  },
  categoryText: {
    fontSize: 10,
    color: "#888",
    fontStyle: "italic"
  },

  title: { fontSize: 16, fontWeight: "700", color: "#222", lineHeight: 22, width: '70%' },

  description: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    lineHeight: 18
  },

  deliveryTime: {
    fontSize: 12,
    color: "#2E7D32",
    marginTop: 4,
    fontWeight: "600"
  },

  priceRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingBottom: 8 },
  offerPrice: { fontSize: 16, fontWeight: "500", color: COLORS.BLACK },
  actualPrice: {
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "400",
    color: "#888",
    textDecorationLine: "line-through",
  },
  discountText: {
    marginLeft: 8,
    color: "black",
    backgroundColor: "#FBD248",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: "700",
    position: 'absolute',
    left: 12,
    top: 8,
    fontSize: 12,
  },

  btnRow: { flexDirection: "row", marginTop: 12 },

  buyOnceBtn: {
    width: "40%",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buyOnceText: { color: "#555" },

  subscribeBtn: {
    width: "100%",
    backgroundColor: COLORS.PRIMARY,
    marginLeft: 8,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  subscribeText: { color: "#FFF", fontWeight: "700" },

  outOfStockBtn: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockText: { color: "#999", fontWeight: "600" },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sizesContainer: {
    maxHeight: height * 0.4,
  },
  sizeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sizeOptionDisabled: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
  },
  sizeInfo: {
    flex: 1,
  },
  sizeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  sizePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sizePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  sizeMrp: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  closeButton: {
    margin: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

