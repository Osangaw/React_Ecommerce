import api from "./axios";
import { productConstants } from "./constants"; // Check spelling: productConstant vs productConstants

export const getAllProducts = () => {
    return async (dispatch) => {
        dispatch({ type: productConstants.GET_ALL_PRODUCTS_REQUEST });
        
        try {
    
            const res = await api.get(`/product/all`);
            
            console.log("1. RAW PRODUCT RESPONSE:", res);

            const data = (res && res.data) ? res.data : res;


            const products = data.products || (Array.isArray(data) ? data : []);

            if (products) {
                console.log(`3. Found ${products.length} products`);
                
                dispatch({
                    type: productConstants.GET_ALL_PRODUCTS_SUCCESS,
                    payload: { products } 
                });
            } else {
                throw new Error("Products list not found in response");
            }

        } catch (error) {
            console.log("Product Fetch Error:", error);
            
            dispatch({
                type: productConstants.GET_ALL_PRODUCTS_FAILURE,
                payload: { 
                    error: error.response && error.response.data 
                        ? error.response.data.message 
                        : error.message 
                }
            });
        }
    }
}

export const getProductDetails = (productId) => {
    return async (dispatch) => {
        dispatch({ type: productConstants.GET_PRODUCT_DETAILS_REQUEST });
        try {
            const res = await api.get(`/product/getById/${productId}`);
            
            if (res.status === 200) {
                dispatch({
                    type: productConstants.GET_PRODUCT_DETAILS_SUCCESS,
                    payload: { product: res.data.product }
                });
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: productConstants.GET_PRODUCT_DETAILS_FAILURE,
                payload: { error: error.message }
            });
        }
    }
}


export const searchProducts = (key) => {
    return async (dispatch) => {
        
        dispatch({ type: productConstants.SEARCH_PRODUCT_REQUEST });

        try {
            const res = await api.get(`/product/search/${key}`);

            if (res.status === 200) {
                dispatch({
                    type: productConstants.SEARCH_PRODUCT_SUCCESS,
                    payload: { products: res.data }                    
                });   
                                 console.log(res.data);

            }
        } catch (error) {
            console.log("Search Error:", error);
            dispatch({
                type: productConstants.SEARCH_PRODUCT_FAILURE,
                payload: { 
                    error: error.response && error.response.data.message 
                        ? error.response.data.message 
                        : error.message 
                }
            });
        }
    };
};