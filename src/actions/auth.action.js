import api from "./axios";
import { authConstants, cartConstant } from "./constants";
import { addToCart, getCartItems } from "./cart.Action"; 

export const signup = (user) => {
    return async (dispatch) => {
        dispatch({ type: authConstants.SIGNUP_REQUEST });
        
        try {
            const res = await api.post(`/signup`, {
                ...user
            });

            if (res.status === 201) {
                const { message } = res.data;
                dispatch({
                    type: authConstants.SIGNUP_SUCCESS,
                    payload: { message }
                });
            } else {
                dispatch({
                    type: authConstants.SIGNUP_FAILURE,
                    payload: { error: res.data.message }
                });
            }
        } catch (error) {
            console.log("Signup Error:", error);
            dispatch({
                type: authConstants.SIGNUP_FAILURE,
                payload: { 
                    error: error.response && error.response.data 
                        ? error.response.data.message 
                        : "Something went wrong" 
                }
            });
        }
    };
};

export const login = (user) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });

    try {
      const res = await api.post("/signin", { ...user });

      if (res.status === 200) {
        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        await mergeCart(token);

        dispatch({
          type: authConstants.LOGIN_SUCCESS,
          payload: { token, user },
        });
        
      }
    } catch (error) {
      console.log("Login Action Error:", error);
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { error: error.response ? error.response.data.error : "Login Failed" },
      });
    }
  };
};

export const isUserLoggedIn = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: { token, user },
      });
    } else {
     // console.log("No token found, user is Guest.");
    }
  };
};

export const signout = () => {
    return async (dispatch) => {
        
        dispatch({ type: authConstants.LOGOUT_REQUEST });

        // 1. Clear Browser Storage
        localStorage.clear(); 
        // OR clear specific items if you want to keep some settings:
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        // localStorage.removeItem('cart'); // If you store cart locally

        // 2. Reset Auth State
        dispatch({ type: authConstants.LOGOUT_SUCCESS });

        // 3. Reset Cart State (Optional but recommended)
        dispatch({ type: cartConstant.RESET_CART });
    }
}

export const forgotPassword = (email) => {
    return async (dispatch) => {
        try {
            const res = await api.post("/forgot-password", { email });
            return res.data;
        } catch (error) {
            console.log("Forgot Password Error", error);
            throw error.response ? error.response.data : { message: "Something went wrong" };
        }
    };
};

export const resetPassword = (data) => {
    return async (dispatch) => {
        try {
            const res = await api.post("/reset-password", data);
            return res.data;
        } catch (error) {
            console.log("Reset Password Error", error);
            throw error.response ? error.response.data : { message: "Something went wrong" };
        }
    };
};

const mergeCart = async (token) => {
  const localCart = localStorage.getItem("cart") 
    ? JSON.parse(localStorage.getItem("cart")) 
    : [];

  if (localCart.length > 0) {
    console.log("Merging guest cart...", localCart);
    
    const itemsToSync = localCart.map(item => ({
        product: item.product._id || item.product, 
        quantity: item.quantity
    }));

    try {
      await api.post("/cart/add", 
        { cartItems: itemsToSync }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );

  
      localStorage.removeItem("cart");
      console.log("Cart merged successfully");
      return true;

    } catch (error) {
      console.log("Cart merge failed:", error);
      return false;
    }
  }
  return false;
};