import { cartConstant } from "../actions/constants";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  updatingCart: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    
    // ===========================
    // GET CART (Fixed Empty Cart Bug)
    // ===========================
    case cartConstant.CART_REQUEST:
      return { ...state, loading: true };

    case cartConstant.CART_SUCCESS:
       // console.log("Reducer CART_SUCCESS Payload:", action.payload.cartItems);
        
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

    // ===========================
    // ADD TO CART
    // ===========================
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

    // ===========================
    // UPDATE QUANTITY (Restored Logic)
    // ===========================
    case cartConstant.UPDATE_CART_ITEM_QUANTITY_REQUEST:
      return { ...state, updatingCart: true };

// ... inside the switch statement
    case cartConstant.UPDATE_CART_ITEM_QUANTITY_SUCCESS: {
      
      // 1. If backend sends a full new list, use it (easiest way)
      if (action.payload.cartItems) {
        return {
          ...state,
          cartItems: action.payload.cartItems,
          updatingCart: false,
          error: null,
        };
      }

      // 2. If backend sends nothing, we update the state manually (Optimistic Update)
      const { productId, operation } = action.payload;
      
      const updatedCartItems = state.cartItems.map((item) => {
        // ⚠️ THE FIX: Handle the fact that your DB uses 'productId' (populated object)
        // while Redux logic might expect 'product'. We check both.
        const productData = item.productId || item.product;
        
        // Safety check to get the ID string
        const itemProductId = productData._id 
            ? productData._id.toString() 
            : productData.toString();

        // If this is the item we clicked, update the quantity
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
      case cartConstant.RESET_CART:
            return {
                ...state
            };
    // ===========================
    // REMOVE ITEM
    // ===========================
    case cartConstant.REMOVE_FROM_CART_REQUEST:
      return { ...state, updatingCart: true };

    case cartConstant.REMOVE_FROM_CART_SUCCESS:
      return {
        ...state,
        cartItems: action.payload.cartItems
          ? action.payload.cartItems
          : state.cartItems.filter(
              (item) => item.product._id !== action.payload.productId
            ),
        updatingCart: false,
      };

    case cartConstant.REMOVE_FROM_CART_FAILURE:
      return {
        ...state,
        updatingCart: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};