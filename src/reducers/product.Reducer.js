import { productConstants } from "../actions/constants";

const initState = {
    products: [],       // Array of all products
    productDetails: {}, // Object for a single product (when clicked)
    searchResults: [],  // Store search results separately
    loading: false,
    error: null
};

export default (state = initState, action) => {
    switch (action.type) {
        
        // --- FETCH ALL PRODUCTS ---
        case productConstants.GET_ALL_PRODUCTS_REQUEST:
            return { ...state, loading: true };
        case productConstants.GET_ALL_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.payload.products,
                loading: false
            };
        case productConstants.GET_ALL_PRODUCTS_FAILURE:
            return { ...state, loading: false, error: action.payload.error };

        // --- FETCH PRODUCT DETAILS ---
        case productConstants.GET_PRODUCT_DETAILS_REQUEST:
            return { ...state, loading: true };
        case productConstants.GET_PRODUCT_DETAILS_SUCCESS:
            return {
                ...state,
                productDetails: action.payload.product,
                loading: false
            };
        case productConstants.GET_PRODUCT_DETAILS_FAILURE:
            return { ...state, loading: false, error: action.payload.error };

        // --- SEARCH PRODUCTS ---
        case productConstants.SEARCH_PRODUCT_REQUEST:
            return { ...state, loading: true };
        case productConstants.SEARCH_PRODUCT_SUCCESS:
            return {
                ...state,
                searchResults: action.payload.products,
                loading: false
            };
        case productConstants.SEARCH_PRODUCT_FAILURE:
            return { ...state, loading: false, error: action.payload.error };

        
        case productConstants.ADD_PRODUCT_REQUEST:
            return { ...state, loading: true };
        case productConstants.ADD_PRODUCT_SUCCESS:
            return {
                ...state,
                // Add the new product to the END of the list
                products: [...state.products, action.payload.product],
                loading: false
            };
        case productConstants.ADD_PRODUCT_FAILURE:
            return { ...state, loading: false, error: action.payload.error };

        
        case productConstants.UPDATE_PRODUCT_REQUEST:
            return { ...state, loading: true };
        case productConstants.UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                // Find the product in the list and replace it with the updated one
                products: state.products.map(product => 
                    product._id === action.payload.product._id 
                        ? action.payload.product 
                        : product
                ),
                // Also update details if we are currently looking at that product
                productDetails: (state.productDetails._id === action.payload.product._id)
                    ? action.payload.product
                    : state.productDetails,
                loading: false
            };
        case productConstants.UPDATE_PRODUCT_FAILURE:
            return { ...state, loading: false, error: action.payload.error };

        case productConstants.DELETE_PRODUCT_REQUEST:
            return { ...state, loading: true };
        case productConstants.DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                // Filter out the deleted product ID
                products: state.products.filter(
                    product => product._id !== action.payload.id
                ),
                loading: false
            };
        case productConstants.DELETE_PRODUCT_FAILURE:
            return { ...state, loading: false, error: action.payload.error };

        default:
            return state;
    }
};