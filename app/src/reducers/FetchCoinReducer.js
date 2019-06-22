// Action types for Fetch Coin 
import {
    // Fetch Balance
    FETCH_BALANCE,
    FETCH_BALANCE_SUCCESS,
    FETCH_BALANCE_FAILURE,

    // Get Ad Wallet
    GET_AD_WALLETS,
    GET_AD_WALLETS_SUCCESS,
    GET_AD_WALLETS_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Dropdown Change
    DropdownChange,
} from '../actions/ActionTypes'

const INTIAL_STATE = {

    /* Common loading for Currency and Wallet */
    isLoading: false,

    /* User Ledger Action */
    CoinData: null,
    isFetchingCoin: false,
    errorCoin: false,

    /* Wallets Action */
    WalletsData: null,
    isFetchingWallets: false,
    errorWallet: false,
}

export default function CoinReducer(state = INTIAL_STATE, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Fetch Balance method data
        case FETCH_BALANCE:
            return {
                ...state,
                isLoading: true,
                isFetchingCoin: true,
                isFetchingWallets: true,

                CoinData: null,

            }
        // Set Fetch Balance success method data
        case FETCH_BALANCE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isFetchingCoin: false,
                isFetchingWallets: true,

                CoinData: action.data,

            }
        // Set Fetch Balance failure method data
        case FETCH_BALANCE_FAILURE:
            return {
                ...state,
                isLoading: false,
                isFetchingCoin: false,
                isFetchingWallets: true,

                CoinData: null,
                errorCoin: true,

            }

        // Handle Get Wallet Address method data
        case GET_AD_WALLETS:
            return {
                ...state,
                isLoading: true,
                isFetchingWallets: true,
                isFetchingCoin: true,

                WalletsData: null,

            }
        // Set Wallet Address success data
        case GET_AD_WALLETS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isFetchingWallets: false,
                isFetchingCoin: true,

                WalletsData: action.payload,

            }
        // Set Wallet Address failure data
        case GET_AD_WALLETS_FAILURE:
            return {
                ...state,
                isLoading: false,
                isFetchingWallets: false,
                isFetchingCoin: true,

                WalletsData: null,
                errorCoin: true,

            }
        
        // Handle Dropdown Change method data
        case DropdownChange:
            return {
                ...state,
                isFetchingCoin: true,
                isFetchingWallets: true,
            }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}