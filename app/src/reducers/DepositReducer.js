// Action types for Deposit Module
import {
    // Fetch Balance
    FETCH_BALANCE,
    FETCH_BALANCE_SUCCESS,
    FETCH_BALANCE_FAILURE,

    // Fetch Deposit History Data
    FETCHING_DEPOSIT_HISTORY_DATA,
    FETCH_DEPOSIT_HISTORY_SUCCESS,
    FETCH_DEPOSIT_HISTORY_FAILURE,

    // Generate New Address
    GENERATE_NEW_ADDRESS,
    GENERATE_NEW_ADDRESS_SUCCESS,
    GENERATE_NEW_ADDRESS_FAILURE,
    DropdownChange,

    // get wallets and balance,
    GET_AD_WALLETS,
    GET_AD_WALLETS_SUCCESS,
    GET_AD_WALLETS_FAILURE,

    //get wallet Balance
    GET_AD_BALANCE,
    GET_AD_BALANCE_SUCCESS,
    GET_AD_BALANCE_FAILURE,

    //get defualt wallet address
    GET_DEFAULT_ADD,
    GET_DEFAULT_ADD_SUCCESS,
    GET_DEFAULT_ADD_FAILURE,
    ACTION_LOGOUT,

    //get fee & min max Deposit limit
    GET_FEEANDLIMIT,
    GET_FEEANDLIMIT_SUCCESS,
    GET_FEEANDLIMIT_FAILURE,
    COIN_SELECT_CLEAR,
} from "../actions/ActionTypes";

// Initial state for Deposit Module
const INTIAL_STATE = {

    //Initial State For Deposit Request Data
    BalanceFetchData: true,
    loading: false,
    Balancedata: '',
    AvailableBalance: '',
    symbol: '',
    TotalBalance: '',
    inOrder: '',
    Address: '',

    // Initial State For Deposit History Data
    DepositHistoryFetchData: true,
    DepositHistorydata: '',
    DepositIsFetching: false,

    // Initial State For Generate New Address Data
    GenerateNewAddressFetchData: true,
    GenerateNewAddressdata: '',

    //For Wallet List Data
    WalletListData: '',
    WalletListFetchData: true,

    //For Wallet Balance Data
    WalletBalanceData: '',
    WalletBalanceFetchData: true,
    WalletBalanceIsFetching: false,

    //For get Default Address
    DefaultAddressData: '',
    DefaultAddressFetchData: true,
    DefaultAddressIsFetching: false,

    //For Fee and Limits
    FeeLimitFetchData: true,
    FeeLimitData: '',
    FeeLimitIsFetching: false,
}

