import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {
  CartHeader,
  DeliveryToggle,
  CartItem,
  CheckoutButton,
  EmptyCart,
} from '../components/cart';
import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotalPrice,
  selectDeliveryOption,
  selectDeliveryAddress,
  selectCartLoading,
  selectIsCartEmpty,
  updateQuantity,
  removeItem,
  toggleFavorite,
  clearCart,
  setDeliveryOption,
  setLoading,
} from '../redux/slices/cartSlice';
import COLORS from '../constants/Color';

const CartWithRedux = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux selectors
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartItemsCount);
  const totalAmount = useSelector(selectCartTotalPrice);
  const deliveryOption = useSelector(selectDeliveryOption);
  const deliveryAddress = useSelector(selectDeliveryAddress);
  const isCheckoutLoading = useSelector(selectCartLoading);
  const isCartEmpty = useSelector(selectIsCartEmpty);

  // Handle quantity change
  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
  }, [dispatch]);

  // Handle remove item
  const handleRemoveItem = useCallback((itemId) => {
    dispatch(removeItem(itemId));
  }, [dispatch]);

  // Handle toggle favorite
  const handleToggleFavorite = useCallback((itemId) => {
    dispatch(toggleFavorite(itemId));
  }, [dispatch]);

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
          onPress: () => dispatch(clearCart()),
        },
      ]
    );
  }, [dispatch]);

  // Handle checkout
  const handleCheckout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to checkout screen or show success
      Alert.alert(
        'Order Placed',
        'Your order has been successfully placed. We will contact you shortly.',
        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(clearCart());
              navigation.navigate('Home');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigation]);

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

  // If cart is empty, show empty state
  if (isCartEmpty) {
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
        <DeliveryToggle
          selectedOption={deliveryOption}
          onOptionChange={handleDeliveryOptionChange}
          deliveryAddress={deliveryAddress}
        />

        <View style={styles.itemsContainer}>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onToggleFavorite={handleToggleFavorite}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </View>

        {/* Add some bottom spacing for the checkout button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <CheckoutButton
        totalAmount={totalAmount}
        itemCount={totalItems}
        onCheckout={handleCheckout}
        isLoading={isCheckoutLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  itemsContainer: {
    paddingVertical: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default CartWithRedux;