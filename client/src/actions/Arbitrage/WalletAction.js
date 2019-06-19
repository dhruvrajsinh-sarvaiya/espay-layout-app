/* 
    Developer : Vishva shah
    Date : 05-06-2019
    File Comment : Arbitrage Wallet Actions
*/

import {
    //list currency
    LIST_ARBITRAGE_CURRENCY,
    LIST_ARBITRAGE_CURRENCY_SUCCESS,
    LIST_ARBITRAGE_CURRENCY_FAILURE,
    //list
    LIST_ARBITRAGE_WALLETS,
    LIST_ARBITRAGE_WALLETS_SUCCESS,
    LIST_ARBITRAGE_WALLETS_FAILURE,
    //create
    CREATE_ARBITRAGE_WALLETS,
    CREATE_ARBITRAGE_WALLETS_SUCCESS,
    CREATE_ARBITRAGE_WALLETS_FAILURE,
    //add leverage preconfirmation
    ADD_LEVERAGE_PRECONFIRMATION,
    ADD_LEVERAGE_PRECONFIRMATION_SUCCESS,
    ADD_LEVERAGE_PRECONFIRMATION_FAILURE,
    //confirm leverage request
    ADD_ARBITRAGE_LEVERAGE,
    ADD_ARBITRAGE_LEVERAG_SUCCESS,
    ADD_ARBITRAGE_LEVERAGE_FAILURE,
    //wallet balance
    ARBITRAGE_ADD_WALLET_BALANCE,
    ARBITRAGE_ADD_WALLET_BALANCE_SUCCESS,
    ARBITRAGE_ADD_WALLET_BALANCE_FAILURE,
} from '../types';

// list arbitrage currency
export const getArbitrageCurrencyList = (request) => ({
    type: LIST_ARBITRAGE_CURRENCY,
    request: request
});
export const getArbitrageCurrencyListSuccess = (response) => ({
    type: LIST_ARBITRAGE_CURRENCY_SUCCESS,
    payload: response
});
export const getArbitrageCurrencyListFailure = (error) => ({
    type: LIST_ARBITRAGE_CURRENCY_FAILURE,
    payload: error
});
/* List arbitrage wallets */
export const getArbitrageWalletList = (request) => ({
    type: LIST_ARBITRAGE_WALLETS,
    request: request
});
export const getArbitrageWalletListSuccess = (response) => ({
    type: LIST_ARBITRAGE_WALLETS_SUCCESS,
    payload: response
});
export const getArbitrageWalletListFailure = (error) => ({
    type: LIST_ARBITRAGE_WALLETS_FAILURE,
    payload: error
});
/* create a arbitrage wallet */
export const createArbitrageWallet = (request) => ({
    type: CREATE_ARBITRAGE_WALLETS,
    request: request
});
export const createArbitrageWalletSuccess = (response) => ({
    type: CREATE_ARBITRAGE_WALLETS_SUCCESS,
    payload: response
});
export const createArbitrageWalletFailure = (error) => ({
    type: CREATE_ARBITRAGE_WALLETS_FAILURE,
    payload: error
});
/* add leverage */
export const addLeveragePreconfirmation = (request) => ({
    type: ADD_LEVERAGE_PRECONFIRMATION,
    request: request
});
export const addLeveragePreconfirmationSuccess = (response) => ({
    type: ADD_LEVERAGE_PRECONFIRMATION_SUCCESS,
    payload: response
});
export const addLeveragePreconfirmationFailure = (error) => ({
    type: ADD_LEVERAGE_PRECONFIRMATION_FAILURE,
    payload: error
});

/* confirm leverage */
export const confirmArbitrageLeverage = (request) => ({
    type: ADD_ARBITRAGE_LEVERAGE,
    request: request
})
export const confirmArbitrageLeverageSuccess = (response) => ({
    type: ADD_ARBITRAGE_LEVERAG_SUCCESS,
    payload: response
})
export const confirmArbitrageLeverageFailure = (error) => ({
    type: ADD_ARBITRAGE_LEVERAGE_FAILURE,
    payload: error
})

/* add balance */
export const addAtbitrageBalance = (request) => ({
    type: ARBITRAGE_ADD_WALLET_BALANCE,
    request: request
})
export const addAtbitrageBalanceSuccess = (response) => ({
    type: ARBITRAGE_ADD_WALLET_BALANCE_SUCCESS,
    payload: response
})
export const addAtbitrageBalanceFailure = (error) => ({
    type: ARBITRAGE_ADD_WALLET_BALANCE_FAILURE,
    payload: error
})