const DepositCoinReducers = (state = INTIAL_STATE, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // To reset initial state on clear
        case COIN_SELECT_CLEAR: {
            return {
                ...state,
                BalanceFetchData: true,
            }
        }

        // Handle Fee And Limit method data
        case GET_FEEANDLIMIT:
            return {
                ...state,
                FeeLimitIsFetching: true,
                FeeLimitData: '',
                FeeLimitFetchData: true,
                BalanceFetchData: true,
                GenerateNewAddressFetchData: true,
                WalletListFetchData: true,
                WalletBalanceFetchData: true,
                DefaultAddressFetchData: true,
            }
        // Set Fee And Limit success data
        case GET_FEEANDLIMIT_SUCCESS:
            return {
                ...state,
                FeeLimitIsFetching: false,
                FeeLimitData: action.payload,
                FeeLimitFetchData: false,
                BalanceFetchData: true,
                GenerateNewAddressFetchData: true,
                WalletListFetchData: true,
                WalletBalanceFetchData: true,
                DefaultAddressFetchData: true,
            }
        // Set Fee And Limit failure data
        case GET_FEEANDLIMIT_FAILURE:
            return {
                ...state,
                FeeLimitIsFetching: false,
                FeeLimitData: action.payload,
                FeeLimitFetchData: false,
                BalanceFetchData: true,
                GenerateNewAddressFetchData: true,
                WalletListFetchData: true,
                WalletBalanceFetchData: true,
                DefaultAddressFetchData: true,
            }

        // Handle Fetch Balance method data
        case FETCH_BALANCE:
            return Object.assign({}, state, {
                loading: true,
                BalanceFetchData: true,
                Balancedata: '',
                GenerateNewAddressFetchData: true,
                WalletListFetchData: true,
                WalletBalanceFetchData: true,
                DefaultAddressFetchData: true,
                DepositHistoryFetchData: true,
                FeeLimitFetchData: true,
            });
        // Set Fetch Balance success data
        case FETCH_BALANCE_SUCCESS:
            return Object.assign({}, state, {
                BalanceFetchData: false,
                loading: false,
                Balancedata: action.data,
                GenerateNewAddressFetchData: true,
                WalletListFetchData: true,
                WalletBalanceFetchData: true,
                DefaultAddressFetchData: true,
                DepositHistoryFetchData: true,
                FeeLimitFetchData: true,
            });
        // Set Fetch Balance failure data
        case FETCH_BALANCE_FAILURE:
            return Object.assign({}, state, {
                BalanceFetchData: false,
                loading: false,
                Balancedata: action.e,
                GenerateNewAddressFetchData: true,
                WalletListFetchData: true,
                WalletBalanceFetchData: true,
                DefaultAddressFetchData: true,
                DepositHistoryFetchData: true,
                FeeLimitFetchData: true,
            });

        // Handle Deposit History method data
        case FETCHING_DEPOSIT_HISTORY_DATA:
            return Object.assign({}, state, {
                DepositHistoryFetchData: true,
                DepositIsFetching: true,
                DepositHistorydata: '',
                BalanceFetchData: true,
            });
        // Set Deposit History success data
        case FETCH_DEPOSIT_HISTORY_SUCCESS:
            return Object.assign({}, state, {
                DepositHistoryFetchData: false,
                DepositIsFetching: false,
                DepositHistorydata: action.data,
                BalanceFetchData: true,
            });
        // Set Deposit History failure data
        case FETCH_DEPOSIT_HISTORY_FAILURE:
            return Object.assign({}, state, {
                DepositHistoryFetchData: false,
                DepositIsFetching: false,
                DepositHistorydata: action.e,
                BalanceFetchData: true,
            });

        // Handle Generate New Address method data
        case GENERATE_NEW_ADDRESS:
            return Object.assign({}, state, {
                GenerateNewAddressFetchData: true,
                loading: true,
                GenerateNewAddressdata: '',
                BalanceFetchData: true,
                WalletListFetchData: true,
                WalletBalanceFetchData: true,
                DefaultAddressFetchData: true,
                FeeLimitFetchData: true,
            });
        // Set Generate New Address success data
        case GENERATE_NEW_ADDRESS_SUCCESS:
            return Object.assign({}, state, {
                GenerateNewAddressFetchData: false,
                loading: false,
                GenerateNewAddressdata: action.data,
                BalanceFetchData: true,
                WalletListFetchData: true,
                WalletBalanceFetchData: true,
                DefaultAddressFetchData: true,
                FeeLimitFetchData: true,
            });
        // Set Generate New Address failure data
        case GENERATE_NEW_ADDRESS_FAILURE:
            return Object.assign({}, state, {
                GenerateNewAddressFetchData: false,
                loading: false,
                GenerateNewAddressdata: action.e,
                BalanceFetchData: true,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
            });

        case DropdownChange:
            return Object.assign({}, state, {
                BalanceFetchData: true,
                GenerateNewAddressFetchData: true,
                WalletListFetchData: true,
                DepositHistoryFetchData: true,
                WalletBalanceFetchData: true,
                DefaultAddressFetchData: true,
                FeeLimitFetchData: true,
            });

        // Handle Add Wallets method data
        case GET_AD_WALLETS:
            return { ...state, loading: true, WalletListFetchData: true, WalletListData: '', BalanceFetchData: true, GenerateNewAddressFetchData: true, WalletBalanceFetchData: true, DefaultAddressFetchData: true, FeeLimitFetchData: true, };
        // Set Add Wallets success data
        case GET_AD_WALLETS_SUCCESS:
            return { ...state, loading: false, WalletListFetchData: false, WalletListData: action.payload, BalanceFetchData: true, GenerateNewAddressFetchData: true, WalletBalanceFetchData: true, DefaultAddressFetchData: true, FeeLimitFetchData: true, };
        // Set Add Wallets failure data
        case GET_AD_WALLETS_FAILURE:
            return { ...state, loading: false, WalletListFetchData: false, WalletListData: action.payload, BalanceFetchData: true, GenerateNewAddressFetchData: true, WalletBalanceFetchData: true, DefaultAddressFetchData: true, FeeLimitFetchData: true, };

        // Handle Add Balance method data
        case GET_AD_BALANCE:
            return { ...state, WalletBalanceIsFetching: true, WalletBalanceData: '', WalletBalanceFetchData: true, BalanceFetchData: true, GenerateNewAddressFetchData: true, WalletListFetchData: true, DefaultAddressFetchData: true, FeeLimitFetchData: true, }
        // Set Add Balance success data
        case GET_AD_BALANCE_SUCCESS:
            return { ...state, WalletBalanceIsFetching: false, WalletBalanceData: action.payload, WalletBalanceFetchData: false, BalanceFetchData: true, GenerateNewAddressFetchData: true, WalletListFetchData: true, DefaultAddressFetchData: true, FeeLimitFetchData: true, }
        // Set Add Balance failure data
        case GET_AD_BALANCE_FAILURE:
            return { ...state, WalletBalanceIsFetching: false, WalletBalanceData: action.payload, WalletBalanceFetchData: false, BalanceFetchData: true, GenerateNewAddressFetchData: true, WalletListFetchData: true, DefaultAddressFetchData: true, FeeLimitFetchData: true, }

        // Handle Defaul Address method data
        case GET_DEFAULT_ADD:
            return { ...state, DefaultAddressIsFetching: true, DefaultAddressData: '', DefaultAddressFetchData: true, BalanceFetchData: true, GenerateNewAddressFetchData: true, WalletListFetchData: true, WalletBalanceFetchData: true, FeeLimitFetchData: true, }
        // Set Defaul Address success data
        case GET_DEFAULT_ADD_SUCCESS:
            return { ...state, DefaultAddressIsFetching: false, DefaultAddressData: action.payload, DefaultAddressFetchData: false, BalanceFetchData: true, GenerateNewAddressFetchData: true, WalletListFetchData: true, WalletBalanceFetchData: true, FeeLimitFetchData: true, }
        // Set Defaul Address failure data
        case GET_DEFAULT_ADD_FAILURE:
            return { ...state, DefaultAddressIsFetching: false, DefaultAddressData: action.payload, DefaultAddressFetchData: false, BalanceFetchData: true, GenerateNewAddressFetchData: true, WalletListFetchData: true, WalletBalanceFetchData: true, FeeLimitFetchData: true, }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default DepositCoinReducers;



