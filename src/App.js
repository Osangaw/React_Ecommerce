import { Route, Routes } from "react-router";
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

window.store = store;
function App() {
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
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/add-product" element={<AddProduct />} />
        
      </Routes>
    </div>
  );
}

export default App;