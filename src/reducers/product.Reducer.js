import { productConstants } from "../actions/constants";

const initState = {
    products: [],      // Array of all products
    productDetails: {}, // Object for a single product (when clicked)
    loading: false,
    error: null
};

export default (state = initState, action) => {
    switch (action.type) {
        
        // =======================
        // GET ALL PRODUCTS
        // =======================
        case productConstants.GET_ALL_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case productConstants.GET_ALL_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.payload.products, // API returns { products: [...] }
                loading: false
            };
        case productConstants.GET_ALL_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        // =======================
        // GET SINGLE PRODUCT DETAILS
        // =======================
        case productConstants.GET_PRODUCT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case productConstants.GET_PRODUCT_DETAILS_SUCCESS:
            return {
                ...state,
                productDetails: action.payload.product, // API returns { product: {...} }
                loading: false
            };
        case productConstants.GET_PRODUCT_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        default:
            return state;
    }
};