import { ACTION_LOGOUT, GET_PROVIDER_LIST, GET_PROVIDER_LIST_SUCCESS, GET_PROVIDER_LIST_FAILURE, GET_SERVICE_PROVIDER_BAL_LIST, GET_SERVICE_PROVIDER_BAL_LIST_SUCCESS, GET_SERVICE_PROVIDER_BAL_LIST_FAILURE, GET_WALLET_TYPE, GET_WALLET_TYPE_SUCCESS, GET_WALLET_TYPE_FAILURE } from "../../actions/ActionTypes";

// Initial State for Service Provider Balance
const INITIAL_STATE = {
    // Service Provider List
    SerProviderList: null,
    SerProviderLoading: false,
    SerProviderError: false,

    // Service Provider Bal List
    ServiceProviderBalList: null,
    ServiceProviderBalLoading: false,
    ServiceProviderBalError: false,

    // Wallet Data
    WalletDataList: null,
    WalletDataLaoding: false,
    WalletDataError: false,
}

export default function ServiceProviderBalanceReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Service Provider List method data
        case GET_PROVIDER_LIST:
            return Object.assign({}, state, {
                SerProviderList: null,
                SerProviderLoading: true
            })
        // Set Service Provider List success data
        case GET_PROVIDER_LIST_SUCCESS:
            return Object.assign({}, state, {
                SerProviderList: action.payload,
                SerProviderLoading: false,
            })
        // Set Service Provider List failure data
        case GET_PROVIDER_LIST_FAILURE:
            return Object.assign({}, state, {
                SerProviderList: null,
                SerProviderLoading: false,
                SerProviderError: true
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

        // Handle Service Provider Bal List method data
        case GET_SERVICE_PROVIDER_BAL_LIST:
            return Object.assign({}, state, {
                ServiceProviderBalList: null,
                ServiceProviderBalLoading: true
            })
        // Set Service Provider Bal List success data
        case GET_SERVICE_PROVIDER_BAL_LIST_SUCCESS:
            return Object.assign({}, state, {
                ServiceProviderBalList: action.data,
                ServiceProviderBalLoading: false,
            })
        // Set Service Provider Bal List failure data
        case GET_SERVICE_PROVIDER_BAL_LIST_FAILURE:
            return Object.assign({}, state, {
                ServiceProviderBalList: null,
                ServiceProviderBalLoading: false,
                ServiceProviderBalError: true
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
