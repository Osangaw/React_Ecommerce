
import api from "./axios";
import { addressConstants } from "./constants";

export const getAddress = () => {
    return async (dispatch, getState) => {
        dispatch({ type: addressConstants.GET_USER_ADDRESS_REQUEST });
        
        try {
            const { auth } = getState();
            
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            };

            const res = await api.get('http://localhost:3030/address/get', config); 
            
            if (res.status === 200) {
                const addressList = res.data.addresses; 
                dispatch({
                    type: addressConstants.GET_USER_ADDRESS_SUCCESS,
                    payload: { address: addressList }
                });
            }
            console.log("addresses;",res.data);
            
        } catch (error) {
            console.log("Get Address Error:", error);
            dispatch({ 
                type: addressConstants.GET_USER_ADDRESS_FAILURE,
                payload: { error: error.response?.data?.message || error.message }
            });
        }
    }
}

export const addAddress = (form) => {
  return async (dispatch, getState) => {
    dispatch({ type: addressConstants.ADD_USER_ADDRESS_REQUEST });
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await api.post(
        "http://localhost:3030/address/add",
        form,
        config
      );

      if (res.status === 200 || res.status === 201) {
        console.log("Address Added:", res);
        dispatch({
          type: addressConstants.ADD_USER_ADDRESS_SUCCESS,
          payload: { address: res.data.address },
        });
        dispatch(getAddress());
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: addressConstants.ADD_USER_ADDRESS_FAILURE,
        payload: { error: error.response?.data?.message || error.message },
      });
    }
  };
};

export const deleteAddress = (payload) => {
  return async (dispatch, getState) => {
    dispatch({ type: addressConstants.REMOVE_USER_ADDRESS_REQUEST });
    const auth = getState().auth    
    const { token } = getState().auth; 
    const  userId  = auth.user._id;
    console.log("userId:", userId);
    
    try {
      const res = await api.delete("http://localhost:3030/address/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { payload, userId } // ⚠️ IMPORTANT: Body goes here for DELETE requests
      });

      if (res.status === 202 || res.status === 200) {
        dispatch({ type: addressConstants.REMOVE_USER_ADDRESS_SUCCESS });
        dispatch(getAddress());
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: addressConstants.REMOVE_USER_ADDRESS_FAILURE,
        payload: { error: error.response?.data?.message || error.message },
      });
    }
  };
};