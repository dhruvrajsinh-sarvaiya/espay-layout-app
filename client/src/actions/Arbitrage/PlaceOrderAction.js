/*
Name: Tejas Gauswami
Use : Actions for Place Order   
Date  : 5/6/2019
*/


//Import action types form type.js
import {

    // types for Place Order
    ARBITRAGE_PLACE_ORDER,
    ARBITRAGE_PLACE_ORDER_SUCCESS,
    ARBITRAGE_PLACE_ORDER_FAILURE,

    // types for place bulk order
    ARBITRAGE_PLACE_BULK_ORDER,
    ARBITRAGE_PLACE_BULK_ORDER_SUCCESS,
    ARBITRAGE_PLACE_BULK_ORDER_FAILURE,

} from 'Actions/types';

/**
 * Redux Action To Place Order
 */
export const arbitragePlaceOrder = (data) => ({
    type: ARBITRAGE_PLACE_ORDER,
    payload: data
});

/**
 * Redux Action Place Order Success
 */
export const arbitragePlaceOrderSuccess = (list) => ({
    type: ARBITRAGE_PLACE_ORDER_SUCCESS,
    payload: list
});

/**
 * Redux Action Place Order Failure
 */
export const arbitragePlaceOrderFailure = (error) => ({
    type: ARBITRAGE_PLACE_ORDER_FAILURE,
    payload: error
});


/**
 * Redux Action To Place Order
 */
export const arbitragePlaceBulkOrder = (data) => ({
    type: ARBITRAGE_PLACE_BULK_ORDER,
    payload: data
});

/**
 * Redux Action Place Order Success
 */
export const arbitragePlaceBulkOrderSuccess = (list) => ({
    type: ARBITRAGE_PLACE_BULK_ORDER_SUCCESS,
    payload: list
});

/**
 * Redux Action Place Order Failure
 */
export const arbitragePlaceBulkOrderFailure = (error) => ({
    type: ARBITRAGE_PLACE_BULK_ORDER_FAILURE,
    payload: error
});