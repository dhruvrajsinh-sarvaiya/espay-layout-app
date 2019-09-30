import {
    // Get User Margin Wallets
    GET_USER_MARGIN_WALLETS,
    GET_USER_MARGIN_WALLETS_SUCCESS,
    GET_USER_MARGIN_WALLETS_FAILURE,

    // Margin Wallet Ledger
    MARGIN_WALLET_LEDGER,
    MARGIN_WALLET_LEDGER_SUCCESS,
    MARGIN_WALLET_LEDGER_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Clear Margin Wallet Ledger
    CLEAR_MARGIN_WALLET_LEDGER,

    // Get User Data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE
} from "../../actions/ActionTypes";

// initial state
const INITIAL_STATE = {
    // Wallet Ledger 
    walletLedgerFetching: false,
    walletLedgerData: null,

    // Wallet
    walletsFetching: false,
    walletsData: null,

    // User Data 
    userDataFetching: false,
    userData: null,
}

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // To reset initial state on backpress
        case CLEAR_MARGIN_WALLET_LEDGER: {
            return INITIAL_STATE;
        }

        // Handle Get User Margin Wallets method data
        case GET_USER_MARGIN_WALLETS:
            return Object.assign({}, state, {
                walletsFetching: true,
                walletsData: null
            })
        // Set User Margin Wallets success data
        case GET_USER_MARGIN_WALLETS_SUCCESS:
            return Object.assign({}, state, {
                walletsFetching: false,
                walletsData: action.payload
            })
        // Set User Margin Wallets failure data
        case GET_USER_MARGIN_WALLETS_FAILURE:
            return Object.assign({}, state, {
                walletsFetching: false,
                walletsData: null
            })

        // Handle Margin Wallets Ledger method data
        case MARGIN_WALLET_LEDGER:
            return Object.assign({}, state, {
                walletLedgerFetching: true,
                walletLedgerData: null
            })
        // Set Margin Wallets Ledger success data
        case MARGIN_WALLET_LEDGER_SUCCESS:
            return Object.assign({}, state, {
                walletLedgerFetching: false,
                walletLedgerData: action.payload,
            })
        // Set Margin Wallets Ledger failure data
        case MARGIN_WALLET_LEDGER_FAILURE:
            return Object.assign({}, state, {
                walletLedgerFetching: false,
                walletLedgerData: null
            })

        // Handle Get User method data
        case GET_USER_DATA:
            return Object.assign({}, state, {
                userDataFetching: true,
                userData: null
            })
        // Set Get User success data
        case GET_USER_DATA_SUCCESS:
        // Set Get User failure data
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                userDataFetching: false,
                userData: action.payload
            })


        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};