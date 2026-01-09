import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import {
  CartHeader,
  DeliveryToggle,
  CartItem,
  CheckoutButton,
  EmptyCart,
} from '../components/cart';
import AddressCard from '../components/common/AddressCard';
import COLORS from '../constants/Color';
import {
  fetchCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from '../redux/thunks/cartThunk';
import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotalPrice,
  selectCartLoading,
  selectDeliveryOption,
  setDeliveryOption,
} from '../redux/slices/cartSlice';
import {
  fetchAddresses,
  deleteAddress,
  setDefaultAddress,
  fetchUserProfile,
} from '../redux/slices/userSlice';
import {
  selectDefaultAddress,
  selectUserAddresses,
  selectUserLoading,
  selectUserProfile,
} from '../redux/slices/userSlice';
import { setRedirectScreen } from '../redux/slices/authSlice';
import { createProductOrder } from '../redux/thunks/orderThunk';
import paymentService from '../services/paymentService';
import commonService from '../services/commonService';

const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux state
  const { isAuthenticated, isGuest } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartItemsCount);
  const totalAmount = useSelector(selectCartTotalPrice);
  const isLoading = useSelector(selectCartLoading);
  const deliveryOption = useSelector(selectDeliveryOption);
  const defaultAddress = useSelector(selectDefaultAddress);
  const addresses = useSelector(selectUserAddresses);
  const isAddressLoading = useSelector(selectUserLoading);
  const userProfile = useSelector(selectUserProfile);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Online'); // 'Online' or 'COD'
  const [deliveryChargeData, setDeliveryChargeData] = useState(null);
  const [deliveryChargeInfo, setDeliveryChargeInfo] = useState({
    amount: 0,
    isFree: true,
    message: 'Free Delivery',
  });

  // Fetch cart on mount, fetch user data only if logged in
  useEffect(() => {
    dispatch(fetchCart());

    if (isAuthenticated && !isGuest) {
      dispatch(fetchAddresses());
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, isGuest]);

  // Fetch delivery charge configuration
  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      try {
        const result = await commonService.getDeliveryCharge();
        setDeliveryChargeData(result.data);
      } catch (error) {
        console.error('Failed to fetch delivery charge:', error);
        // Set default values if fetch fails
        setDeliveryChargeData(null);
      }
    };

    fetchDeliveryCharge();
  }, []);

  // Calculate delivery charge whenever cart total or delivery charge data changes
  useEffect(() => {
    if (deliveryChargeData) {
      const chargeInfo = commonService.calculateDeliveryCharge(totalAmount, deliveryChargeData);
      setDeliveryChargeInfo(chargeInfo);
    }
  }, [totalAmount, deliveryChargeData]);

  // Handle quantity change
  const handleQuantityChange = useCallback(async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      await dispatch(updateCartItem({ itemId, quantity: newQuantity })).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity');
    }
  }, [dispatch]);

  // Handle remove item
  const handleRemoveItem = useCallback(async (itemId) => {
    try {
      await dispatch(deleteCartItem(itemId)).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
    }
  }, [dispatch]);

  // Handle toggle favorite (not implemented in backend yet)
  const handleToggleFavorite = useCallback((itemId) => {
    // TODO: Implement favorite functionality when backend supports it
    console.log('Toggle favorite:', itemId);
  }, []);

  // Handle clear cart
  const handleClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(clearCart()).unwrap();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cart');
            }
          },
        },
      ]
    );
  }, [dispatch]);

  // Handle Razorpay Payment
  const handleRazorpayPayment = async (orderId, orderData) => {
    try {
      // Initiate payment and get Razorpay order
      const paymentResponse = await paymentService.initiatePayment(orderId);
      const { order: razorpayOrder, key: keyId } = paymentResponse.data;
      console.log('Razorpay Order:', razorpayOrder);
      console.log('Key ID:', keyId);

      // Prepare Razorpay options
      const razorpayOptions = {
        description: `Order #${orderData.orderNo}`,
        image: 'https://res.cloudinary.com/dpl04mydd/image/upload/v1766058200/logowbg_hojgqn.png', // Your logo URL
        currency: 'INR',
        key: keyId,
        amount: razorpayOrder.amount,
        order_id: razorpayOrder.id,
        name: 'Online Dhudhiya',
        prefill: {
          email: userProfile?.email || '',
          contact: userProfile?.phone_number || userProfile?.phone || '',
          name: userProfile?.name || userProfile?.profile?.name || '',
        },
        theme: { color: COLORS.PRIMARY },
      };

      // Open Razorpay checkout
      const paymentResult = await RazorpayCheckout.open(razorpayOptions);

      // Verify payment
      const verificationData = {
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_signature: paymentResult.razorpay_signature,
      };

      await paymentService.verifyPayment(verificationData, orderId);
      dispatch(clearCart());

      // Payment successful
      Alert.alert(
        'Payment Successful',
        'Your order has been placed successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('OrderConfirmation', { orderId });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Payment error:', error);

      // Handle payment cancellation
      if (error.code === RazorpayCheckout.PAYMENT_CANCELLED) {
        Alert.alert(
          'Payment Cancelled',
          'You cancelled the payment. Your order is saved and you can complete payment later.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('MyOrders');
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Payment Failed',
          error.message || 'Payment failed. Please try again.',
          [
            {
              text: 'Retry',
              onPress: () => handleRazorpayPayment(orderId, orderData),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      }
    }
  };

  // Handle checkout
  const handleCheckout = useCallback(async () => {
    try {
      setIsCheckoutLoading(true);

      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        Alert.alert('Empty Cart', 'Your cart is empty. Add items to continue.');
        setIsCheckoutLoading(false);
        return;
      }

      // Validate user profile completion / Guest check
      if (isGuest || !isAuthenticated || !userProfile) {
        Alert.alert(
          'Login Required',
          'Please login to place an order.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Login',
              onPress: () => {
                dispatch(setRedirectScreen('Cart'));
                navigation.navigate('Login');
              },
            },
          ]
        );
        setIsCheckoutLoading(false);
        return;
      }
      // Validate address
      if (!defaultAddress) {
        Alert.alert('Address Required', 'Please add a delivery address to continue.');
        setIsCheckoutLoading(false);
        return;
      }

      // Check if profile is complete
      // const missingFields = [];
      // if (!userProfile.email || !userProfile.email.trim()) {
      //   missingFields.push('Email');
      // }
      // if (!userProfile.customer?.gender) {
      //   missingFields.push('Gender');
      // }
      // if (!userProfile.customer?.dob) {
      //   missingFields.push('Date of Birth');
      // }

      // if (missingFields.length > 0) {
      //   Alert.alert(
      //     'Complete Your Profile',
      //     `Please complete your profile to place an order. Missing fields: ${missingFields.join(', ')}`,
      //     [
      //       {
      //         text: 'Complete Profile',
      //         onPress: () => {
      //           navigation.navigate('Profile');
      //         },
      //       },
      //       {
      //         text: 'Cancel',
      //         style: 'cancel',
      //       },
      //     ]
      //   );
      //   setIsCheckoutLoading(false);
      //   return;
      // }

      // Prepare order data
      console.log('Cart Items:', JSON.stringify(cartItems, null, 2));
      console.log('Default Address:', JSON.stringify(defaultAddress, null, 2));

      const orderData = {
        deliveryAddress: {
          name: defaultAddress.name || '',
          phone_number: defaultAddress.phoneNumber || defaultAddress.phone_number || '',
          address_line_1: defaultAddress.addressLine1 || defaultAddress.address_line_1 || '',
          address_line_2: defaultAddress.addressLine2 || defaultAddress.address_line_2 || '',
          city_district: defaultAddress.cityDistrict || defaultAddress.city_district || '',
          pincode: defaultAddress.pincode || '',
          state: defaultAddress.state || '',
        },
        items: cartItems.map(item => {
          const medicineId = item.medicineId || item.medicine?.id || item.id;
          console.log('Item mapping:', {
            original: item,
            medicineId,
            sizeId: item.sizeId || item.size?.id
          });
          return {
            medicineId: medicineId,
            quantity: item.quantity,
            sizeId: item.sizeId || item.size?.id || null,
          };
        }),
        discountAmount: 0, // TODO: Implement discount logic
        prescription: [], // TODO: Implement prescription upload if needed
        familyMemberIds: [],
        paymentMethod: paymentMethod,
        paymentLink: false,
      };

      console.log('Order Data:', JSON.stringify(orderData, null, 2));


      // Create order
      const orderResult = await dispatch(createProductOrder(orderData)).unwrap();

      // Handle payment based on method
      if (paymentMethod === 'Online') {
        // Initiate Razorpay payment
        await handleRazorpayPayment(orderResult.id, orderResult);
      } else {
        // COD order - navigate directly to confirmation
        Alert.alert(
          'Order Placed',
          'Your order has been placed successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('OrderConfirmation', { orderId: orderResult.id });
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert(
        'Order Failed',
        error.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  }, [navigation, defaultAddress, cartItems, paymentMethod, dispatch, userProfile]);

  // Handle back navigation
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle start shopping
  const handleStartShopping = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  // Handle delivery option change
  const handleDeliveryOptionChange = useCallback((option) => {
    dispatch(setDeliveryOption(option));
  }, [dispatch]);

  // Handle address actions
  const handleEditAddress = useCallback((addressId) => {
    // Validate user profile completion / Guest check
    if (isGuest || !isAuthenticated || !userProfile) {
      Alert.alert(
        'Login Required',
        'Please login to place an order.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Login',
            onPress: () => {
              dispatch(setRedirectScreen('Cart'));
              navigation.navigate('Login');
            },
          },
        ]
      );
      return;
    }
    navigation.navigate('ManageAddress', { editAddressId: addressId });
  }, [navigation, isGuest, isAuthenticated, userProfile, dispatch]);

  const handleDeleteAddress = useCallback(async (addressId) => {
    // Validate user profile completion / Guest check
    if (isGuest || !isAuthenticated || !userProfile) {
      Alert.alert(
        'Login Required',
        'Please login to place an order.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Login',
            onPress: () => {
              dispatch(setRedirectScreen('Cart'));
              navigation.navigate('Login');
            },
          },
        ]
      );
      return;
    }
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteAddress(addressId)).unwrap();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  }, [dispatch]);

  const handleSetDefaultAddress = useCallback(async (addressId) => {
    try {
      await dispatch(setDefaultAddress(addressId)).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to set default address');
    }
  }, [dispatch]);

  const handleChangeAddress = useCallback(() => {
    // Navigate to address selection/management screen
    if (isGuest || !isAuthenticated || !userProfile) {
      Alert.alert(
        'Login Required',
        'Please login to place an order.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Login',
            onPress: () => {
              dispatch(setRedirectScreen('Cart'));
              navigation.navigate('Login');
            },
          },
        ]
      );
      return;
    }
    navigation.navigate('ManageAddress');
  }, [navigation]);

  // Transform cart items to match CartItem component expected format
  const transformedCartItems = useMemo(() => {
    return cartItems.map(item => {
      // Handle both API (populated size) and Guest/Local (sizeId only)
      let sizeObj = item.size;
      if (!sizeObj && item.sizeId && item.medicine?.sizes) {
        sizeObj = item.medicine.sizes.find(s => s.id === item.sizeId);
      }

      // Build description
      let description = '';
      const packaging = item.medicine.packagingSize || item.medicine.packaging_size || '';

      if (sizeObj) {
        const sizeName = sizeObj.sizeName || sizeObj.size_name || '';
        if (packaging && sizeName) {
          description = `${packaging} - ${sizeName}`;
        } else if (packaging) {
          description = packaging;
        } else if (sizeName) {
          description = sizeName;
        }
      } else {
        description = item.medicine.description || packaging || 'No description';
      }

      const price = parseFloat(sizeObj?.salePrice || sizeObj?.sale_price || item.medicine.salePrice || item.medicine.sale_price || 0);
      const originalPrice = parseFloat(sizeObj?.mrp || item.medicine.mrp || 0);

      return {
        id: item.id,
        name: item.medicine.productName || item.medicine.product_name || item.medicine.title || 'Product',
        description: description,
        price: price,
        originalPrice: originalPrice,
        discount: item.medicine.discount || 0,
        quantity: item.quantity,
        image: item.medicine.images?.[0]?.url || item.medicine.images?.[0] || 'https://via.placeholder.com/150',
        isFavorite: false, // TODO: Implement when backend supports it
        sizeInfo: sizeObj ? {
          id: sizeObj.id,
          name: sizeObj.sizeName || sizeObj.size_name,
        } : null,
      };
    });
  }, [cartItems]);

  // If cart is empty, show empty state
  if (!isLoading && transformedCartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.WHITE}
          translucent={false}
        />
        <CartHeader
          onBackPress={handleBackPress}
          itemCount={0}
        />
        <EmptyCart onStartShopping={handleStartShopping} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.WHITE}
        translucent={false}
      />

      <CartHeader
        onBackPress={handleBackPress}
        onClearCart={handleClearCart}
        itemCount={totalItems}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            {addresses.length > 0 && (
              <TouchableOpacity onPress={handleChangeAddress}>
                <Text style={styles.changeButton}>Change</Text>
              </TouchableOpacity>
            )}
          </View>

          {defaultAddress ? (
            <AddressCard
              data={defaultAddress}
              onEdit={() => handleEditAddress(defaultAddress.id)}
              onDelete={() => handleDeleteAddress(defaultAddress.id)}
              onSetDefault={() => handleSetDefaultAddress(defaultAddress.id)}
            />
          ) : (
            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={handleChangeAddress}
            >
              <Text style={styles.addAddressText}>+ Add Delivery Address</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.itemsContainer}>
          {transformedCartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onToggleFavorite={handleToggleFavorite}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </View>

        {/* Payment Method Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'Online' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('Online')}
          >
            <View style={styles.paymentOptionContent}>
              <View style={styles.radioButton}>
                {paymentMethod === 'Online' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <View style={styles.paymentOptionText}>
                <Text style={styles.paymentOptionTitle}>Online Payment</Text>
                <Text style={styles.paymentOptionSubtitle}>
                  Pay securely using UPI, Cards, Net Banking
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'COD' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('COD')}
          >
            <View style={styles.paymentOptionContent}>
              <View style={styles.radioButton}>
                {paymentMethod === 'COD' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <View style={styles.paymentOptionText}>
                <Text style={styles.paymentOptionTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentOptionSubtitle}>
                  Pay when you receive your order
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Add some bottom spacing for the checkout button */}
        <View style={styles.bottomSpacer} />
        <CheckoutButton
          totalAmount={parseFloat(totalAmount || 0)}
          itemCount={totalItems}
          onCheckout={handleCheckout}
          isLoading={isCheckoutLoading}
          deliveryChargeInfo={deliveryChargeInfo}
          deliveryChargeData={deliveryChargeData}
        />
      </ScrollView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  addressSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  changeButton: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.PRIMARY,
  },
  addAddressButton: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.PRIMARY,
  },
  itemsContainer: {
    // paddingVertical: 8,
  },
  paymentSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  paymentOption: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GRAY,
  },
  paymentOptionSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.PRIMARY,
  },
  paymentOptionText: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: 4,
  },
  paymentOptionSubtitle: {
    fontSize: 13,
    color: COLORS.GRAY,
  },
  bottomSpacer: {
    // height: 20,
  },
});

export default Cart;
