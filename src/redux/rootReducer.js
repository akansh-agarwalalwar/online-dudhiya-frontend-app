import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import productsReducer from "./slices/producSlice";
import cartReducer from "./slices/cartSlice";
import categoryReducer from "./slices/categorySlice";
import sectionReducer from "./slices/sectionSlice";
import productDetailReducer from "./slices/productDetailSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  products: productsReducer,
  cart: cartReducer,
  categories: categoryReducer,
  sections: sectionReducer,
  productDetail: productDetailReducer,
  wishlist: wishlistReducer,
  order: orderReducer,
});

export default rootReducer;
