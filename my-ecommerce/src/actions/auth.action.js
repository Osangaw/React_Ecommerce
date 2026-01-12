import axios from "axios";
import { authConstants, cartConstant } from "./constants";

export const signup = (user) => {
    return async (dispatch) => {
        dispatch({ type: authConstants.SIGNUP_REQUEST });
        
        try {
            const res = await axios.post(`http://localhost:3030/signup`, {
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

        try {
            dispatch({ type: authConstants.LOGIN_REQUEST });

            const res = await axios.post("http://localhost:3030/signIn", { ...user });
            
            const data = (res && res.data) ? res.data : res;

            if (data && data.token) {

                const { token, user } = data;
                console.log('User Data:', user);
                

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                dispatch({
                    type: authConstants.LOGIN_SUCCESS,
                    payload: { token, user }
                });
                
                console.log("4. DISPATCH SUCCESS FIRED");
            } else {
                console.log("3. NO TOKEN FOUND IN DATA");
                dispatch({
                    type: authConstants.LOGIN_FAILURE,
                    payload: { error: "Server response missing token" }
                });
            }

        } catch (error) {
            console.log("X. LOGIN ERROR:", error);
            
            // Safe Error Handling
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message;

            dispatch({
                type: authConstants.LOGIN_FAILURE,
                payload: { error: errorMessage }
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
                payload: { token, user }
            });
        } else {
            dispatch({
                type: authConstants.LOGIN_FAILURE,
                payload: { error: "Failed to login" }
            });
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