import {
    //top history list 
    LIST_TOPUP_HISTORY,
    LIST_TOPUP_HISTORY_SUCCESS,
    LIST_TOPUP_HISTORY_FAILURE,

    //add Topup Request 
    ADD_TOPUP_REQUEST,
    ADD_TOPUP_REQUEST_SUCCESS,
    ADD_TOPUP_REQUEST_FAILURE,

    //arbitrage currency 
    GET_ARBITRAGE_CURRENCY_LIST,
    GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
    GET_ARBITRAGE_CURRENCY_LIST_FAILURE,

    //arbitrage provider list  
    GET_ARBITRAGE_PROVIDER_LIST,
    GET_ARBITRAGE_PROVIDER_LIST_SUCCESS,
    GET_ARBITRAGE_PROVIDER_LIST_FAILURE,

    //provider address list
    GET_PROVIDER_ADDRESS_LIST,
    GET_PROVIDER_ADDRESS_LIST_SUCCESS,
    GET_PROVIDER_ADDRESS_LIST_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_TOPUP_REQUEST_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    //list
    listFetching: false,
    topupHistoryData: null,

    //add
    addTopupFetching: false,
    addTopupData: null,

    //currency 
    arbitrageCurrencyFetching: false,
    arbitrageCurrencyData: null,

    //Provider
    arbitrageProviderFetching: false,
    arbitrageProviderData: null,

    //Provider address
    providerAddressFetching: false,
    providerAddressData: null,
}

export default function TopUpHistoryReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_TOPUP_REQUEST_DATA:
            return INITIAL_STATE

        //top history list 
        case LIST_TOPUP_HISTORY:
            return { ...state, listFetching: true, topupHistoryData: null };
        //top history list  success
        case LIST_TOPUP_HISTORY_SUCCESS:
            return { ...state, listFetching: false, topupHistoryData: action.payload };
        //top history list failure
        case LIST_TOPUP_HISTORY_FAILURE:
            return { ...state, listFetching: false, topupHistoryData: action.payload };

        //Add Topup Request 
        case ADD_TOPUP_REQUEST:
            return { ...state, addTopupFetching: true, addTopupData: null };
        //Add Topup Request success
        case ADD_TOPUP_REQUEST_SUCCESS:
            return { ...state, addTopupFetching: false, addTopupData: action.payload };
        //Add Topup Request  failure
        case ADD_TOPUP_REQUEST_FAILURE:
            return { ...state, addTopupFetching: false, addTopupData: action.payload };

        //get arbitrage currency 
        case GET_ARBITRAGE_CURRENCY_LIST:
            return { ...state, arbitrageCurrencyFetching: true, arbitrageCurrencyData: null }
        //get arbitrage currency Success
        case GET_ARBITRAGE_CURRENCY_LIST_SUCCESS:
            return { ...state, arbitrageCurrencyFetching: false, arbitrageCurrencyData: action.payload }
        //get arbitrage currency failure
        case GET_ARBITRAGE_CURRENCY_LIST_FAILURE:
            return { ...state, arbitrageCurrencyFetching: false, arbitrageCurrencyData: action.payload }

        //get aritrage provider 
        case GET_ARBITRAGE_PROVIDER_LIST:
            return { ...state, arbitrageProviderFetching: true, arbitrageProviderData: null, }
        //get aritrage provider Success
        case GET_ARBITRAGE_PROVIDER_LIST_SUCCESS:
            return { ...state, arbitrageProviderFetching: false, arbitrageProviderData: action.payload }
        //get aritrage provider failure
        case GET_ARBITRAGE_PROVIDER_LIST_FAILURE:
            return { ...state, arbitrageProviderFetching: false, arbitrageProviderData: action.payload }

        //get aritrage provider address
        case GET_PROVIDER_ADDRESS_LIST:
            return { ...state, providerAddressFetching: true, providerAddressData: null, }
        //get aritrage provider address Success
        case GET_PROVIDER_ADDRESS_LIST_SUCCESS:
            return { ...state, providerAddressFetching: false, providerAddressData: action.payload }
        //get aritrage provider address failure
        case GET_PROVIDER_ADDRESS_LIST_FAILURE:
            return { ...state, providerAddressFetching: false, providerAddressData: action.payload }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}