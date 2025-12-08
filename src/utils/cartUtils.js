/**
 * Cart utility functions for price calculations and formatting
 */

/**
 * Calculate the total price of cart items
 * @param {Array} cartItems - Array of cart items
 * @returns {number} Total price
 */
export const calculateTotalPrice = (cartItems = []) => {
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

/**
 * Calculate the total quantity of items in cart
 * @param {Array} cartItems - Array of cart items
 * @returns {number} Total quantity
 */
export const calculateTotalQuantity = (cartItems = []) => {
  return cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};

/**
 * Calculate total savings from discounts
 * @param {Array} cartItems - Array of cart items
 * @returns {number} Total savings
 */
export const calculateTotalSavings = (cartItems = []) => {
  return cartItems.reduce((total, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      const savings = (item.originalPrice - item.price) * item.quantity;
      return total + savings;
    }
    return total;
  }, 0);
};

/**
 * Format price to Indian locale with currency
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Calculate delivery fee based on total amount and delivery option
 * @param {number} totalAmount - Total cart amount
 * @param {string} deliveryOption - 'delivery' or 'pickup'
 * @param {number} freeDeliveryThreshold - Minimum amount for free delivery
 * @param {number} deliveryFee - Standard delivery fee
 * @returns {number} Delivery fee
 */
export const calculateDeliveryFee = (
  totalAmount, 
  deliveryOption = 'delivery', 
  freeDeliveryThreshold = 1000, 
  deliveryFee = 200
) => {
  if (deliveryOption === 'pickup') return 0;
  if (totalAmount >= freeDeliveryThreshold) return 0;
  return deliveryFee;
};

/**
 * Generate order summary for checkout
 * @param {Array} cartItems - Array of cart items
 * @param {string} deliveryOption - 'delivery' or 'pickup'
 * @returns {Object} Order summary object
 */
export const generateOrderSummary = (cartItems = [], deliveryOption = 'delivery') => {
  const subtotal = calculateTotalPrice(cartItems);
  const totalQuantity = calculateTotalQuantity(cartItems);
  const totalSavings = calculateTotalSavings(cartItems);
  const deliveryFee = calculateDeliveryFee(subtotal, deliveryOption);
  const total = subtotal + deliveryFee;

  return {
    subtotal,
    totalQuantity,
    totalSavings,
    deliveryFee,
    total,
    deliveryOption,
    items: cartItems,
  };
};

/**
 * Validate cart item before adding to cart
 * @param {Object} item - Item to validate
 * @returns {boolean} True if valid
 */
export const validateCartItem = (item) => {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    item.price > 0 &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );
};

/**
 * Find item in cart by ID
 * @param {Array} cartItems - Array of cart items
 * @param {string} itemId - Item ID to find
 * @returns {Object|undefined} Found item or undefined
 */
export const findCartItem = (cartItems = [], itemId) => {
  return cartItems.find(item => item.id === itemId);
};

/**
 * Check if item exists in cart
 * @param {Array} cartItems - Array of cart items
 * @param {string} itemId - Item ID to check
 * @returns {boolean} True if item exists
 */
export const isItemInCart = (cartItems = [], itemId) => {
  return cartItems.some(item => item.id === itemId);
};

/**
 * Get quantity of specific item in cart
 * @param {Array} cartItems - Array of cart items
 * @param {string} itemId - Item ID
 * @returns {number} Item quantity (0 if not found)
 */
export const getItemQuantity = (cartItems = [], itemId) => {
  const item = findCartItem(cartItems, itemId);
  return item ? item.quantity : 0;
};