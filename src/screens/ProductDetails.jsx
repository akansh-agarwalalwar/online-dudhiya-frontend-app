import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';

import ProductHeader from '../components/common/AppHeader';
import ImageCarousel from '../components/core/product/ImageCarousel';
import AccordionItem from '../components/core/product/AccordionItem';
import { Minus, Plus, Star, Truck } from 'lucide-react-native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import { useRoute, useNavigation } from '@react-navigation/native';
import COLORS from '../constants/Color';


import {
  fetchProductDetails,
  fetchRelatedProducts
} from '../redux/thunks/productDetailThunk';
import {
  clearProductDetails,
  setSelectedSize
} from '../redux/slices/productDetailSlice';
import { addToCart, fetchCart, updateCartItem, deleteCartItem } from '../redux/thunks/cartThunk';
import { selectMedicineQuantityInCart } from '../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { calculateDiscount } from '../utils/priceUtils';
import YoutubePlayer from 'react-native-youtube-iframe';

// Simple YouTube frame using WebView. Expects a YouTube video ID.
const YouTubeFrame = ({ videoId = '3yNEPH1NQf4' }) => {
  if (!videoId) return null;

  return (
    <View style={styles.videoWrapper}>
      <YoutubePlayer
        height={220}
        play={false}
        videoId={videoId}
        webViewProps={{
          allowsFullscreenVideo: true,
        }}
      />
    </View>
  );
};

