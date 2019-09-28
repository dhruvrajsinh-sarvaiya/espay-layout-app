import {
    //getLpChargeConfigList
    ARBITRAGE_LP_CHARGE_CONFIG_LIST,
    ARBITRAGE_LP_CHARGE_CONFIG_LIST_SUCCESS,
    ARBITRAGE_LP_CHARGE_CONFIG_LIST_FAILURE,

    //add edit delete LpChargeConfig
    ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE,
    ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE_SUCCESS,
    ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE_FAILURE,

    //getLpChargeConfigList detail
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL,
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_SUCCESS,
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_FAILURE,

    //add edit delete LpChargeConfig Detail
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE,
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE_SUCCESS,
    ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE_FAILURE,

    //arbitrage currency 
    GET_ARBITRAGE_CURRENCY_LIST,
    GET_ARBITRAGE_CURRENCY_LIST_SUCCESS,
    GET_ARBITRAGE_CURRENCY_LIST_FAILURE,

    //arbitrage provider list  
    GET_ARBITRAGE_PROVIDER_LIST,
    GET_ARBITRAGE_PROVIDER_LIST_SUCCESS,
    GET_ARBITRAGE_PROVIDER_LIST_FAILURE,

    //get trasancation type 
    GET_WALLET_TRANSACTION_TYPE,
    GET_WALLET_TRANSACTION_TYPE_SUCCESS,
    GET_WALLET_TRANSACTION_TYPE_FAILURE,

    //get pair list 
    LIST_PAIR_ARBITRAGE,
    LIST_PAIR_ARBITRAGE_SUCCESS,
    LIST_PAIR_ARBITRAGE_FAILURE,

    //clear data
    ACTION_LOGOUT,
    CLEAR_ARBITRAGE_LP_CHARGE_CONFIG_DATA,
} from "../../actions/ActionTypes";

// Initial State
const INITIAL_STATE = {
    //getLpChargeConfigList
    lpChargeConfigListData: null,
    lpChargeConfigListFetching: false,

    //add edit delete LpChargeConfig
    lpChargeConfigAddEditDeleteData: null,
    lpChargeConfigAddEditDeleteFetching: false,

    //getLpChargeConfigList detail
    lpChargeConfigDetailListData: null,
    lpChargeConfigDetailListFetching: false,

    //add edit delete LpChargeConfig Detail
    lpChargeConfigDetailAddEditDeleteData: null,
    lpChargeConfigDetailAddEditDeleteFetching: false,

    //currency 
    arbitrageCurrencyFetching: false,
    arbitrageCurrencyData: null,

    //Provider
    arbitrageProviderFetching: false,
    arbitrageProviderData: null,

    //wallettypes
    isWalletTransactionType: false,
    walletTransactionType: null,

    //arbitrage pair list
    arbitragePairListFetching: false,
    arbitragePairListData: null,
}

export default function ArbitrageLpChargeConfigReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        //clear data 
        case CLEAR_ARBITRAGE_LP_CHARGE_CONFIG_DATA:
            return INITIAL_STATE

        //LpChargeConfigList
        case ARBITRAGE_LP_CHARGE_CONFIG_LIST:
            return { ...state, lpChargeConfigListFetching: true, lpChargeConfigListData: null };
        //LpChargeConfigList success
        case ARBITRAGE_LP_CHARGE_CONFIG_LIST_SUCCESS:
            return { ...state, lpChargeConfigListFetching: false, lpChargeConfigListData: action.payload };
        //LpChargeConfigList failure
        case ARBITRAGE_LP_CHARGE_CONFIG_LIST_FAILURE:
            return { ...state, lpChargeConfigListFetching: false, lpChargeConfigListData: action.payload };

        //add edit delete LpChargeConfig
        case ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE:
            return { ...state, lpChargeConfigAddEditDeleteFetching: true, lpChargeConfigAddEditDeleteData: null };
        //add edit delete LpChargeConfig success
        case ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE_SUCCESS:
            return { ...state, lpChargeConfigAddEditDeleteFetching: false, lpChargeConfigAddEditDeleteData: action.payload };
        //add edit delete LpChargeConfig failure
        case ARBITRAGE_LP_CHARGE_CONFIG_INSERT_UPDATE_FAILURE:
            return { ...state, lpChargeConfigAddEditDeleteFetching: false, lpChargeConfigAddEditDeleteData: action.payload };

        //LpChargeConfigList detail
        case ARBITRAGE_LP_CHARGE_CONFIG_DETAIL:
            return { ...state, lpChargeConfigDetailListFetching: true, lpChargeConfigDetailListData: null };
        //LpChargeConfigList detail success
        case ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_SUCCESS:
            return { ...state, lpChargeConfigDetailListFetching: false, lpChargeConfigDetailListData: action.payload };
        //LpChargeConfigList detail failure
        case ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_FAILURE:
            return { ...state, lpChargeConfigDetailListFetching: false, lpChargeConfigDetailListData: action.payload };

        //add edit delete detail LpChargeConfig
        case ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE:
            return { ...state, lpChargeConfigDetailAddEditDeleteFetching: true, lpChargeConfigDetailAddEditDeleteData: null };
        //add edit delete detail LpChargeConfig success
        case ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE_SUCCESS:
            return { ...state, lpChargeConfigDetailAddEditDeleteFetching: false, lpChargeConfigDetailAddEditDeleteData: action.payload };
        //add edit delete detail LpChargeConfig failure
        case ARBITRAGE_LP_CHARGE_CONFIG_DETAIL_INSERT_UPDATE_FAILURE:
            return { ...state, lpChargeConfigDetailAddEditDeleteFetching: false, lpChargeConfigDetailAddEditDeleteData: action.payload };

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

        //handle get wallet type Method
        case GET_WALLET_TRANSACTION_TYPE:
            return { ...state, isWalletTransactionType: true, walletTransactionType: null };
        //handle set wallet type Success Method
        case GET_WALLET_TRANSACTION_TYPE_SUCCESS:
            return { ...state, isWalletTransactionType: false, walletTransactionType: action.payload };
        //handle set wallet type failure Method
        case GET_WALLET_TRANSACTION_TYPE_FAILURE:
            return { ...state, isWalletTransactionType: false, walletTransactionType: action.payload };

        //handle get wallet type Method
        case LIST_PAIR_ARBITRAGE:
            return { ...state, arbitragePairListFetching: true, arbitragePairListData: null };
        //handle set wallet type Success Method
        case LIST_PAIR_ARBITRAGE_SUCCESS:
            return { ...state, arbitragePairListFetching: false, arbitragePairListData: action.payload };
        //handle set wallet type failure Method
        case LIST_PAIR_ARBITRAGE_FAILURE:
            return { ...state, arbitragePairListFetching: false, arbitragePairListData: action.payload };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}