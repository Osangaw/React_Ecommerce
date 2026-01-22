import { productConstants } from "../actions/constants";

const initState = {
    products: [],       // Array of all products
    productDetails: {}, // Object for a single product (when clicked)
    searchResults: [],  //  Store search results separately
    loading: false,
    error: null
};

export default (state = initState, action) => {
    switch (action.type) {
        
        
        case productConstants.GET_ALL_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case productConstants.GET_ALL_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.payload.products,
                loading: false
            };
        case productConstants.GET_ALL_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        case productConstants.GET_PRODUCT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case productConstants.GET_PRODUCT_DETAILS_SUCCESS:
            return {
                ...state,
                productDetails: action.payload.product,
                loading: false
            };
        case productConstants.GET_PRODUCT_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        
        case productConstants.SEARCH_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case productConstants.SEARCH_PRODUCT_SUCCESS:
            return {
                ...state,
                searchResults: action.payload.products, // Save results here
                loading: false
            };
        case productConstants.SEARCH_PRODUCT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        default:
            return state;
    }
};