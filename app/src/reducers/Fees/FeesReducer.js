// Action types for Fees Module
import {
    // Wallet Type Charges list
    GET_WALLET_TYPE_CHARGES_LIST,
    GET_WALLET_TYPE_CHARGES_LIST_SUCCESS,
    GET_WALLET_TYPE_CHARGES_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Clear Wallet Type Charge List
    CLEAR_WALLET_TYPE_CHARGES_LIST
} from '../../actions/ActionTypes';

// Initial state for Fees Module
const INTIAL_STATE = {
    // Fees Data
    feesData: null,
    isFeesFetching: false,
    errorFees: false,
}

export default function FeesReducer(state = INTIAL_STATE, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Wallet Type Charges List method data
        case GET_WALLET_TYPE_CHARGES_LIST:
            return {
                ...state,
                feesData: null,
                isFeesFetching: true,
            }
        // Set Wallet Type Charges List success data
        case GET_WALLET_TYPE_CHARGES_LIST_SUCCESS:
            return {
                ...state,
                feesData: action.payload,
                isFeesFetching: false,
            }
        // Set Wallet Type Charges List failure data
        case GET_WALLET_TYPE_CHARGES_LIST_FAILURE:
            return {
                ...state,
                feesData: null,
                isFeesFetching: false,
                errorFees: true
            }

        // To clear wallet type charge list
        case CLEAR_WALLET_TYPE_CHARGES_LIST: {
            return {
                ...state,
                feesData: null,
            }
        }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}