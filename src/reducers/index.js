import { combineReducers } from "redux";
import authReducer from "./auth.Reducer";
import cartReducer from "./cart.Reducer";
import productReducer from "./product.Reducer";
import addressReducer from "./address.Reducer";
import orderReducer from "./order.Reducer";

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    address: addressReducer,
    order: orderReducer
});

export default rootReducer;