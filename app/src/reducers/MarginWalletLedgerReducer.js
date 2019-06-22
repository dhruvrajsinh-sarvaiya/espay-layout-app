// Action types for Margin Wallet Ledger
import {
    // List Margin Wallets
    LIST_MARGIN_WALLETS,
    LIST_MARGIN_WALLETS_SUCCESS,
    LIST_MARGIN_WALLETS_FAILURE,

    // Get Margin Wallet Ledger Data
    GET_MARGIN_WALLET_LEDGER_DATA,
    GET_MARGIN_WALLET_LEDGER_DATA_SUCCESS,
    GET_MARGIN_WALLET_LEDGER_DATA_FAILURE,

    // Clear Margin Wallet Ledger Data
    GET_MARGIN_WALLET_LEDGER_DATA_CLEAR,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// Initial state for Margin Wallet Ledger 
const INTIAL_STATE = {

    // Margin Wallet Master Data
    isLoadingMasterData: false,
    marginWalletMasterData: null,
    fetchMarginWalletMasterData: true,

    // Margin Wallet Ledger Data
    isLoadingLedgerData: false,
    marginWalletLedgerData: null,
    fetchMarginWalletLedgerData: true,
}

export default function MarginWalletLedgerReducer(state = INTIAL_STATE, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Margin Wallets method data
        case LIST_MARGIN_WALLETS:
            return Object.assign({}, state, {
                marginWalletLedgerData: null,
                isLoadingMasterData: true,
                marginWalletMasterData: null,
                fetchMarginWalletMasterData: true
            });
        // Set Margin Wallets success data
        case LIST_MARGIN_WALLETS_SUCCESS:
            return Object.assign({}, state, {
                isLoadingMasterData: false,
                marginWalletMasterData: action.payload,
                fetchMarginWalletMasterData: false
            });
        // Set Margin Wallets failure data
        case LIST_MARGIN_WALLETS_FAILURE:
            return Object.assign({}, state, {
                isLoadingMasterData: false,
                marginWalletMasterData: null,
                fetchMarginWalletMasterData: false
            });

        // Handle Margin Wallets Ledger method data
        case GET_MARGIN_WALLET_LEDGER_DATA:
            return Object.assign({}, state, {
                isLoadingLedgerData: true,
                marginWalletLedgerData: null,
                fetchMarginWalletLedgerData: true
            });
        // Set Margin Wallets Ledger success data
        case GET_MARGIN_WALLET_LEDGER_DATA_SUCCESS:
            return Object.assign({}, state, {
                isLoadingLedgerData: false,
                marginWalletLedgerData: action.data,
                fetchMarginWalletLedgerData: false
            });
        // Set Margin Wallets Ledger failure data
        case GET_MARGIN_WALLET_LEDGER_DATA_FAILURE:
            return Object.assign({}, state, {
                isLoadingLedgerData: false,
                marginWalletLedgerData: null,
                fetchMarginWalletLedgerData: false
            });

        // Clear Margin Wallet Ledget Data
        case GET_MARGIN_WALLET_LEDGER_DATA_CLEAR:
            return Object.assign({}, state, {
                isLoadingLedgerData: false,
                marginWalletLedgerData: null,
                fetchMarginWalletLedgerData: true
            });

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
