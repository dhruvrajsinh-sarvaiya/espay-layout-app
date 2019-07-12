// Action types for Margin Wallet List
import {
    //Get List Margin Wallets
    LIST_MARGIN_WALLETS,
    LIST_MARGIN_WALLETS_SUCCESS,
    LIST_MARGIN_WALLETS_FAILURE,

    // For Wallets List
    GET_MARGIN_WALLET,
    GET_MARGIN_WALLET_SUCCESS,
    GET_MARGIN_WALLET_FAILURE,

    // For Add Leverage
    ADD_LEVERAGE,
    ADD_LEVERAGE_SUCCESS,
    ADD_LEVERAGE_FAILURE,

    // For Confirm Leverage Request
    ADD_LEVERAGE_CONFIRMATION,
    ADD_LEVERAGE_CONFIRMATION_SUCCESS,
    ADD_LEVERAGE_CONFIRMATION_FAILURE,

    //For Leverage Base Currency
    LEVERAGE_BASE_CURRENCY,
    LEVERAGE_BASE_CURRENCY_SUCCESS,
    LEVERAGE_BASE_CURRENCY_FAILURE,

    ACTION_LOGOUT,

    //To Clear Reducer
    CLEAR_MARGIN_WALLET
} from '../actions/ActionTypes';

// Initial state for Margin Wallet List
const INTIAL_STATE = {

    //Initial State For Margin Wallet list Data
    MarginWalletListFetchData: true,
    MarginWalletListdata: '',
    MarginWalletListisFetching: false,

    // Get Leverage Base Currency List
    leverageBaseCoinFetchData: true,
    leverageBaseCoinIsFetching: false,
    leverageBaseCoinData: '',

    // For Wallet List Data
    WalletListFetchData: true,
    WalletListIsFetching: false,
    WalletListdata: '',

    // For Add Levarge Wallet Request
    AddLevargeRequestFetchData: true,
    AddLevargeRequestIsFetching: false,
    AddLevargeRequestdata: '',

    // For Confirm Levarge Request
    ConfirmLevargeRequestFetchData: true,
    ConfirmLevargeRequestIsFetching: false,
    ConfirmLevargeRequestdata: '',

}

const MarginWalletListReducer = (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // To reset initial state on clear 
        case CLEAR_MARGIN_WALLET: {
            return Object.assign({}, state, {
                MarginWalletListFetchData: true,
                leverageBaseCoinFetchData: true,
                WalletListFetchData: true,
                AddLevargeRequestFetchData: true,
                ConfirmLevargeRequestFetchData: true,
            });
        }

        // Handle List Margin Wallet method data
        case LIST_MARGIN_WALLETS:
            return Object.assign({}, state, {
                MarginWalletListFetchData: true,
                MarginWalletListisFetching: true,
                MarginWalletListdata: '',
                leverageBaseCoinFetchData: true,
                WalletListFetchData: true,
                AddLevargeRequestFetchData: true,
                ConfirmLevargeRequestFetchData: true,
            });
        // Set List Margin Wallet success and Failure data
        case LIST_MARGIN_WALLETS_SUCCESS:
        case LIST_MARGIN_WALLETS_FAILURE:
            return Object.assign({}, state, {
                MarginWalletListFetchData: false,
                MarginWalletListisFetching: false,
                MarginWalletListdata: action.payload,
                leverageBaseCoinFetchData: true,
                WalletListFetchData: true,
                AddLevargeRequestFetchData: true,
                ConfirmLevargeRequestFetchData: true,
            });

        // Handle Leverage Base Currency method data
        case LEVERAGE_BASE_CURRENCY:
            return {
                ...state,
                leverageBaseCoinFetchData: true,
                leverageBaseCoinData: '',
                leverageBaseCoinIsFetching: true,
                MarginWalletListFetchData: true,
                WalletListFetchData: true,
                AddLevargeRequestFetchData: true,
                ConfirmLevargeRequestFetchData: true,
            };
        // Set Leverage Base Currency success and failure data
        case LEVERAGE_BASE_CURRENCY_SUCCESS:
        case LEVERAGE_BASE_CURRENCY_FAILURE:
            return {
                ...state,
                leverageBaseCoinFetchData: false,
                leverageBaseCoinData: action.payload,
                leverageBaseCoinIsFetching: false,
                MarginWalletListFetchData: true,
                WalletListFetchData: true,
                AddLevargeRequestFetchData: true,
                ConfirmLevargeRequestFetchData: true,
            };

        // Handle Margin Wallet method data
        case GET_MARGIN_WALLET:
            return {
                ...state,
                WalletListFetchData: true,
                WalletListdata: '',
                WalletListIsFetching: true,
                leverageBaseCoinFetchData: true,
                AddLevargeRequestFetchData: true,
                MarginWalletListFetchData: true,
                ConfirmLevargeRequestFetchData: true,
            };
        // Set Margin Wallet success and failure data
        case GET_MARGIN_WALLET_SUCCESS:
        case GET_MARGIN_WALLET_FAILURE:
            return {
                ...state,
                WalletListFetchData: false,
                WalletListdata: action.payload,
                WalletListIsFetching: false,
                leverageBaseCoinFetchData: true,
                AddLevargeRequestFetchData: true,
                MarginWalletListFetchData: true,
                ConfirmLevargeRequestFetchData: true,
            };

        // Handle Add Leverage method data
        case ADD_LEVERAGE:
            return {
                ...state,
                AddLevargeRequestFetchData: true,
                AddLevargeRequestdata: '',
                AddLevargeRequestIsFetching: true,
                leverageBaseCoinFetchData: true,
                WalletListFetchData: true,
                MarginWalletListFetchData: true,
                ConfirmLevargeRequestFetchData: true,
            };
        // Set Add Leverage success and failure data
        case ADD_LEVERAGE_SUCCESS:
        case ADD_LEVERAGE_FAILURE:
            return {
                ...state,
                AddLevargeRequestFetchData: false,
                AddLevargeRequestdata: action.payload,
                AddLevargeRequestIsFetching: false,
                leverageBaseCoinFetchData: true,
                WalletListFetchData: true,
                MarginWalletListFetchData: true,
                ConfirmLevargeRequestFetchData: true,
            };

        // Handle Add Leverage Confirmation method data
        case ADD_LEVERAGE_CONFIRMATION:
            return {
                ...state,
                ConfirmLevargeRequestFetchData: true,
                ConfirmLevargeRequestdata: '',
                ConfirmLevargeRequestIsFetching: true,
                MarginWalletListFetchData: true,
                leverageBaseCoinFetchData: true,
                WalletListFetchData: true,
                AddLevargeRequestFetchData: true,
            };
        // Set Add Leverage Confirmation success and failure data
        case ADD_LEVERAGE_CONFIRMATION_SUCCESS:
        case ADD_LEVERAGE_CONFIRMATION_FAILURE:
            return {
                ...state,
                ConfirmLevargeRequestFetchData: false,
                ConfirmLevargeRequestdata: action.payload,
                ConfirmLevargeRequestIsFetching: false,
                MarginWalletListFetchData: true,
                leverageBaseCoinFetchData: true,
                WalletListFetchData: true,
                AddLevargeRequestFetchData: true,
            };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}

export default MarginWalletListReducer;