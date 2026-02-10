import api from "./axios";
import { cartConstant, orderConstants } from "./constants";

export const addOrder = (payload) => {
  return async (dispatch, getState) => {
    dispatch({ type: orderConstants.ADD_USER_ORDER_REQUEST });

    try {
      console.log("payload", payload);

      const { token } = getState().auth;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await api.post("/order/add", payload, config);

      if (res.status === 201) {
        dispatch({
          type: orderConstants.ADD_USER_ORDER_SUCCESS,
          payload: { order: res.data.order },
        });
        console.log("order created action");

        dispatch({ type: cartConstant.RESET_CART });
      }
    } catch (error) {
      console.log("Add Order Error:", error);
      const errorMsg =
        error.response &&
        (error.response.data.message || error.response.data.error)
          ? error.response.data.message || error.response.data.error
          : error.message;

      dispatch({
        type: orderConstants.ADD_USER_ORDER_FAILURE,
        payload: { error: errorMsg },
      });
    }
  };
};

export const getOrders = () => {
  return async (dispatch, getState) => {
    dispatch({ type: orderConstants.GET_USER_ORDER_REQUEST });
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await api.get("/order/get", config);
      console.log("orders;", res.data);

      if (res.status === 200) {
        dispatch({
          type: orderConstants.GET_USER_ORDER_SUCCESS,
          payload: { orders: res.data.orders },
        });
      }
    } catch (error) {
      dispatch({
        type: orderConstants.GET_USER_ORDER_FAILURE,
        payload: {
          error: error.response ? error.response.data.error : error.message,
        },
      });
    }
  };
};

export const getAllOrders = () => {
  return async (dispatch, getState) => {
    dispatch({ type: orderConstants.GET_ALL_ORDERS_REQUEST });
    try {
      const { auth } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const res = await api.get("/order/all", config);

      if (res.status === 200) {
        const { orders, totalSales } = res.data;
        dispatch({
          type: orderConstants.GET_ALL_ORDERS_SUCCESS,
          payload: { orders, totalSales },
        });
      }
    } catch (error) {
      console.log("Admin Fetch Error:", error);
      dispatch({
        type: orderConstants.GET_ALL_ORDERS_FAILURE,
        payload: {
          error: error.response ? error.response.data.error : error.message,
        },
      });
    }
  };
};

export const updateOrderStatus = (payload) => {
  return async (dispatch, getState) => {
    dispatch({ type: orderConstants.UPDATE_ORDER_STATUS_REQUEST });
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const res = await api.patch(
        `/order/updateStatus/${payload.orderId}`,
        payload,
        config,
      );

      if (res.status === 200) {
        dispatch({ type: orderConstants.UPDATE_ORDER_STATUS_SUCCESS });
        // Refresh the list immediately to show the new status
        dispatch(getAllOrders());
      }
    } catch (error) {
      dispatch({
        type: orderConstants.UPDATE_ORDER_STATUS_FAILURE,
        payload: {
          error: error.response ? error.response.data.error : error.message,
        },
      });
    }
  };
};
export const cancelOrder = (payload) => {
  return async (dispatch, getState) => {
    dispatch({ type: orderConstants.CANCEL_ORDER_REQUEST });
    
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await api.post("/order/cancel", payload, config);
      
      if (res.status === 200) {
        dispatch({
          type: orderConstants.CANCEL_ORDER_SUCCESS,
          payload: { order: res.data.order },
        });
        // Refresh the list immediately after cancelling
        dispatch(getOrders());
      } else {
        dispatch({
          type: orderConstants.CANCEL_ORDER_FAILURE,
          payload: { error: res.data.error },
        });
      }
    } catch (error) {
      const errorMsg = error.response ? error.response.data.error : error.message;
      dispatch({
        type: orderConstants.CANCEL_ORDER_FAILURE,
        payload: { error: errorMsg },
      });
    }
  };
};

export const getOrderDetails = (payload) => {
  return async (dispatch, getState) => {
    dispatch({ type: orderConstants.GET_ORDER_DETAILS_REQUEST });
    try {
      const { token } = getState().auth; // Ensure we get token correctly
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // Payload should be { orderId: "..." }
      const res = await api.post(`/order/get-order-details`, payload, config);

      if (res.status === 200) {
        dispatch({
          type: orderConstants.GET_ORDER_DETAILS_SUCCESS,
          payload: { order: res.data.order },
        });
      }
    } catch (error) {
      dispatch({
        type: orderConstants.GET_ORDER_DETAILS_FAILURE,
        payload: {
          error: error.response ? error.response.data.error : error.message,
        },
      });
    }
  };
};