const ProductDetailsScreen = () => {
  const [showShadow, setShowShadow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const route = useRoute();
  const dispatch = useDispatch();
  const { id, product: productFromRoute } = route.params || {};
  const {
    currentProduct,
    selectedSize,
    loading,
    error
  } = useSelector((state) => state.productDetail);
  const navigation = useNavigation();

  const product = currentProduct || productFromRoute;

  // Get quantity from cart for this specific product and size
  const quantityInCart = useSelector((state) =>
    selectMedicineQuantityInCart(
      state,
      product?.id,
      selectedSize?.id
    )
  );

  // Get all cart items
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }

    // Fetch cart to sync state
    dispatch(fetchCart());

    // Cleanup on unmount
    return () => {
      dispatch(clearProductDetails());
    };
  }, [id, dispatch]);


  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchProductDetails(id)).unwrap();
      await dispatch(fetchRelatedProducts(id)).unwrap();
      await dispatch(fetchCart()).unwrap();
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSizeSelect = (size) => {
    dispatch(setSelectedSize(size));
  };

  const handleIncrementQuantity = async () => {
    const cartItem = cartItems.find(item =>
      item.medicine.id === product.id &&
      (selectedSize ? item.sizeId === selectedSize.id : !item.sizeId)
    );

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

  const handleDecrementQuantity = async () => {
    const cartItem = cartItems.find(item =>
      item.medicine.id === product.id &&
      (selectedSize ? item.sizeId === selectedSize.id : !item.sizeId)
    );

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



  const handleAddToCart = async () => {
    if (!product?.id) {
      Alert.alert('Error', 'Product information is missing');
      return;
    }

    // Check if product has sizes and size is selected
    if (product.hasSizes && !selectedSize) {
      Alert.alert('Select Size', 'Please select a size before adding to cart');
      return;
    }

    setAddingToCart(true);

    try {
      const payload = {
        medicineId: product.id,
        quantity: 1,
      };

      // Add sizeId if product has sizes
      if (product.hasSizes && selectedSize) {
        payload.sizeId = selectedSize.id;
      }

      await dispatch(addToCart(payload)).unwrap();

      Alert.alert(
        'Success',
        'Item added to cart successfully',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error || 'Failed to add item to cart. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setAddingToCart(false);
    }
  };
  console.log('Rendering ProductDetailsScreen for product:', product);

  const images = product?.images && Array.isArray(product.images)
    ? product.images.map(img => ({ uri: img.url })).filter(item => item.uri)
    : [];
  console.log('images:', images);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowShadow(scrollY > 10);
  };

  // Clean up duplicate sizes and get unique sizes
  const getUniqueSizes = (sizes) => {
    if (!sizes || !Array.isArray(sizes)) return [];

    const uniqueSizes = sizes.reduce((acc, current) => {
      const existingSize = acc.find(size => size.id === current.id);
      if (!existingSize) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Sort by sortOrder
    return uniqueSizes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  };

  const uniqueSizes = getUniqueSizes(product?.sizes);

  // Set default selected size if none selected and sizes exist
  useEffect(() => {
    if (uniqueSizes.length > 0 && !selectedSize) {
      dispatch(setSelectedSize(uniqueSizes[0]));
    }
  }, [uniqueSizes, selectedSize, dispatch]);

  // Show loading or error state
  if (loading) {
    return (
      <ScreenWrapper bottomSafeArea={true} topSafeArea={false} style={styles.container}>
        <ProductHeader title="Loading..." showBack={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text>Loading product details...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper bottomSafeArea={true} topSafeArea={false} style={styles.container}>
        <ProductHeader title="Error" showBack={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Text>Error: {error}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!product) {
    return (
      <ScreenWrapper bottomSafeArea={true} topSafeArea={false} style={styles.container}>
        <ProductHeader title="Not Found" showBack={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Text>Product not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bottomSafeArea={true} topSafeArea={false} style={styles.container}>
      <ProductHeader title={product.productName || "Product Details"} showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="normal"
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={false}
        scrollToOverflowEnabled={false}
        nestedScrollEnabled={true}
      >

        {/* Image Carousel */}
        <ImageCarousel images={images} medicineId={product?.id} />
        <View style={[styles.stickyHeaderSection, showShadow && styles.stickyHeaderShadow]}>
          <Text style={styles.productName}>{product.productName || 'Product Name'}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.mainPrice}>
              ₹{selectedSize?.salePrice || product.salePrice || 139}
            </Text>
            <Text style={styles.strikePrice}>
              ₹{selectedSize?.mrp || product.mrp || 155}
            </Text>
            <Text style={styles.off}>
              {calculateDiscount(selectedSize?.mrp || product.mrp || 155, selectedSize?.salePrice || product.salePrice || 139)}% OFF
            </Text>
          </View>
          {
            uniqueSizes.length > 0 && (
              <>
                <Text style={{ fontSize: 14, fontWeight: '500', marginRight: 12, marginTop: 28 }}>
                  Selected Size: {selectedSize?.sizeName}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>

                  {uniqueSizes.map((size) => (
                    <TouchableOpacity
                      key={size.id}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: selectedSize?.id === size.id ? COLORS.PRIMARY : '#ccc',
                        backgroundColor: selectedSize?.id === size.id ? COLORS.PRIMARY : '#fff',
                        marginRight: 8,
                        marginTop: 4,
                        opacity: size.inStock ? 1 : 0.5,
                      }}
                      onPress={() => size.inStock && handleSizeSelect(size)}
                      disabled={!size.inStock}
                    >
                      <Text style={{
                        color: selectedSize?.id === size.id ? '#fff' : '#000',
                        fontSize: 14,
                        fontWeight: '350'
                      }}>
                        {size.sizeName}
                      </Text>
                      {!size.inStock && (
                        <Text style={{
                          color: '#999',
                          fontSize: 10,
                          textAlign: 'center',
                          marginTop: 2
                        }}>
                          Out of Stock
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )
          }
        </View>

        {/* Ratings */}
        {/* <View style={styles.ratingBox}>
          <Text style={styles.rating}>3.5 <Star size={20} backgroundColor={'#f5e52fff'} color={'#f5e52fff'}/></Text>
          <Text style={styles.reviewCount}>413 Ratings & 33 Reviews</Text>
        </View> */}

        {/* Tomorrow Morning Delivery */}
        {
          product.typeOfMedicine === "Yes" && (
            <View style={styles.deliveryBox}>
              <Truck size={24} color={'#173945ff'} />
              <Text style={styles.deliveryText}> Tomorrow Morning Delivery</Text>
            </View>
          )
        }


        {/* Accordions for Product Info */}

        {product.description && (
          <AccordionItem
            title="About the Product"
            content={product.description || 'No description available.'}
            defaultOpen={true}
          />
        )}
        {product.howToUse && (
          <AccordionItem
            title="How to Use"
            content={product.howToUse || 'No usage information available.'}
          />
        )}
        {product.howItWorks && (
          <AccordionItem
            title="Benefits of the Product"
            content={product.howItWorks || 'No information available.'}
          />
        )}

        <AccordionItem
          title="Other Product Info"
          content={` Shelf Life: ${product?.productCode}\nProduct Origin : ${product?.productCompany || 'N/A'}\nStorage Instructions: ${product?.storageInstructions || 'N/A'}`}
        />

        {/* Ratings & Reviews */}
        {/* <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Ratings & Reviews</Text>
          <View style={styles.ratingRowMain}>
            <Text style={styles.ratingMainValue}>3.5</Text>
            <Star size={32} color="#b2b85cff" style={{ marginLeft: 4 }} />
          </View>
          <Text style={styles.ratingCount}>414 ratings & 33 reviews</Text>
        </View> */}

        {/* YouTube video frame (placed at the bottom of the scroll content) */}
        {/* <YouTubeFrame videoId={product.youtubeId || product.videoId} /> */}

        {/* Highlights */}
        {/* <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Highlights</Text>
          <View style={styles.ratingRow}>
            <CircularRating value="3" label="Taste" count="57" />
            <CircularRating value="3.4" label="Packaging & Presentation" count="55" />
          </View>
        </View>

        <View style={{ height: 80 }} /> */}
      </ScrollView>

      {/* Footer Buy */}
      <View style={styles.bottomBar}>
        {quantityInCart === 0 ? (
          <TouchableOpacity
            style={styles.subscribeBtn}
            onPress={handleAddToCart}
            disabled={addingToCart}
          >
            <Text style={styles.subscribeText}>
              {addingToCart ? 'Adding...' : `Add To Bag @ ₹${selectedSize?.salePrice || product.price || 139}`}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bottomBarWithQuantity}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={handleDecrementQuantity}
              >
                <Text style={styles.quantityBtnText}><Minus size={24} color="#000" /></Text>
              </TouchableOpacity>

              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantityInCart}</Text>
              </View>

              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={handleIncrementQuantity}
              >
                <Text style={styles.quantityBtnText}><Plus size={24} color="#000" /></Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Cart')}
            >
              <Text style={styles.checkoutText}>Go to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </ScreenWrapper>
  );
};

export default ProductDetailsScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', position: 'relative' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  stickyHeaderSection: {
    padding: 16,
    marginTop: -10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 10,
  },
  stickyHeaderShadow: {
    elevation: 2,
    shadowColor: '#0000003d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.005,
    shadowRadius: 8,
  },
  scrollView: { flex: 1, paddingBottom: 200 },
  productName: { fontSize: 18, fontWeight: '500', color: '#222', marginBottom: 4 },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  mainPrice: { fontSize: 20, fontWeight: '600', color: '#000' },
  strikePrice: {
    fontSize: 16,
    marginLeft: 8,
    textDecorationLine: 'line-through',
    color: '#777',
  },
  off: { fontSize: 14, marginLeft: 8, color: '#00000', fontWeight: '400', backgroundColor: '#fcbf3a', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 14 },

  taxText: { fontSize: 12, color: '#777', marginTop: 4 },

  ratingBox: { padding: 16 },
  rating: { fontSize: 20, fontWeight: '700', color: '#222', flexDirection: 'row', alignItems: 'center', gap: 4 },
  reviewCount: { color: '#555', marginTop: 4 },

  deliveryBox: { padding: 16, backgroundColor: '#f4f4f4', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 },
  deliveryText: { fontSize: 14, color: '#444', flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingSection: { padding: 16, backgroundColor: '#fff' },
  ratingTitle: { fontSize: 18, fontWeight: '600', color: '#222', marginBottom: 8 },
  ratingRowMain: { flexDirection: 'row', alignItems: 'center' },
  ratingMainValue: { fontSize: 36, fontWeight: '700', color: '#b8b25cff' },
  ratingCount: { color: '#555', marginTop: 4, fontSize: 16 },

  summarySection: { padding: 16 },
  summaryTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },

  ratingRow: { flexDirection: 'row', marginTop: 12 },
  circleBox: { alignItems: 'center', marginRight: 40 },
  circleOuter: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e0e0e0',
    borderWidth: 2,
  },
  circleValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5cb85c',
  },
  circleLabel: { marginTop: 6, color: '#444', fontSize: 14 },
  circleCount: { marginTop: 2, color: '#888', fontSize: 12 },

  bottomBar: {
    // position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    elevation: 10,
    borderTopWidth: 1,
    padding: 16,
    borderTopColor: '#eee',
  },
  buyOnceBtn: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeBtn: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 16,
    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',
  },
  buyText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  subscribeText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  bottomBarWithQuantity: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  quantityContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.PRIMARY_DARK,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  checkoutBtn: {
    flex: 1,
    backgroundColor: '#4caf00ff',
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  quantityDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  videoWrapper: {
    height: 220,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
});
