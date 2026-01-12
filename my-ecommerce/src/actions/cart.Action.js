import axios from "axios";
import { cartConstant } from "./constants";


export const getCartItems = () => {
  return async (dispatch, getState) => {
    
    // Check current auth state
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

          // Dispatch to Reducer
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

// ==========================================
// 2. ADD TO CART (Auth vs Guest Check)
// ==========================================
export const addToCart = (product, newQty = 1) => {
  return async (dispatch, getState) => {
    
    const { auth, cart } = getState();
    
    // Get current items safely (array fallback)
    const currentCartItems = cart.cartItems || [];

    // --- LOGIC: CHECK IF ITEM EXISTS ---
    // We search for the item to update quantity instead of adding duplicate
    const existingItemIndex = currentCartItems.findIndex(
      (item) => item.product._id === product._id
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
        const payload = {
            // Backend expects array: [{ product: "ID", quantity: 1 }]
            cartItems: [{ 
                product: product._id, 
                quantity: newQty // Or total quantity depending on your API
            }]
        };

        const res = await axios.post(`/user/cart/addtocart`, payload);
        
        if (res.status === 201) {
          dispatch(getCartItems()); // Refresh data from server to be safe
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
      // 1. Save to Local Storage
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
      
      // 2. Update Redux State immediately
      dispatch({
        type: cartConstant.ADD_TO_CART_SUCCESS,
        payload: { cartItems: updatedCartItems }
      });
    }
  };
};

// =======================
// 4. REMOVE ITEM
// =======================
export const removeCartItem = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: cartConstant.REMOVE_FROM_CART_REQUEST });
    const { auth } = getState();

    if (auth.authenticate) {
      // DELETE request requires 'data' key for body
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
      const newCartItems = cartItems.filter(
        (item) => item.product !== payload.productId
      );
      dispatch({
        type: cartConstant.REMOVE_FROM_CART_SUCCESS,
        payload: { items: newCartItems },
      });
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    }
  } catch (error) {
    console.log("Remove Error:", error);
    dispatch({ type: cartConstant.REMOVE_FROM_CART_FAILURE, payload: { error }});
  }
};


// ==============================
// INCREMENT QUANTITY (+)
// ==============================
export const incrementQuantity = (productId) => async (dispatch, getState) => {
    try {
        const state = getState();
        const { auth } = state; // Destructure auth directly
        
        // 1. Better Auth Check
        const isUserLoggedIn = auth.authenticate; 
        
        dispatch({ type: cartConstant.UPDATE_CART_ITEM_QUANTITY_REQUEST });

        if (isUserLoggedIn) {
            // --- LOGGED IN LOGIC ---
            await axios.patch("http://localhost:3030/cart/inc", {
                productId,
                userId: auth.user._id
            }, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
        } else {
            // --- GUEST LOGIC (Fixing the empty else block) ---
            console.log("User not logged in, updating LocalStorage");
            
            let cartItems = localStorage.getItem("cart") 
                ? JSON.parse(localStorage.getItem("cart")) 
                : [];

            // Update the quantity in the local array
            cartItems = cartItems.map((item) => {
                // Handle complex ID structure (item.product._id vs item.product)
                const itemProductId = item.product._id ? item.product._id : item.product;
                
                if (itemProductId === productId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            // Save back to storage so it persists on refresh
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }

        // --- UPDATE REDUX STATE ---
        // This updates the UI immediately for both Guest and User
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

// ==============================
// DECREMENT QUANTITY (-)
export const decrementQuantity = (productId) => async (dispatch, getState) => {
    try {
        const state = getState();
        const { auth, cart } = state;
        
        // 1. FIND THE ITEM IN THE CURRENT STATE
        // We need to check the current quantity before doing anything
        const currentItem = cart.cartItems.find(item => {
            const id = item.product._id ? item.product._id : item.product;
            return id.toString() === productId.toString();
        });

      
        if (!currentItem || currentItem.quantity <= 1) {
            return; // 🛑 
        }

        // If we pass the check above, we proceed as normal...
        const isUserLoggedIn = auth.authenticate; 
        dispatch({ type: cartConstant.UPDATE_CART_ITEM_QUANTITY_REQUEST });

        if (isUserLoggedIn) {
             // --- LOGGED IN LOGIC ---
            await axios.patch("http://localhost:3030/cart/dec", {
                productId,
                userId: auth.user._id
            }, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
        } else {
            // --- GUEST LOGIC ---
            console.log("User not logged in, updating LocalStorage");
            
            let cartItems = localStorage.getItem("cart") 
                ? JSON.parse(localStorage.getItem("cart")) 
                : [];

            cartItems = cartItems.map((item) => {
                const itemProductId = item.product._id ? item.product._id : item.product;

                if (itemProductId === productId) {
                    // Double check, though the top check covers this
                    const newQty = item.quantity > 1 ? item.quantity - 1 : 1;
                    return { ...item, quantity: newQty };
                }
                return item;
            });

            localStorage.setItem("cart", JSON.stringify(cartItems));
        }

        // --- UPDATE REDUX STATE ---
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