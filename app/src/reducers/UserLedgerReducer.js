// Action types for User Ledger
import {
    // User Ledger List
    USER_LEDGER_LIST,
    USER_LEDGER_LIST_SUCCESS,
    USER_LEDGER_LIST_FAILURE,

    // Fetch Wallet List
    FETCH_WALLET_LIST,
    FETCH_WALLET_LIST_SUCCESS,
    FETCH_WALLET_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes'

// Inital State for User Ledger
const INTIAL_STATE = {

    /* Common Loading */
    loadingUserLedger: false,

    /* User Ledger Action */
    UserLedgerData: null,
    isFetchingUserLedger: false,
    errorUserLedger: false,

    /* Wallet List Action */
    WalletList: null,
    isFetchingWalletList: false,
    errorWalletList: false,
}

export default function UserLedgerReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle User Ledger List method data
        case USER_LEDGER_LIST:
            return {
                ...state,
                loadingUserLedger: true,
                UserLedgerData: null,
                isFetchingUserLedger: true
            }
        // Set User Ledger List success data
        case USER_LEDGER_LIST_SUCCESS:
            return {
                ...state,
                loadingUserLedger: false,
                UserLedgerData: action.data,
                isFetchingUserLedger: false,
            }
        // Set User Ledger List failure data
        case USER_LEDGER_LIST_FAILURE:
            return {
                ...state,
                loadingUserLedger: false,
                UserLedgerData: null,
                isFetchingUserLedger: false,
                errorUserLedger: true
            }

        // Handle Wallet List method data
        case FETCH_WALLET_LIST:
            return {
                ...state,
                loadingUserLedger: true,
                WalletList: null,
                isFetchingWalletList: true
            }
        // Set Wallet List success data
        case FETCH_WALLET_LIST_SUCCESS:
            return {
                ...state,
                loadingUserLedger: false,
                WalletList: action.data,
                isFetchingWalletList: false
            }
        // Set Wallet List failure data
        case FETCH_WALLET_LIST_FAILURE:
            return {
                ...state,
                loadingUserLedger: false,
                WalletList: null,
                isFetchingWalletList: false,
                errorWalletList: true
            }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}