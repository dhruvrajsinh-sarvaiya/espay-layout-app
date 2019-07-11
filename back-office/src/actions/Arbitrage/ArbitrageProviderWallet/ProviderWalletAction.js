/* 
    Developer : Vishva shah
    FIle Comment : Arbitrage provider wallet action method
    Date : 17-06-2019
*/

import {
    // get provider wallet list
    GET_ARBITRAGE_WALLET_LIST,
    GET_ARBITRAGE_WALLET_LIST_SUCCESS,
    GET_ARBITRAGE_WALLET_LIST_FAILURE,
} from "Actions/types";

// get arbitrage provider wallet list
export const getArbitrageWalletList = (request) => ({
    type: GET_ARBITRAGE_WALLET_LIST,
    payload: request
});
export const getArbitrageWalletListSuccess = response => ({
    type: GET_ARBITRAGE_WALLET_LIST_SUCCESS,
    payload: response
});
export const getArbitrageWalletListFailure = error => ({
    type: GET_ARBITRAGE_WALLET_LIST_FAILURE,
    payload: error
});