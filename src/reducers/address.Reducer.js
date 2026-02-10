import { addressConstants } from "../actions/constants";

const initState = {
    address: [], 
    error: null,
    loading: false
};

export default (state = initState, action) => {
    switch (action.type) {
        
        case addressConstants.GET_USER_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case addressConstants.GET_USER_ADDRESS_SUCCESS:
            return {
                ...state,
                address: action.payload.address,
                loading: false
            };
        case addressConstants.GET_USER_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        case addressConstants.ADD_USER_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case addressConstants.ADD_USER_ADDRESS_SUCCESS:
            const currentAddresses = Array.isArray(state.address) ? state.address : [];
            return {
                ...state,
                address: [...currentAddresses, action.payload.address], 
                loading: false
            };
        case addressConstants.ADD_USER_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

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

        case addressConstants.UPDATE_USER_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case addressConstants.UPDATE_USER_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false
                // Note: We don't need to manually update the state here 
                // because we dispatch getAddress() immediately after success in the action
            };
        case addressConstants.UPDATE_USER_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        default:
            return state;
    }
};