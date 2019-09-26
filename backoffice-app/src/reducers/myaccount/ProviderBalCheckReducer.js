import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Provider Balance Check List
    GET_PROVIDER_BAL_LIST,
    GET_PROVIDER_BAL_LIST_SUCCESS,
    GET_PROVIDER_BAL_LIST_FAILURE,

    // Get Provider List
    GET_PROVIDER_LIST,
    GET_PROVIDER_LIST_SUCCESS,
    GET_PROVIDER_LIST_FAILURE,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Provider Bal Check Balance
const INITIAL_STATE = {
    // Service Provider List
    SerProvList: null,
    SerProvLoading: false,
    SerProvError: false,

    // Provider Bal Check Bal List
    ProviderBalCheckList: null,
    ProviderBalCheckLoading: false,
    ProviderBalCheckError: false,

    // Wallet Data
    WalletDataList: null,
    WalletDataLaoding: false,
    WalletDataError: false,
}

export default function ProviderBalCheckReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE;

        // Handle Provider Bal Check List method data
        case GET_PROVIDER_BAL_LIST:
            return Object.assign({}, state, {
                ProviderBalCheckList: null,
                ProviderBalCheckLoading: true
            })
        // Set Provider Bal Check List success data
        case GET_PROVIDER_BAL_LIST_SUCCESS:
            return Object.assign({}, state, {
                ProviderBalCheckList: action.data,
                ProviderBalCheckLoading: false,
            })
        // Set Provider Bal Check List failure data
        case GET_PROVIDER_BAL_LIST_FAILURE:
            return Object.assign({}, state, {
                ProviderBalCheckList: null,
                ProviderBalCheckLoading: false,
                ProviderBalCheckError: true
            })

        // Handle Service Provider List method data
        case GET_PROVIDER_LIST:
            return Object.assign({}, state, {
                SerProvList: null,
                SerProvLoading: true
            })
        // Set Service Provider List success data
        case GET_PROVIDER_LIST_SUCCESS:
            return Object.assign({}, state, {
                SerProvList: action.payload,
                SerProvLoading: false,
            })
        // Set Service Provider List failure data
        case GET_PROVIDER_LIST_FAILURE:
            return Object.assign({}, state, {
                SerProvList: null,
                SerProvLoading: false,
                SerProvError: true
            })

        // Handle Wallet Type List method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataLaoding: true
            })
        // Set Wallet Type List success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, {
                WalletDataList: action.payload,
                WalletDataLaoding: false,
            })
        // Set Wallet Type List failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataLaoding: false,
                WalletDataError: false,
            })


        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}