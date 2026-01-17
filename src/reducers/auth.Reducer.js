import { authConstants } from "../actions/constants";

const initState = {
    token: null,
    user: {
        name: '',
        email: '',
        phoneNumber: ''
    },
    authenticate: false,
    authenticating: false,
    loading: false,
    error: null,
    message: ''
};

export default (state = initState, action) => {
    switch (action.type) {
        case authConstants.LOGIN_REQUEST:
           return {
                ...state,
                error: null,
                loading: true
            }

        case authConstants.LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                authenticate: true,
                loading: false,
                error: null
            }

        case authConstants.SIGNUP_REQUEST:
            return{
                ...state,
                loading: true,
                error: null
            }

        case authConstants.SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                message: "Registration Successful"
            };

        case authConstants.SIGNUP_FAILURE:
            return{
                ...state,
                loading: false,
                error: action.payload.error
            }

        case authConstants.LOGOUT_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case authConstants.LOGOUT_SUCCESS:
            return {
                ...initState, // Best practice: reset to initial state
                loading: false,
                message: "Logged out successfully"
            };

        case authConstants.LOGOUT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case authConstants.LOGIN_FAILURE:
            return {
                ...state,
                authenticating: false,
                error: action.payload.error,
                token: null,
                loading: false,
                authenticate: false,
            }
            
        default:
            return state;
    }
}