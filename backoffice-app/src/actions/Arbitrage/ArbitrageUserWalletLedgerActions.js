import {
    // Arbitrage User Wallet Ledger
    ARBITRAGE_WALLET_LEDGER,
    ARBITRAGE_WALLET_LEDGER_SUCCESS,
    ARBITRAGE_WALLET_LEDGER_FAILURE,

    // Clear Reducer data
    CLEAR_ARBITRAGE_WALLET_LEDGER
} from "../ActionTypes";

// Redux for Arbitrage User Wallet Ledger Action
export const getArbiUserWalletLedger = (request) => ({
    type: ARBITRAGE_WALLET_LEDGER,
    request: request
})

// Redux for Arbitrage User Wallet Ledger Action Success
export const getArbiUserWalletLedgerSuccess = (response) => ({
    type: ARBITRAGE_WALLET_LEDGER_SUCCESS,
    payload: response
})

// Redux for Arbitrage User Wallet Ledger Action Failure 
export const getArbiUserWalletLedgerFailure = (error) => ({
    type: ARBITRAGE_WALLET_LEDGER_FAILURE,
    payload: error
})

// clear a list Arbitrage User Wallet Ledger
export const clearArbiUserWalletLedger = () => ({
    type: CLEAR_ARBITRAGE_WALLET_LEDGER,
})
