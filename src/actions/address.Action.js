
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

            const res = await api.get('/address/get', config); 
            
            if (res.status === 200) {
                const addressList = res.data.addresses; 
                dispatch({
                    type: addressConstants.GET_USER_ADDRESS_SUCCESS,
                    payload: { address: addressList }
                });
            }
            
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
      const res = await api.post("/address/add",
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
    try {
      const res = await api.delete("/address/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { payload, userId } 
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

export const updateAddress = (form) => {
  return async (dispatch, getState) => {
    dispatch({ type: addressConstants.UPDATE_USER_ADDRESS_REQUEST });
    
    try {
      const { token } = getState().auth;
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await api.post(
        "/address/edit", 
        form, 
        config
      );

      if (res.status === 201 || res.status === 200) {
        dispatch({ 
            type: addressConstants.UPDATE_USER_ADDRESS_SUCCESS 
        });
        
        dispatch(getAddress()); 
      }
    } catch (error) {
      console.log("Update Address Error:", error);
      dispatch({
        type: addressConstants.UPDATE_USER_ADDRESS_FAILURE,
        payload: { error: error.response?.data?.message || error.message },
      });
    }
  };
};