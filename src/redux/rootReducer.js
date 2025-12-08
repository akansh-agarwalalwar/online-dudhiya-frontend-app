import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import productsReducer from "./slices/producSlice";
import cartReducer from "./slices/cartSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  products: productsReducer,
  cart: cartReducer,
});

export default rootReducer;
