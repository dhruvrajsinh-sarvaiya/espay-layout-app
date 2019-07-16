// Action types for Site Token Conversion
import {
    // List Currency
    GET_CURRENCY_LIST,
    GET_CURRENCY_LIST_SUCCESS,
    GET_CURRENCY_LIST_FAILURE,

    // List Wallets
    FETCH_WALLET_LIST,
    FETCH_WALLET_LIST_SUCCESS,
    FETCH_WALLET_LIST_FAILURE,

    // Get Site Token
    GET_SITE_TOKEN,
    GET_SITE_TOKEN_SUCCESS,
    GET_SITE_TOKEN_FAILURE,

    // Get Site Token Calculation
    GET_SITE_TOKEN_CALCULATION,
    GET_SITE_TOKEN_CALCULATION_SUCCESS,
    GET_SITE_TOKEN_CALCULATION_FAILURE,

    // Perform Site Token Conversion
    SITE_TOKEN_CONVERSION,
    SITE_TOKEN_CONVERSION_SUCCESS,
    SITE_TOKEN_CONVERSION_FAILURE,

    //For Site Token History
    GET_SITE_TOKEN_REPORT_LIST,
    GET_SITE_TOKEN_REPORT_LIST_SUCCESS,
    GET_SITE_TOKEN_REPORT_LIST_FAILURE,
} from '../actions/ActionTypes';

// Initial state for Site Token Conversion
const initialState = {

    //on Currency List
    CurrencyListFetchData: true,
    CurrencyListIsFetching: false,
    CurrencyListdata: '',

    //For Wallet List
    ListWalletFetchData: true,
    ListWalletIsFetching: false,
    ListWalletData: '',

    //For Site Token Data
    GetSiteTokenFetchData: true,
    GetSiteTokenIsFetching: false,
    GetSiteTokenData: '',

    //For Site Token Calculation
    SiteTokenCalculationFetchData: true,
    SiteTokenCalculationIsFetching: false,
    SiteTokenCalculationData: '',

    //For Site Token Calculation
    SiteTokenConversionFetchData: true,
    SiteTokenConversionIsFetching: false,
    SiteTokenConversionData: '',

    //For Site Token History
    SiteTokenHistoryFetchData: true,
    SiteTokenHistorydata: '',
    SiteTokenHistoryisFetching: false,

}

const SiteTokenConversionReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {

        // Handle Currency List method data
        case GET_CURRENCY_LIST:
            return { ...state, CurrencyListFetchData: true, CurrencyListdata: '', CurrencyListIsFetching: true, ListWalletFetchData: true, GetSiteTokenFetchData: true, SiteTokenCalculationFetchData: true, SiteTokenConversionFetchData: true, };
        // Set Currency List success data
        case GET_CURRENCY_LIST_SUCCESS:
            return { ...state, CurrencyListFetchData: false, CurrencyListdata: action.payload, CurrencyListIsFetching: false, ListWalletFetchData: true, GetSiteTokenFetchData: true, SiteTokenCalculationFetchData: true, SiteTokenConversionFetchData: true, };
        // Set Currency List failure data
        case GET_CURRENCY_LIST_FAILURE:
            return { ...state, CurrencyListFetchData: false, CurrencyListdata: action.payload, CurrencyListIsFetching: false, ListWalletFetchData: true, GetSiteTokenFetchData: true, SiteTokenCalculationFetchData: true, SiteTokenConversionFetchData: true, };

        // Handle Wallet List method data
        case FETCH_WALLET_LIST:
            return { ...state, ListWalletFetchData: true, ListWalletData: '', ListWalletIsFetching: true, CurrencyListFetchData: true, GetSiteTokenFetchData: true, SiteTokenCalculationFetchData: true, SiteTokenConversionFetchData: true, };
        // Set Wallet List success data
        case FETCH_WALLET_LIST_SUCCESS:
            return { ...state, ListWalletFetchData: false, ListWalletData: action.data, ListWalletIsFetching: false, CurrencyListFetchData: true, GetSiteTokenFetchData: true, SiteTokenCalculationFetchData: true, SiteTokenConversionFetchData: true, };
        // Set Wallet List failure data
        case FETCH_WALLET_LIST_FAILURE:
            return { ...state, ListWalletFetchData: false, ListWalletData: action.error, ListWalletIsFetching: false, CurrencyListFetchData: true, GetSiteTokenFetchData: true, SiteTokenCalculationFetchData: true, SiteTokenConversionFetchData: true, };

        // Handle Site Token method data
        case GET_SITE_TOKEN:
            return { ...state, GetSiteTokenFetchData: true, GetSiteTokenData: '', GetSiteTokenIsFetching: true, CurrencyListFetchData: true, ListWalletFetchData: true, SiteTokenCalculationFetchData: true, SiteTokenConversionFetchData: true, };
        // Set Site Token success data
        case GET_SITE_TOKEN_SUCCESS:
            return { ...state, GetSiteTokenFetchData: false, GetSiteTokenData: action.payload, GetSiteTokenIsFetching: false, CurrencyListFetchData: true, ListWalletFetchData: true, SiteTokenCalculationFetchData: true, SiteTokenConversionFetchData: true, };
        // Set Site Token failure data
        case GET_SITE_TOKEN_FAILURE:
            return { ...state, GetSiteTokenFetchData: false, GetSiteTokenData: action.payload, GetSiteTokenIsFetching: false, CurrencyListFetchData: true, ListWalletFetchData: true, SiteTokenCalculationFetchData: true, SiteTokenConversionFetchData: true, };

        // Handle Site Token Calculation method data
        case GET_SITE_TOKEN_CALCULATION:
            return { ...state, SiteTokenCalculationFetchData: true, SiteTokenCalculationData: '', SiteTokenCalculationIsFetching: true, CurrencyListFetchData: true, ListWalletFetchData: true, GetSiteTokenFetchData: true, SiteTokenConversionFetchData: true, };
        // Set Site Token Calculation success data
        case GET_SITE_TOKEN_CALCULATION_SUCCESS:
            return { ...state, SiteTokenCalculationFetchData: false, SiteTokenCalculationData: action.payload, SiteTokenCalculationIsFetching: false, CurrencyListFetchData: true, ListWalletFetchData: true, GetSiteTokenFetchData: true, SiteTokenConversionFetchData: true, };
        // Set Site Token Calculation failure data
        case GET_SITE_TOKEN_CALCULATION_FAILURE:
            return { ...state, SiteTokenCalculationFetchData: false, SiteTokenCalculationData: action.payload, SiteTokenCalculationIsFetching: false, CurrencyListFetchData: true, ListWalletFetchData: true, GetSiteTokenFetchData: true, SiteTokenConversionFetchData: true, };

        // Handle Site Token Conversion method data
        case SITE_TOKEN_CONVERSION:
            return { ...state, SiteTokenConversionFetchData: true, SiteTokenConversionData: '', SiteTokenConversionIsFetching: true, CurrencyListFetchData: true, ListWalletFetchData: true, GetSiteTokenFetchData: true, SiteTokenCalculationFetchData: true, };
        // Set Site Token Conversion succes data
        case SITE_TOKEN_CONVERSION_SUCCESS:
            return { ...state, SiteTokenConversionFetchData: false, SiteTokenConversionData: action.payload, SiteTokenConversionIsFetching: false, CurrencyListFetchData: true, ListWalletFetchData: true, GetSiteTokenFetchData: true, SiteTokenCalculationFetchData: true, };
        // Set Site Token Conversion failure data
        case SITE_TOKEN_CONVERSION_FAILURE:
            return { ...state, SiteTokenConversionFetchData: false, SiteTokenConversionData: action.payload, SiteTokenConversionIsFetching: false, CurrencyListFetchData: true, ListWalletFetchData: true, GetSiteTokenFetchData: true, SiteTokenCalculationFetchData: true, };

        // Handle Site Token Report List method data
        case GET_SITE_TOKEN_REPORT_LIST:
            return Object.assign({}, state, {
                SiteTokenHistoryFetchData: true,
                SiteTokenHistoryisFetching: true,
                SiteTokenHistorydata: ''
            });
        // Set Site Token Report List success and failure data
        case GET_SITE_TOKEN_REPORT_LIST_SUCCESS:
        case GET_SITE_TOKEN_REPORT_LIST_FAILURE:
            return Object.assign({}, state, {
                SiteTokenHistoryFetchData: false,
                SiteTokenHistoryisFetching: false,
                SiteTokenHistorydata: action.payload
            });

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default SiteTokenConversionReducer;