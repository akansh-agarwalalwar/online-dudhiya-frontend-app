// API Configuration
const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://10.124.89.11:3002' // Development URL
    : 'https://api.onlinedudhiya.com', // Production URL

  TIMEOUT: 30000, // 30 seconds

  ENDPOINTS: {
    AUTH: {
      OTP_REQUEST: '/api/v1/auth/otp-request',
      OTP_VERIFY: '/api/v1/auth/otp-verify',
      LOGIN: '/api/v1/auth/login',
      LOGOUT: '/api/v1/auth/logout',
      GOOGLE: '/api/v1/auth/google/mobile',
    },
    CATEGORIES: {
      GET_ALL: '/api/v1/category',
      GET_BY_ID: '/api/v1/category',
    },
    PRODUCTS: {
      GET_HOME_SECTIONS: '/api/v1/products/home-sections',
    },
    MEDICINE: {
      GET_ALL: '/api/v1/medicine',
      GET_BY_ID: '/api/v1/medicine',
      SEARCH: '/api/v1/medicine/search',
      GET_POPULAR_ITEMS: '/api/v1/medicine/popular',
      RECENT_SEARCHES: '/api/v1/medicine/recent-searches',
    },
    SECTIONS: {
      GET_ALL: '/api/v1/section',
      GET_BY_ID: '/api/v1/section',
    },
    CART: {
      ADD_TO_CART: '/api/v1/cart',
      GET_CART: '/api/v1/cart',
      UPDATE_ITEM: '/api/v1/cart/item',
      DELETE_ITEM: '/api/v1/cart/item',
      GET_COUNT: '/api/v1/cart/count',
      CLEAR_CART: '/api/v1/cart',
    },
    WISHLIST: {
      GET_ALL: '/api/v1/wishlist',
      ADD_TO_WISHLIST: '/api/v1/wishlist',
      REMOVE_FROM_WISHLIST: '/api/v1/wishlist',
      TOGGLE_WISHLIST_ITEM: '/api/v1/wishlist/toggle',
      CHECK_WISHLIST_ITEM: '/api/v1/wishlist/check',
    },
    USER: {
      GET_ME: '/api/v1/user/me',
      UPDATE_ME: '/api/v1/user/me',
    },
    ADDRESS: {
      GET_ALL: '/api/v1/address',
      GET_BY_ID: '/api/v1/address',
      CREATE: '/api/v1/address',
      UPDATE: '/api/v1/address',
      DELETE: '/api/v1/address',
      SET_DEFAULT: '/api/v1/address',
    },
    CLOUDINARY: {
      GET_SIGNATURE: '/api/v1/cloudinary/signature',
    },
    ORDER: {
      CREATE_PRODUCT: '/api/v1/order/customer/product',
      CREATE_PRESCRIPTION: '/api/v1/order/customer/prescription',
      GET_CUSTOMER_ORDERS: '/api/v1/order/customer',
      GET_BY_ID: '/api/v1/order',
      CANCEL: '/api/v1/order/customer/cancel',
    },
    PAYMENT: {
      INITIATE: '/api/v1/razorpay/initiate',
      VERIFY: '/api/v1/razorpay/handle-response',
      REFUND: '/api/v1/razorpay/initiate-refund',
    },
    // Add other endpoints here
  },

  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;
export { API_CONFIG };