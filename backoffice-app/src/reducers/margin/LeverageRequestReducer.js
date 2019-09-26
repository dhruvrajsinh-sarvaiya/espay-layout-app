// Action types for Leverage Request Report
import {
    // Action Logout 
    ACTION_LOGOUT,

    // Get Leverage Request List
    GET_LEVERAGE_REQUEST_LIST,
    GET_LEVERAGE_REQUEST_LIST_SUCCESS,
    GET_LEVERAGE_REQUEST_LIST_FAILURE,

    // User Data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    // Clear Leverage Request Data
    CLEAR_LEVERAGE_REQ_DATA,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Leverage Request Report
const INITIAL_STATE = {
    // for leverage request module list
    LeverageReqList: null,
    LeverageReqListLoading: false,
    LeverageReqListError: false,

    // for user data
    UserDataList: null,
    UserDataListLoading: false,
    UserDataListError: false,

    // for wallet
    WalletDataList: null,
    WalletDataListLoading: false,
    WalletDataListError: false
}

export default function LeverageRequestReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Get Leverage Request List method data
        case GET_LEVERAGE_REQUEST_LIST:
            return Object.assign({}, state, {
                LeverageReqList: null,
                LeverageReqListLoading: true
            })
        // Set Get Leverage Request List success data
        case GET_LEVERAGE_REQUEST_LIST_SUCCESS:
            return Object.assign({}, state, {
                LeverageReqList: action.data,
                LeverageReqListLoading: false,
            })
        // Set Get Leverage Request List failure data
        case GET_LEVERAGE_REQUEST_LIST_FAILURE:
            return Object.assign({}, state, {
                LeverageReqList: null,
                LeverageReqListLoading: false,
                LeverageReqListError: true
            })

        // Handle Get User Data method data
        case GET_USER_DATA:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataListLoading: true
            })
        // Set Get User Data success data
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                UserDataList: action.payload,
                UserDataListLoading: false,
            })
        // Set Get User Data failure data
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                UserDataList: null,
                UserDataListLoading: false,
                UserDataListError: true
            })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: true
            })
        // Set Get Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, {
                WalletDataList: action.payload,
                WalletDataListLoading: false,
            })
        // Set Get Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: false,
                WalletDataListError: true
            })

        // Clear Leverage Request Data
        case CLEAR_LEVERAGE_REQ_DATA:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}