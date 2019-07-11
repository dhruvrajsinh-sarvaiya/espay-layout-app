/*
Name: Tejas Gauswami
Use : Actions for Orders Details
Date  : 3/6/2019
*/


//Import action types form type.js
import {

    // types for Buyerbook list
    ARBITRAGE_BUYER_BOOK_LIST,
    ARBITRAGE_BUYER_BOOK_LIST_SUCCESS,
    ARBITRAGE_BUYER_BOOK_LIST_FAILURE,

    // types for Sellerbook list
    ARBITRAGE_SELLER_BOOK_LIST,
    ARBITRAGE_SELLER_BOOK_LIST_SUCCESS,
    ARBITRAGE_SELLER_BOOK_LIST_FAILURE,

    // types for Pair list
    ARBITRAGE_PAIR_LIST,
    ARBITRAGE_PAIR_LIST_SUCCESS,
    ARBITRAGE_PAIR_LIST_FAILURE
} from 'Actions/types';

/**
 * Redux Action To GET Buyer Book Order
 */
export const atbitrageBuyerBook = (data) => ({
    type: ARBITRAGE_BUYER_BOOK_LIST,
    payload: data
});

/**
 * Redux Action GET Buyer Book Order Success
 */
export const atbitrageBuyerBookSuccess = (list) => ({
    type: ARBITRAGE_BUYER_BOOK_LIST_SUCCESS,
    payload: list
});

/**
 * Redux Action GET Buyer Book Order Failure
 */
export const atbitrageBuyerBookFailure = (error) => ({
    type: ARBITRAGE_BUYER_BOOK_LIST_FAILURE,
    payload: error
});

/**
 * Redux Action To GET Seller Book Order
 */
export const atbitrageSellerBook = (data) => ({
    type: ARBITRAGE_SELLER_BOOK_LIST,
    payload: data
});

/**
 * Redux Action GET Seller Book Order Success
 */
export const atbitrageSellerBookSuccess = (list) => ({
    type: ARBITRAGE_SELLER_BOOK_LIST_SUCCESS,
    payload: list
});

/**
 * Redux Action GET Seller Book Order Failure
 */
export const atbitrageSellerBookFailure = (error) => ({
    type: ARBITRAGE_SELLER_BOOK_LIST_FAILURE,
    payload: error
});

/**
 * Redux Action To GET Seller Book Order
 */
export const getArbitragePairList = (data) => ({
    type: ARBITRAGE_PAIR_LIST,
    payload: data
});

/**
 * Redux Action GET Seller Book Order Success
 */
export const getArbitragePairListSuccess = (list) => ({
    type: ARBITRAGE_PAIR_LIST_SUCCESS,
    payload: list
});

/**
 * Redux Action GET Seller Book Order Failure
 */
export const getArbitragePairListFailure = (error) => ({
    type: ARBITRAGE_PAIR_LIST_FAILURE,
    payload: error
});

