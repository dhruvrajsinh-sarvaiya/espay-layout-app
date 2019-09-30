import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Arbitrage Allow Order Type List
    GET_ARBI_ALLOW_ORDER_TYPE_LIST,
    GET_ARBI_ALLOW_ORDER_TYPE_LIST_SUCCESS,
    GET_ARBI_ALLOW_ORDER_TYPE_LIST_FAILURE,

    // Clear Arbitrage Order Type Data
    CLEAR_ARBI_ALLOW_ORDER_TYPE_DATA,

    // Allow Order Type Data
    ALLOW_ORDER_TYPE_DATA,
    ALLOW_ORDER_TYPE_DATA_SUCCESS,
    ALLOW_ORDER_TYPE_DATA_FAILURE,
} from "../../actions/ActionTypes";

// Initial State for Arbitrage Allow Order Type
const INITIAL_STATE = {

    // for Arbitarge Allow Order Type List
    AllowOrderTypeList: null,
    AllowOrderTypeLoading: false,
    AllowOrderTypeError: false,

    // Update Order Type Data
    UpdateOrderTypeData: null,
    UpdateOrderTypeLoading: false,
    UpdateOrderTypeError: false,
}

export default function AllowOrderTypeReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Arbitrage Allow Order Type method data
        case GET_ARBI_ALLOW_ORDER_TYPE_LIST:
            return Object.assign({}, state, {
                AllowOrderTypeList: null,
                AllowOrderTypeLoading: true
            })
        // Set Arbitrage Allow Order Type success data
        case GET_ARBI_ALLOW_ORDER_TYPE_LIST_SUCCESS:
            return Object.assign({}, state, {
                AllowOrderTypeList: action.data,
                AllowOrderTypeLoading: false,
            })
        // Set Arbitrage Allow Order Type failure data
        case GET_ARBI_ALLOW_ORDER_TYPE_LIST_FAILURE:
            return Object.assign({}, state, {
                AllowOrderTypeList: null,
                AllowOrderTypeLoading: false,
                AllowOrderTypeError: true
            })

        // Handle Update Order Type Data method data
        case ALLOW_ORDER_TYPE_DATA:
            return Object.assign({}, state, {
                UpdateOrderTypeData: null,
                UpdateOrderTypeLoading: true
            })
        // Set Update Order Type Data success data
        case ALLOW_ORDER_TYPE_DATA_SUCCESS:
            return Object.assign({}, state, {
                UpdateOrderTypeData: action.data,
                UpdateOrderTypeLoading: false,
            })
        // Set Update Order Type Data failure data
        case ALLOW_ORDER_TYPE_DATA_FAILURE:
            return Object.assign({}, state, {
                UpdateOrderTypeData: null,
                UpdateOrderTypeLoading: false,
                UpdateOrderTypeError: true
            })

        // Clear Arbitrage Allow Order Type method data
        case CLEAR_ARBI_ALLOW_ORDER_TYPE_DATA:
            return Object.assign({}, state, {
                AllowOrderTypeList: null,
                UpdateOrderTypeData: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}