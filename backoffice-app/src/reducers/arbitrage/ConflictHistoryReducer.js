import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Conflict History
    GET_CONFLICT_HISTORY,
    GET_CONFLICT_HISTORY_SUCCESS,
    GET_CONFLICT_HISTORY_FAILURE,

    // Clear Conflict History
    CLEAR_CONFLICT_HISTORY,

    // Conflict Recon Process
    CONFLICT_RECON_PROCESS,
    CONFLICT_RECON_PROCESS_SUCCESS,
    CONFLICT_RECON_PROCESS_FAILURE,

    // Get Arbitrage Provider List
    GET_ARBITRAGE_PROVIDER_LIST,
    GET_ARBITRAGE_PROVIDER_LIST_SUCCESS,
    GET_ARBITRAGE_PROVIDER_LIST_FAILURE,

    // Get Arbitrage Currency List
    GET_ARBITRAGE_CURRENCY_LIST,
    GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
    GET_ARBITRAGE_CURRENCY_LIST_FAILURE,

    // Get Provider List
    GET_PROVIDER_LIST,
    GET_PROVIDER_LIST_SUCCESS,
    GET_PROVIDER_LIST_FAILURE,

    // Get Currency List
    GET_CURRENCY_LIST,
    GET_CURRENCY_LIST_SUCCESS,
    GET_CURRENCY_LIST_FAILURE,


} from "../../actions/ActionTypes";

// Initial State for Conflict History
const INITIAL_STATE = {
    // for Conflict History List
    ConflictHistoryList: null,
    ConflictHistoryLoading: false,
    ConflictHistoryError: false,

    // Conflict Recon Process
    ConflictReconProcess: null,
    ConflictReconLoading: false,
    ConflictReconError: false,

    // for Arbitrage Provider List
    ArbitrageProviderList: null,
    ArbitrageProviderLoading: false,
    ArbitrageProviderError: false,

    // Arbitrage Currency List
    ArbitrageCurrencyList: null,
    ArbitrageCurrencyLoading: false,
    ArbitrageCurrencyError: false,

    // Service Provider List
    SerProvList: null,
    SerProvLoading: false,
    SerProvError: false,

    // Currency List
    CurrencyListData: null,
    CurrencyListLoading: false,
    CurrencyListError: false,

}

export default function ConflictHistoryReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Conflict History method data
        case GET_CONFLICT_HISTORY:
            return Object.assign({}, state, {
                ConflictHistoryList: null,
                ConflictHistoryLoading: true
            })
        // Set Conflict History success data
        case GET_CONFLICT_HISTORY_SUCCESS:
            return Object.assign({}, state, {
                ConflictHistoryList: action.data,
                ConflictHistoryLoading: false,
            })
        // Set Conflict History failure data
        case GET_CONFLICT_HISTORY_FAILURE:
            return Object.assign({}, state, {
                ConflictHistoryList: null,
                ConflictHistoryLoading: false,
                ConflictHistoryError: true
            })

        // Handle Conflict History method data
        case CONFLICT_RECON_PROCESS:
            return Object.assign({}, state, {
                ConflictReconProcess: null,
                ConflictReconLoading: true
            })
        // Set Conflict History success data
        case CONFLICT_RECON_PROCESS_SUCCESS:
            return Object.assign({}, state, {
                ConflictReconProcess: action.data,
                ConflictReconLoading: false,
            })
        // Set Conflict History failure data
        case CONFLICT_RECON_PROCESS_FAILURE:
            return Object.assign({}, state, {
                ConflictReconProcess: null,
                ConflictReconLoading: false,
                ConflictReconError: true
            })

        // Clear Conflict History method data
        case CLEAR_CONFLICT_HISTORY:
            return Object.assign({}, state, {
                ConflictHistoryList: null,
                ConflictReconProcess: null,
            })

        // Handle Arbitrage Provider List method data
        case GET_ARBITRAGE_PROVIDER_LIST:
            return Object.assign({}, state, {
                ArbitrageProviderList: null,
                ArbitrageProviderLoading: true
            })
        // Set Arbitrage Provider List success data
        case GET_ARBITRAGE_PROVIDER_LIST_SUCCESS:
            return Object.assign({}, state, {
                ArbitrageProviderList: action.payload,
                ArbitrageProviderLoading: false,
            })
        // Set Arbitrage Provider List failure data
        case GET_ARBITRAGE_PROVIDER_LIST_FAILURE:
            return Object.assign({}, state, {
                ArbitrageProviderList: null,
                ArbitrageProviderLoading: false,
                ArbitrageProviderError: true
            })

        // Handle Arbitrage Currency List method data
        case GET_ARBITRAGE_CURRENCY_LIST:
            return Object.assign({}, state, {
                ArbitrageCurrencyList: null,
                ArbitrageCurrencyLoading: true
            })
        // Set Arbitrage Currency List success data
        case GET_ARBITRAGE_CURRENCY_LIST_SUCCESS:
            return Object.assign({}, state, {
                ArbitrageCurrencyList: action.payload,
                ArbitrageCurrencyLoading: false,
            })
        // Set Arbitrage Currency List failure data
        case GET_ARBITRAGE_CURRENCY_LIST_FAILURE:
            return Object.assign({}, state, {
                ArbitrageCurrencyList: null,
                ArbitrageCurrencyLoading: false,
                ArbitrageCurrencyError: true
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

        // Handle Add Api Plan Configuration Data method data
        case GET_CURRENCY_LIST:
            return Object.assign({}, state, {
                CurrencyListData: null,
                CurrencyListLoading: true
            })
        // Set Add Api Plan Configuration Data success data
        case GET_CURRENCY_LIST_SUCCESS:
            return Object.assign({}, state, {
                CurrencyListData: action.payload,
                CurrencyListLoading: false,
            })
        // Set Add Api Plan Configuration Data failure data
        case GET_CURRENCY_LIST_FAILURE:
            return Object.assign({}, state, {
                CurrencyListData: null,
                CurrencyListLoading: false,
                CurrencyListError: true
            })


        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}