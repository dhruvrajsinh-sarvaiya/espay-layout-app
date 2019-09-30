import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Deposit Route List
    GET_DEPOSIT_ROUTE_LIST,
    GET_DEPOSIT_ROUTE_LIST_SUCCESS,
    GET_DEPOSIT_ROUTE_LIST_FAILURE,

    // Get Wallet Type
    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE,

    // Get Provider List
    GET_PROVIDERS_LIST,
    GET_PROVIDER_LIST_SUCCESS,
    GET_PROVIDER_LIST_FAILURE,

    // Clear Deposit Route Data
    CLEAR_DEPOSIT_ROUTE_DATA,

    // Delete Deposit Route Data
    DELETE_DEPOSIT_ROUTE_DATA,
    DELETE_DEPOSIT_ROUTE_DATA_SUCCESS,
    DELETE_DEPOSIT_ROUTE_DATA_FAILURE,

    // Add Deposit Route
    ADD_DEPOSIT_ROUTE,
    ADD_DEPOSIT_ROUTE_SUCCESS,
    ADD_DEPOSIT_ROUTE_FAILURE
} from "../../actions/ActionTypes";

// Initial State for Deposit Route Module
const INITIAL_STATE = {

    // for Deposit Route List
    DepositRouteList: null,
    DepositRouteLoading: false,
    DepositRouteError: false,

    // for wallet
    WalletDataList: null,
    WalletDataListLoading: false,
    WalletDataListError: false,

    // for service provider
    ServiceProviderList: null,
    ServiceProviderLoading: false,
    ServiceProviderError: false,

    // for delete deposit route
    DeleteDepositRoute: null,
    DeleteDepositRouteLoading: false,
    DeleteDepositRouteError: false,

    // Add Deposit Route
    AddDepositRoute: null,
    AddDepositRouteLoading: false,
    AddDepositRouteError: false,
}

export default function DepositRouteReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Deposit Route List method data
        case GET_DEPOSIT_ROUTE_LIST:
            return Object.assign({}, state, {
                DepositRouteList: null,
                DepositRouteLoading: true
            })
        // Set Deposit Route List success data
        case GET_DEPOSIT_ROUTE_LIST_SUCCESS:
            return Object.assign({}, state, {
                DepositRouteList: action.data,
                DepositRouteLoading: false,
            })
        // Set Deposit Route List failure data
        case GET_DEPOSIT_ROUTE_LIST_FAILURE:
            return Object.assign({}, state, {
                DepositRouteList: null,
                DepositRouteLoading: false,
                DepositRouteError: true
            })

        // Handle Get Wallet Data method data
        case GET_WALLET_TYPE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: true
            })
        // Set Wallet Data success data
        case GET_WALLET_TYPE_SUCCESS:
            return Object.assign({}, state, {
                WalletDataList: action.payload,
                WalletDataListLoading: false,
            })
        // Set Wallet Data failure data
        case GET_WALLET_TYPE_FAILURE:
            return Object.assign({}, state, {
                WalletDataList: null,
                WalletDataListLoading: false,
                WalletDataListError: true
            })

        // Handle Get Service Provider method data
        case GET_PROVIDERS_LIST:
            return Object.assign({}, state, {
                ServiceProviderList: null,
                ServiceProviderLoading: true
            })
        // Set Service Provider success data
        case GET_PROVIDER_LIST_SUCCESS:
            return Object.assign({}, state, {
                ServiceProviderList: action.payload,
                ServiceProviderLoading: false,
            })
        // Set Service Provider failure data
        case GET_PROVIDER_LIST_FAILURE:
            return Object.assign({}, state, {
                ServiceProviderList: null,
                ServiceProviderLoading: false,
                ServiceProviderError: true
            })

        // Handle Delete Deposit Route method data
        case DELETE_DEPOSIT_ROUTE_DATA:
            return Object.assign({}, state, {
                DeleteDepositRoute: null,
                DeleteDepositRouteLoading: true
            })
        // Set Delete Deposit Route success data
        case DELETE_DEPOSIT_ROUTE_DATA_SUCCESS:
            return Object.assign({}, state, {
                DeleteDepositRoute: action.data,
                DeleteDepositRouteLoading: false,
            })
        // Set Delete Deposit Route failure data
        case DELETE_DEPOSIT_ROUTE_DATA_FAILURE:
            return Object.assign({}, state, {
                DeleteDepositRoute: null,
                DeleteDepositRouteLoading: false,
                DeleteDepositRouteError: true
            })

        // Handle Add Deposit Route method data
        case ADD_DEPOSIT_ROUTE:
            return Object.assign({}, state, {
                AddDepositRoute: null,
                AddDepositRouteLoading: true
            })
        // Set Add Deposit Route success data
        case ADD_DEPOSIT_ROUTE_SUCCESS:
            return Object.assign({}, state, {
                AddDepositRoute: action.data,
                AddDepositRouteLoading: false,
            })
        // Set Add Deposit Route failure data
        case ADD_DEPOSIT_ROUTE_FAILURE:
            return Object.assign({}, state, {
                AddDepositRoute: null,
                AddDepositRouteLoading: false,
                AddDepositRouteError: true
            })

        // Handle Clear Deposit Route method data
        case CLEAR_DEPOSIT_ROUTE_DATA:
            return Object.assign({}, state, {
                DeleteDepositRoute: null,
                DepositRouteList: null,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}