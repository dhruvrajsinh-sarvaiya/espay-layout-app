
import {
    // Action Logout
    ACTION_LOGOUT,

    // Clear Get Leverage Report
    CLEAR_GET_LEVERAGE_REPORT,

    // Get User Data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    // Get Leverage Report
    GET_LEVERAGE_REPORT,
    GET_LEVERAGE_REPORT_SUCCESS,
    GET_LEVERAGE_REPORT_FAILURE
} from "../../actions/ActionTypes";

// initial state
const INITIAL_STATE = {

    // For loading
    loading: false,

    // For leverage list
    leverageList: null,

    // User Data
    userData: null,

    // Wallet Data
    walletData: null,
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Clear Leverage Report method data
        case CLEAR_GET_LEVERAGE_REPORT: {
            return INITIAL_STATE;
        }

        // Handle Get Leverage Report method data
        case GET_LEVERAGE_REPORT:
            return Object.assign({}, state, {
                loading: true,
                leverageList: null
            })
        // Set Leverage Report Data success data
        case GET_LEVERAGE_REPORT_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                leverageList: action.payload,
            })
        // Set Leverage Report Data failure data
        case GET_LEVERAGE_REPORT_FAILURE:
            return Object.assign({}, state, {
                loading: false,
                errors: action.payload
            })

        // Handle Get User Data method
        case GET_USER_DATA:
            return Object.assign({}, state, {
                userData: null
            })

        // Set User Data success data
        case GET_USER_DATA_SUCCESS:
        // Set User Data failure data
        case GET_USER_DATA_FAILURE:
            Object.assign({}, state, {
                userData: action.payload
            })

        // Handle Get Wallet Type method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, {
                walletData: null
            })

        // Set Wallet Type success data
        case GET_WALLET_TYPE_SUCCESS:
        // Set Wallet Type failure data
        case GET_WALLET_TYPE_FAILURE:
            Object.assign({}, state, {
                walletData: action.payload
            })


        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};
