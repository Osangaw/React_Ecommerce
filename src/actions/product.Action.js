import api from "./axios";
import { productConstants } from "./constants"; // Check spelling: productConstant vs productConstants

export const getAllProducts = () => {
    return async (dispatch) => {
        dispatch({ type: productConstants.GET_ALL_PRODUCTS_REQUEST });
        
        try {
    
            const res = await api.get(`/product/all`);
            

            const data = (res && res.data) ? res.data : res;


            const products = data.products || (Array.isArray(data) ? data : []);

            if (products) {
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
// ✅ NEW: Add Product (Supports Multiple Images)
export const addProduct = (form) => {
    return async (dispatch) => {
        dispatch({ type: productConstants.ADD_PRODUCT_REQUEST });
        try {
            // 'form' must be a FormData object containing 'productPicture' fields
            const res = await api.post(`/product/add`, form);
            console.log('form;', form);
            

            if (res.status === 201) {
                dispatch({
                    type: productConstants.ADD_PRODUCT_SUCCESS,
                    payload: { product: res.data.newProduct }
                });
                // Optional: Refresh the list after adding
                dispatch(getAllProducts());
            }
        } catch (error) {
            console.log("Add Product Error:", error);
            dispatch({
                type: productConstants.ADD_PRODUCT_FAILURE,
                payload: { error: error.response ? error.response.data.message : error.message }
            });
        }
    };
};

// ✅ NEW: Update Product (Supports changing Text OR Images)
export const updateProduct = (id, form) => {
    return async (dispatch) => {
        dispatch({ type: productConstants.UPDATE_PRODUCT_REQUEST });
        try {
            const res = await api.patch(`/product/update/${id}`, form);

            if (res.status === 200) {
                dispatch({
                    type: productConstants.UPDATE_PRODUCT_SUCCESS,
                    payload: { product: res.data.product }
                });
                // Refresh details to show new changes immediately
                dispatch(getProductDetails(id));
            }
        } catch (error) {
            console.log("Update Product Error:", error);
            dispatch({
                type: productConstants.UPDATE_PRODUCT_FAILURE,
                payload: { error: error.response ? error.response.data.message : error.message }
            });
        }
    };
};

// ✅ NEW: Delete Product
export const deleteProduct = (id) => {
    return async (dispatch) => {
        dispatch({ type: productConstants.DELETE_PRODUCT_REQUEST });
        try {
            const res = await api.delete(`/product/delete/${id}`);
            if (res.status === 202) {
                dispatch({
                    type: productConstants.DELETE_PRODUCT_SUCCESS,
                    payload: { id } 
                });
            }
        } catch (error) {
            console.log("Delete Error:", error);
            dispatch({
                type: productConstants.DELETE_PRODUCT_FAILURE,
                payload: { error: error.response ? error.response.data.message : error.message }
            });
        }
    }
};