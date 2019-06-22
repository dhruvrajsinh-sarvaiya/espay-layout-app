// Action types for Withdraw Module
import {
    // Fetch Withdraw Request
    FetchWithdrawRequest,
    WithdrawRequestSuccess,
    WithdrawRequestFailure,

    // Generate Address
    FetchGenerateAddress,
    GenerateAddressSuccess,
    GenerateAddressFailure,

    // Fetch Balance
    FETCH_BALANCE,
    FETCH_BALANCE_SUCCESS,
    FETCH_BALANCE_FAILURE,

    // Fetching Withdraw History Data
    FETCHING_WITHFRAW_HISTORY_DATA,
    FETCHING_WITHDRAW_HISTORY_DATA_SUCCESS,
    FETCHING_WITHDRAW_HISTORY_DATA_FAILURE,

    // Dropdown Change
    DropdownChange,

    // get wallets and balance,
    GET_AD_WALLETS,
    GET_AD_WALLETS_SUCCESS,
    GET_AD_WALLETS_FAILURE,

    //get wallet Balance
    GET_AD_BALANCE,
    GET_AD_BALANCE_SUCCESS,
    GET_AD_BALANCE_FAILURE,

    //get fee & min max withdraw limit
    GET_FEEANDLIMIT,
    GET_FEEANDLIMIT_SUCCESS,
    GET_FEEANDLIMIT_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Verify 2FA Withdraw
    VERIFY_2FA_WITHDRAW,
    VERIFY_2FA_WITHDRAW_SUCCESS,
    VERIFY_2FA_WITHDRAW_FAILURE,

    //For Resend Withdrawal Confirmation Mail
    RESEND_WITHDRAWAL_EMAIL,
    RESEND_WITHDRAWAL_EMAIL_SUCCESS,
    RESEND_WITHDRAWAL_EMAIL_FAILURE,
} from '../actions/ActionTypes';

// Initial State for Withdraw
const initialState = {

    //Initial State For Withdraw Request Data
    BalanceFetchData: true,
    Balancedata: '',

    //For Do Withdraw
    WithdrawFetchData: true,
    WithdrawData: '',

    GenerateAddressFetchData: true,
    GenerateAddressIsFetchData: false,
    GenerateAddressData: '',

    //Initial State For Withdraw History Data
    WithdrawHistoryFetchData: true,
    WithdrawHistorydata: '',
    WithdrawHistoryisFetching: false,

    //Initial State For Resend Withdraw Email
    ResendEmailFetchData: true,
    ResendEmailData: '',
    ResendEmailIsFetching: false,

    //For Wallet List Data
    WalletListData: '',
    WalletListFetchData: true,
    loading: false,

    //For Wallet Balance Data
    WalletBalanceData: '',
    WalletBalanceIsFetching: false,
    WalletBalanceFetchData: true,

    //For Fee and Limits
    FeeLimitFetchData: true,
    FeeLimitIsFetching: false,
    FeeLimitData: '',

    // for 2FA Google Auth Verify
    VerifyGoogleAuthData: '',
    VerifyGoogleAuthFetchData: true,
    VerifyGoogleAuthIsFetching: false,
}

