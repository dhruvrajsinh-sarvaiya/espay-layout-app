// Action types for Trade Wallet
import {
    // Get Currency Balance
    GET_CURRENCY_BALANCE,
    GET_CURRENCY_BALANCE_SUCCESS,
    GET_CURRENCY_BALANCE_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // list Margin Wallets
    LIST_MARGIN_WALLETS,
    LIST_MARGIN_WALLETS_SUCCESS,
    LIST_MARGIN_WALLETS_FAILURE
} from '../../actions/ActionTypes';

// Initial state for Trade Wallet
const INTIAL_STATE = {

    // Wallet Balance
    wallets: null,
    isFetchingWallet: false,
    walletsError: false,

    //Margin Wallet Balance
    marginWallets: null,
    isFetchingMarginWallet: false,
    marginWalletsError: false,
}

export default function tradeWalletReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Get Currency Balance method data
        case GET_CURRENCY_BALANCE: {
            return Object.assign({}, state, {
                isFetchingWallet: true,
                wallets: null,
                walletsError: false
            })
        }
        // Set Currency Balance success data
        case GET_CURRENCY_BALANCE_SUCCESS: {
            return Object.assign({}, state, {
                isFetchingWallet: false,
                wallets: action.data,
                walletsError: false
            })
        }
        // Set Currency Balance failure data
        case GET_CURRENCY_BALANCE_FAILURE: {
            return Object.assign({}, state, {
                isFetchingWallet: false,
                wallets: null,
                walletsError: true
            })
        }

        // Handle Margin Wallet Balance method data
        case LIST_MARGIN_WALLETS: {
            return Object.assign({}, state, {
                isFetchingMarginWallet: true,
                marginWallets: null,
                marginWalletsError: false
            })
        }
        // Set Margin Wallet Balance success data
        case LIST_MARGIN_WALLETS_SUCCESS: {
            return Object.assign({}, state, {
                isFetchingMarginWallet: false,
                marginWallets: action.payload,
                marginWalletsError: false
            })
        }
        // Set Margin Wallet Balance failure data
        case LIST_MARGIN_WALLETS_FAILURE: {
            return Object.assign({}, state, {
                isFetchingMarginWallet: false,
                marginWallets: null,
                marginWalletsError: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}