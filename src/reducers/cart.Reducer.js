import { cartConstant } from "../actions/constants";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  updatingCart: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    
    case cartConstant.CART_REQUEST:
      return { ...state, loading: true };

    case cartConstant.CART_SUCCESS:
      return {
        ...state,
        cartItems: action.payload.cartItems,
        loading: false,
      };

    case cartConstant.CART_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        updatingCart: false,
      };

    case cartConstant.ADD_TO_CART_REQUEST:
      return { ...state, updatingCart: true };

    case cartConstant.ADD_TO_CART_SUCCESS:
      return {
        ...state,
        cartItems: action.payload.cartItems,
        updatingCart: false,
      };

    case cartConstant.ADD_TO_CART_FAILURE:
      return {
        ...state,
        updatingCart: false,
        error: action.payload.error,
      };

    
    case cartConstant.UPDATE_CART_ITEM_QUANTITY_REQUEST:
      return { ...state, updatingCart: true };

    case cartConstant.UPDATE_CART_ITEM_QUANTITY_SUCCESS: {
      if (action.payload.cartItems) {
        return {
          ...state,
          cartItems: action.payload.cartItems,
          updatingCart: false,
          error: null,
        };
      }

      const { productId, operation } = action.payload;
      
      const updatedCartItems = state.cartItems.map((item) => {
        const productData = item.productId || item.product;
        const itemProductId = productData._id 
            ? productData._id.toString() 
            : productData.toString();

        if (itemProductId === productId.toString()) {
          return {
            ...item,
            quantity: operation === "increment" ? item.quantity + 1 : item.quantity - 1,
          };
        }
        return item;
      });

      return {
        ...state,
        cartItems: updatedCartItems,
        updatingCart: false,
        loading: false,
        error: null,
      };
    }

    case cartConstant.UPDATE_CART_ITEM_QUANTITY_FAILURE:
      return {
        ...state,
        updatingCart: false,
        error: action.payload.error,
      };

    case cartConstant.REMOVE_FROM_CART_REQUEST:
      return { ...state, updatingCart: true };

      case cartConstant.REMOVE_FROM_CART_SUCCESS:
      return {
        ...state,
        updatingCart: false,
        cartItems: action.payload.items, 
        error: null,
      };
    case cartConstant.REMOVE_FROM_CART_FAILURE:
      return {
        ...state,
        updatingCart: false,
        error: action.payload.error,
      };

    case cartConstant.RESET_CART:
            return {
                ...initialState
            };

    default:
      return state;
  }
};