const WithdrawReducer = (state = initialState, action) => {
    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle Verify 2FA method data
        case VERIFY_2FA_WITHDRAW:
            return {
                ...state, VerifyGoogleAuthIsFetching: true,
                VerifyGoogleAuthData: '',
                VerifyGoogleAuthFetchData: true,
                WithdrawFetchData: true,
                BalanceFetchData: true,
                GenerateAddressFetchData: true,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                WithdrawHistoryFetchData: true,
                ResendEmailFetchData: true,
            };

        // Set Verify 2FA success data
        case VERIFY_2FA_WITHDRAW_SUCCESS:
            return {
                ...state, VerifyGoogleAuthIsFetching: false,
                VerifyGoogleAuthData: action.payload,
                VerifyGoogleAuthFetchData: false,
                WithdrawFetchData: true,
                BalanceFetchData: true,
                GenerateAddressFetchData: true,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                WithdrawHistoryFetchData: true,
                ResendEmailFetchData: true,
            };
        // Set Verify 2FA failure data
        case VERIFY_2FA_WITHDRAW_FAILURE:
            return {
                ...state, VerifyGoogleAuthIsFetching: false,
                VerifyGoogleAuthData: action.payload,
                VerifyGoogleAuthFetchData: false,
                WithdrawFetchData: true,
                BalanceFetchData: true,
                GenerateAddressFetchData: true,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                WithdrawHistoryFetchData: true,
                ResendEmailFetchData: true,
            };

        // Handle dropdown change method
        case DropdownChange:
            return Object.assign({}, state, {
                WithdrawFetchData: true,
                BalanceFetchData: true,
                GenerateAddressFetchData: true,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                WithdrawHistoryFetchData: true,
                ResendEmailFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });

        // Handle Fetch Balance method data
        case FETCH_BALANCE:
            return Object.assign({}, state, {
                WithdrawFetchData: true,
                loading: true,
                BalanceFetchData: true,
                GenerateAddressFetchData: true,
                Balancedata: '',
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                DepositHistoryFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });
        // Set Fetch Balance success data
        case FETCH_BALANCE_SUCCESS:
            return Object.assign({}, state, {
                GenerateAddressFetchData: true,
                BalanceFetchData: false,
                loading: false,
                Balancedata: action.data,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                DepositHistoryFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });
        // Set Fetch Balance failure data
        case FETCH_BALANCE_FAILURE:
            return Object.assign({}, state, {
                GenerateAddressFetchData: true,
                BalanceFetchData: false,
                loading: false,
                Balancedata: action.e,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                DepositHistoryFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });

        // Handle Fetch Withdraw Request method data
        case FetchWithdrawRequest:
            return Object.assign({}, state, {
                GenerateAddressFetchData: true,
                BalanceFetchData: true,
                WithdrawFetchData: true,
                loading: true,
                WithdrawData: '',
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });
        // Set Fetch Withdraw Request success data
        case WithdrawRequestSuccess:
            return Object.assign({}, state, {
                GenerateAddressFetchData: true,
                BalanceFetchData: true,
                WithdrawFetchData: false,
                loading: false,
                WithdrawData: action.data,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });
        // Set Fetch Withdraw Request failure data
        case WithdrawRequestFailure:
            return Object.assign({}, state, {
                GenerateAddressFetchData: true,
                BalanceFetchData: true,
                WithdrawFetchData: false,
                loading: false,
                WithdrawData: action.e,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });

        // Handle Generate Address method data
        case FetchGenerateAddress:
            return Object.assign({}, state, {
                GenerateAddressIsFetchData: true,
                GenerateAddressFetchData: true,
                GenerateAddressData: '',
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });
        // Set Generate Address success data
        case GenerateAddressSuccess:
            return Object.assign({}, state, {
                GenerateAddressIsFetchData: false,
                GenerateAddressFetchData: false,
                GenerateAddressData: action.data,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });
        // Set Generate Address failure data
        case GenerateAddressFailure:
            return Object.assign({}, state, {
                GenerateAddressIsFetchData: false,
                GenerateAddressFetchData: false,
                GenerateAddressData: action.e,
                WalletListFetchData: true,
                FeeLimitFetchData: true,
                WalletBalanceFetchData: true,
                VerifyGoogleAuthFetchData: true,
            });

        // Handle Withdraw History List method data
        case FETCHING_WITHFRAW_HISTORY_DATA:
            return Object.assign({}, state, {
                WithdrawHistoryFetchData: true,
                WithdrawHistoryisFetching: true,
                WithdrawHistorydata: '',
                BalanceFetchData: true,
                ResendEmailFetchData: true,
            });
        // Set Withdraw History List success data
        case FETCHING_WITHDRAW_HISTORY_DATA_SUCCESS:
            return Object.assign({}, state, {
                BalanceFetchData: true,
                WithdrawHistoryFetchData: false,
                WithdrawHistoryisFetching: false,
                WithdrawHistorydata: action.data,
                ResendEmailFetchData: true,
            });
        // Set Withdraw History List failure data
        case FETCHING_WITHDRAW_HISTORY_DATA_FAILURE:
            return Object.assign({}, state, {
                BalanceFetchData: true,
                WithdrawHistoryFetchData: false,
                WithdrawHistoryisFetching: false,
                WithdrawHistorydata: action.e,
                ResendEmailFetchData: true,
            });

        // Handle Resend Withdrawal Email method data
        case RESEND_WITHDRAWAL_EMAIL:
            return Object.assign({}, state, {
                ResendEmailFetchData: true,
                ResendEmailData: '',
                ResendEmailIsFetching: true,
                WithdrawHistoryFetchData: true,
                BalanceFetchData: true,
            });
        // Set Resend Withdrawal Email success data
        case RESEND_WITHDRAWAL_EMAIL_SUCCESS:
            return Object.assign({}, state, {
                ResendEmailFetchData: false,
                ResendEmailData: action.payload,
                ResendEmailIsFetching: false,
                WithdrawHistoryFetchData: true,
                BalanceFetchData: true,
            });
        // Set Resend Withdrawal Email failure data
        case RESEND_WITHDRAWAL_EMAIL_FAILURE:
            return Object.assign({}, state, {
                ResendEmailFetchData: false,
                ResendEmailData: action.payload,
                ResendEmailIsFetching: false,
                WithdrawHistoryFetchData: true,
                BalanceFetchData: true,
            });

        // Handle Ad Balance method data
        case GET_AD_BALANCE:
            return { ...state, WalletBalanceIsFetching: true, WalletBalanceData: '', WalletBalanceFetchData: true, BalanceFetchData: true, WithdrawFetchData: true, WalletListFetchData: true, GenerateAddressFetchData: true, FeeLimitFetchData: true, VerifyGoogleAuthFetchData: true, }
        // Set Ad Balance success data
        case GET_AD_BALANCE_SUCCESS:
            return { ...state, WalletBalanceIsFetching: false, WalletBalanceData: action.payload, WalletBalanceFetchData: false, BalanceFetchData: true, WithdrawFetchData: true, WalletListFetchData: true, GenerateAddressFetchData: true, FeeLimitFetchData: true, VerifyGoogleAuthFetchData: true, }
        // Set Ad Balance failure data
        case GET_AD_BALANCE_FAILURE:
            return { ...state, WalletBalanceIsFetching: false, WalletBalanceData: action.payload, WalletBalanceFetchData: false, BalanceFetchData: true, WithdrawFetchData: true, WalletListFetchData: true, GenerateAddressFetchData: true, FeeLimitFetchData: true, VerifyGoogleAuthFetchData: true, }

        // Handle Wallet List method data
        case GET_AD_WALLETS:
            return { ...state, loading: true, WalletListFetchData: true, WalletListData: '', BalanceFetchData: true, WithdrawFetchData: true, GenerateAddressFetchData: true, WalletBalanceFetchData: true, FeeLimitFetchData: true, VerifyGoogleAuthFetchData: true, };
        // Set Wallet List success data
        case GET_AD_WALLETS_SUCCESS:
            return { ...state, loading: false, WalletListFetchData: false, WalletListData: action.payload, BalanceFetchData: true, WithdrawFetchData: true, GenerateAddressFetchData: true, WalletBalanceFetchData: true, FeeLimitFetchData: true, VerifyGoogleAuthFetchData: true, };
        // Set Wallet List failure data
        case GET_AD_WALLETS_FAILURE:
            return { ...state, loading: false, WalletListFetchData: false, WalletListData: action.payload, BalanceFetchData: true, WithdrawFetchData: true, GenerateAddressFetchData: true, WalletBalanceFetchData: true, FeeLimitFetchData: true, VerifyGoogleAuthFetchData: true, };

        // Handle Fee and Limit method data
        case GET_FEEANDLIMIT:
            return { ...state, FeeLimitIsFetching: true, FeeLimitData: '', FeeLimitFetchData: true, BalanceFetchData: true, WithdrawFetchData: true, GenerateAddressFetchData: true, WalletBalanceFetchData: true, WalletListFetchData: true, VerifyGoogleAuthFetchData: true, }
        // Set Fee and Limit success data
        case GET_FEEANDLIMIT_SUCCESS:
            return { ...state, FeeLimitIsFetching: false, FeeLimitData: action.payload, FeeLimitFetchData: false, BalanceFetchData: true, WithdrawFetchData: true, GenerateAddressFetchData: true, WalletBalanceFetchData: true, WalletListFetchData: true, VerifyGoogleAuthFetchData: true, }
        // Set Fee and Limit failure data
        case GET_FEEANDLIMIT_FAILURE:
            return { ...state, FeeLimitIsFetching: false, FeeLimitData: action.payload, FeeLimitFetchData: false, BalanceFetchData: true, WithdrawFetchData: true, GenerateAddressFetchData: true, WalletBalanceFetchData: true, WalletListFetchData: true, VerifyGoogleAuthFetchData: true, }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default WithdrawReducer;