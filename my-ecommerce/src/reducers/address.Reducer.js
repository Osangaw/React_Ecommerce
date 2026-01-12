import { addressConstants } from "../actions/constants";

const initState = {
    address: [], 
    error: null,
    loading: false
};

export default (state = initState, action) => {
    switch (action.type) {
        
        // --- GET ADDRESSES ---
        case addressConstants.GET_USER_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case addressConstants.GET_USER_ADDRESS_SUCCESS:
            return {
                ...state,
                address: action.payload.address, // Keep this one (it sets the full list)
                loading: false
            };
        case addressConstants.GET_USER_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        // --- ADD ADDRESS ---
        case addressConstants.ADD_USER_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case addressConstants.ADD_USER_ADDRESS_SUCCESS:
            // ✅ FIX: Safely append the new address to the list
            // We check if state.address is an array first to avoid crashes
            const currentAddresses = Array.isArray(state.address) ? state.address : [];
            
            return {
                ...state,
                // Add the new address to the END of the array
                address: [...currentAddresses, action.payload.address], 
                loading: false
            };
        case addressConstants.ADD_USER_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        // --- REMOVE ADDRESS ---
        case addressConstants.REMOVE_USER_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case addressConstants.REMOVE_USER_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case addressConstants.REMOVE_USER_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        default:
            return state;
    }
};