import axios from "axios";
import { cartConstant } from "./constants";


export const getCartItems = () => {
  return async (dispatch, getState) => {
    const { auth } = getState();

    // --- SCENARIO A: LOGGED IN USER (Fetch from DB) ---
    if (auth.authenticate) {
      dispatch({ type: cartConstant.CART_REQUEST });
      
      try {
        const res = await axios.get("http://localhost:3030/cart/get",{
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        
        if (res.status === 200) {
         const cartItems = res.data.cart ? res.data.cart.items : [];
          console.log("Cart fetched from DB:", cartItems);

          dispatch({
            type: cartConstant.CART_SUCCESS,
            payload: { cartItems }
          });
        }
      } catch (error) {
        console.log("Get Cart Error:", error);
        dispatch({
          type: cartConstant.CART_FAILURE,
          payload: { error: error.response ? error.response.data : error.message }
        });
      }
    } 
    
    // --- SCENARIO B: GUEST USER (Fetch from LocalStorage) ---
    else {
      const cartItems = localStorage.getItem("cart") 
        ? JSON.parse(localStorage.getItem("cart")) 
        : [];

      if (cartItems && cartItems.length > 0) {
        console.log("Cart fetched from LocalStorage:", cartItems);
        
        dispatch({
          type: cartConstant.CART_SUCCESS,
          payload: { cartItems }
        });
      }
    }
  };
};


export const addToCart = (product, newQty = 1) => {
  return async (dispatch, getState) => {
    
    const { auth, cart } = getState();
    
    // Safe fallback if cartItems is undefined
    const currentCartItems = cart.cartItems || [];

    // --- LOGIC: CHECK IF ITEM EXISTS ---
    // ✅ CRASH FIX: Use (?.) to safely access _id. Skips corrupted items.
    const existingItemIndex = currentCartItems.findIndex(
      (item) => item.product?._id === product._id
    );

    let updatedCartItems = [...currentCartItems];

    if (existingItemIndex >= 0) {
      // Item exists, update quantity
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity: updatedCartItems[existingItemIndex].quantity + newQty
      };
    } else {
      // New Item, add to array
      updatedCartItems.push({
        product: product,
        quantity: newQty,
        price: product.price 
      });
    }

    // --- SCENARIO A: LOGGED IN (Save to DB) ---
    if (auth.authenticate) {
      dispatch({ type: cartConstant.ADD_TO_CART_REQUEST });
      
      try {
        // ⚠️ CRITICAL FIX: Payload must match req.body.productId
        const payload = {
             productId: product._id, // Direct field
             quantity: newQty        // Direct field
        };

        // ✅ Using the URL from your snippet: /cart/add
        const res = await axios.post(`http://localhost:3030/cart/add`, payload, {
             headers: { Authorization: `Bearer ${auth.token}` }
        });
        
        // ✅ FIX: Backend returns 200, not 201
        if (res.status === 200) {
          dispatch(getCartItems()); // Refresh data
        }
      } catch (error) {
        console.log("Add Cart Error:", error);
        dispatch({
          type: cartConstant.ADD_TO_CART_FAILURE,
          payload: { error: error.message }
        });
      }
    } 
    
    // --- SCENARIO B: GUEST (Save to LocalStorage) ---
    else {
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
      
      dispatch({
        type: cartConstant.ADD_TO_CART_SUCCESS,
        payload: { cartItems: updatedCartItems }
      });
    }
  };
};

// ✅ 3. Remove Item
export const removeCartItem = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: cartConstant.REMOVE_FROM_CART_REQUEST });
    const { auth } = getState();

    if (auth.authenticate) {
      const config = {
        headers: { Authorization: `Bearer ${auth.token}` },
        data: { productId: payload.productId }, 
      };

      const res = await axios.delete("http://localhost:3030/cart/remove", config);

      if (res.status === 200) {
        dispatch({
          type: cartConstant.REMOVE_FROM_CART_SUCCESS,
          payload: { items: res.data.cart.items },
        });
      }
    } else {
      // Guest remove
      const { cart: { cartItems } } = getState(); 
      // ✅ FIX: Handle if product is object or string ID
      const newCartItems = cartItems.filter(
        (item) => (item.product?._id || item.product) !== payload.productId
      );
      
      dispatch({
        type: cartConstant.REMOVE_FROM_CART_SUCCESS,
        payload: { items: newCartItems },
      });
      localStorage.setItem("cart", JSON.stringify(newCartItems)); // Fixed key name to "cart"
    }
  } catch (error) {
    console.log("Remove Error:", error);
    dispatch({ type: cartConstant.REMOVE_FROM_CART_FAILURE, payload: { error }});
  }
};

// ✅ 4. Increment Quantity
export const incrementQuantity = (productId) => async (dispatch, getState) => {
    try {
        const state = getState();
        const { auth } = state; 
        
        const isUserLoggedIn = auth.authenticate; 
        
        dispatch({ type: cartConstant.UPDATE_CART_ITEM_QUANTITY_REQUEST });

        if (isUserLoggedIn) {
            await axios.patch("http://localhost:3030/cart/inc", {
                productId,
                userId: auth.user._id
            }, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
        } else {
            console.log("User not logged in, updating LocalStorage");
            
            let cartItems = localStorage.getItem("cart") 
                ? JSON.parse(localStorage.getItem("cart")) 
                : [];

            cartItems = cartItems.map((item) => {
                const itemProductId = item.product?._id || item.product;
                
                if (itemProductId === productId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            localStorage.setItem("cart", JSON.stringify(cartItems));
        }

        dispatch({ 
            type: cartConstant.UPDATE_CART_ITEM_QUANTITY_SUCCESS,
            payload: { productId, operation: "increment" }
        });

    } catch (error) {
        console.log("Increment Error:", error);
        dispatch({ 
            type: cartConstant.UPDATE_CART_ITEM_QUANTITY_FAILURE,
            payload: error.response?.data?.message || error.message
        });
    }
};

// ✅ 5. Decrement Quantity
export const decrementQuantity = (productId) => async (dispatch, getState) => {
    try {
        const state = getState();
        const { auth } = state; 
        
        const isUserLoggedIn = auth.authenticate; 
        
        dispatch({ type: cartConstant.UPDATE_CART_ITEM_QUANTITY_REQUEST });

        if (isUserLoggedIn) {
            await axios.patch("http://localhost:3030/cart/dec", {
                productId,
                userId: auth.user._id
            }, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
        } else {
            console.log("User not logged in, updating LocalStorage");
            
            let cartItems = localStorage.getItem("cart") 
                ? JSON.parse(localStorage.getItem("cart")) 
                : [];

            cartItems = cartItems.map((item) => {
                const itemProductId = item.product?._id || item.product;
                
                if (itemProductId === productId) {
                    const newQty = item.quantity - 1;
                    return { ...item, quantity: newQty < 1 ? 1 : newQty };
                }
                return item;
            });

            localStorage.setItem("cart", JSON.stringify(cartItems));
        }

        dispatch({ 
            type: cartConstant.UPDATE_CART_ITEM_QUANTITY_SUCCESS,
            payload: { productId, operation: "decrement" }
        });

    } catch (error) {
        console.log("Decrement Error:", error);
        dispatch({ 
            type: cartConstant.UPDATE_CART_ITEM_QUANTITY_FAILURE,
            payload: error.response?.data?.message || error.message
        });
    }
};