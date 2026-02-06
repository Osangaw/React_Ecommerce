import React, { useEffect } from "react"; // ✅ Import useEffect
import { Route, Routes } from "react-router";
import { useDispatch, useSelector } from "react-redux"; 
import { isUserLoggedIn } from "./actions/auth.action";
import { getCartItems } from "./actions/cart.Action";   

import store from "./store";
import Homepage from "./container/homepage";
import SignIn from "./container/signin";
import SignUp from "./container/signup";
import ProductDetails from "./container/singleProduct";
import Cart from "./container/cart";
import Checkout from "./container/checkout";
import ResetPassword from "./container/reset-password";
import AddProduct from "./container/addProduct";
import EditProduct from "./container/editProduct";
import AdminDashboard from "./container/dashboard";
import OrderPage from "./container/orders";
import Profile from "./container/profile";

window.store = store;

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

 //RESTORE SESSION (Runs once on load)
  
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
  }, [auth.authenticate, dispatch]);

  // RESTORE CART (Runs when user is logged in)
  
  useEffect(() => {
    if (auth.authenticate) {
      dispatch(getCartItems());
    }
  }, [auth.authenticate, dispatch]);

  return (
    <div className="APP">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/product/edit/:id" element={<EditProduct />} />
        <Route path="/product/add" element={<AddProduct />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;