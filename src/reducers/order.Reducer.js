import { orderConstants } from "../actions/constants";

const initState = {
  orders: [],       // For User
  adminOrders: [],  // For Admin Dashboard
  totalSales: 0,    // For Admin Stats
  loading: false,
  error: null,
  placedOrderId: null, // To track if an order was just placed successfully
};

export default (state = initState, action) => {
  switch (action.type) {
    
    // --- USER: GET ORDERS ---
    case orderConstants.GET_USER_ORDER_REQUEST:
      return { ...state, loading: true };
    case orderConstants.GET_USER_ORDER_SUCCESS:
      return { ...state, orders: action.payload.orders, loading: false };
    case orderConstants.GET_USER_ORDER_FAILURE:
      return { ...state, error: action.payload.error, loading: false };

    // --- USER: ADD ORDER ---
    case orderConstants.ADD_USER_ORDER_REQUEST:
        return { ...state, loading: true };
    case orderConstants.ADD_USER_ORDER_SUCCESS:
        return { 
            ...state, 
            loading: false, 
            placedOrderId: action.payload.order._id 
        };
    case orderConstants.ADD_USER_ORDER_FAILURE:
        return { ...state, loading: false, error: action.payload.error };

    // ✅ NEW: USER: CANCEL ORDER ---
    case orderConstants.CANCEL_ORDER_REQUEST:
        return { ...state, loading: true };
    case orderConstants.CANCEL_ORDER_SUCCESS:
        // We find the cancelled order in the array and swap it with the new updated version
        const updatedOrders = state.orders.map((order) => 
            order._id === action.payload.order._id ? action.payload.order : order
        );
        return { 
            ...state, 
            orders: updatedOrders,
            loading: false 
        };
    case orderConstants.CANCEL_ORDER_FAILURE:
        return { ...state, loading: false, error: action.payload.error };

    case orderConstants.GET_ALL_ORDERS_REQUEST:
        return { ...state, loading: true };
    case orderConstants.GET_ALL_ORDERS_SUCCESS:
        return { 
            ...state, 
            adminOrders: action.payload.orders,
            totalSales: action.payload.totalSales,
            loading: false 
        };
    case orderConstants.GET_ALL_ORDERS_FAILURE:
        return { ...state, error: action.payload.error, loading: false };

    default:
      return state;
  }
};