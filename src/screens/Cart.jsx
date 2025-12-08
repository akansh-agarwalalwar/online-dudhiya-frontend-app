import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {
  CartHeader,
  DeliveryToggle,
  CartItem,
  CheckoutButton,
  EmptyCart,
} from '../components/cart';
import COLORS from '../constants/Color';

// Mock data - replace with your actual cart state management
const MOCK_CART_ITEMS = [
  {
    id: '1',
    name: 'Premium Wine Collection',
    description: 'Italian red wine, dry, 750ml premium bottle',
    price: 1999.00,
    originalPrice: 2399.00,
    discount: 12,
    quantity: 2,
    image: 'https://content.jdmagicbox.com/comp/orai/c7/9999p5162.5162.190522191419.w5c7/catalogue/janu-dudh-dairy-churkhi-orai-milk-retailers-trls94fjyu.jpg',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Classic Wine Selection',
    description: 'French white wine, semi-dry, 750ml classic',
    price: 1599.00,
    originalPrice: 1899.00,
    discount: 12,
    quantity: 2,
    image: 'https://vanitascorner.com/wp-content/uploads/2019/06/Making-curd.jpg',
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Reserve Wine Bottle',
    description: 'Spanish rosé wine, dry, 750ml reserve quality',
    price: 2599.00,
    originalPrice: 2999.00,
    discount: 12,
    quantity: 1,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQviIw25rAGuPm_ybGIzHuvwOQLpn7nWTv11g&s',
    isFavorite: false,
  },
];

const Cart = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Calculate totals
  const { totalAmount, totalItems } = useMemo(() => {
    const items = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const amount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return { totalItems: items, totalAmount: amount };
  }, [cartItems]);

  // Handle quantity change
  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  // Handle remove item
  const handleRemoveItem = useCallback((itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  // Handle toggle favorite
  const handleToggleFavorite = useCallback((itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
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
          onPress: () => setCartItems([]),
        },
      ]
    );
  }, []);

  // Handle checkout
  const handleCheckout = useCallback(async () => {
    try {
      setIsCheckoutLoading(true);
      
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
              setCartItems([]);
              navigation.navigate('Home');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsCheckoutLoading(false);
    }
  }, [navigation]);

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
    setDeliveryOption(option);
  }, []);

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
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
              <CheckoutButton
        totalAmount={totalAmount}
        itemCount={totalItems}
        onCheckout={handleCheckout}
        isLoading={isCheckoutLoading}
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
  itemsContainer: {
    // paddingVertical: 8,
  },
  bottomSpacer: {
    // height: 20,
  },
});

export default Cart;
