import {

    // user wallet Ledger
    ARBITRAGE_WALLET_LEDGER,
    ARBITRAGE_WALLET_LEDGER_SUCCESS,
    ARBITRAGE_WALLET_LEDGER_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Clear user wallet Ledger
    CLEAR_ARBITRAGE_WALLET_LEDGER,

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
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // To reset initial state on backpress
        case CLEAR_ARBITRAGE_WALLET_LEDGER:
            return INITIAL_STATE

        // Handle User Wallets Ledger method data
        case ARBITRAGE_WALLET_LEDGER:
            return Object.assign({}, state, {
                walletLedgerFetching: true,
                walletLedgerData: null
            })
        // Set User Wallets Ledger success data
        case ARBITRAGE_WALLET_LEDGER_SUCCESS:
        // Set User Wallets Ledger failure data
        case ARBITRAGE_WALLET_LEDGER_FAILURE:
            return Object.assign({}, state, {
                walletLedgerFetching: false,
                walletLedgerData: action.payload,
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