// Actions For Do  BUY And Sell  Order Action list By Tejas Date :20/9/2018

// import types 
import {
    DO_BUY_ORDER,
    DO_BUY_ORDER_SUCCESS,
    DO_BUY_ORDER_FAILURE,
    DO_SELL_ORDER,
    DO_SELL_ORDER_SUCCESS,
    DO_SELL_ORDER_FAILURE,
    DO_BULK_SELLER_ORDER,
    DO_BULK_SELLER_ORDER_SUCCESS,
    DO_BULK_SELLER_ORDER_FAILURE,
    DO_BULK_BUYER_ORDER,
    DO_BULK_BUYER_ORDER_SUCCESS,
    DO_BULK_BUYER_ORDER_FAILURE,
} from 'Actions/types';

//action for DO Buy  Order  and set type for reducers By Tejas Date : 20/9/2018
export const doBuyOrder = (buyOrderRequest) => ({
    type: DO_BUY_ORDER,
    payload: { buyOrderRequest }
});

//action for set Success For DO BUY  Order and set type for reducers By Tejas Date : 20/9/2018
export const doBuyOrderSuccess = (response) => ({
    type: DO_BUY_ORDER_SUCCESS,
    payload: response
});

//action for set failure and error to DO BUY  Order and set type for reducers By Tejas Date : 20/9/2018
export const doBuyOrderFailure = (error) => ({
    type: DO_BUY_ORDER_FAILURE,
    payload: error
});

//action for DO Sell Order  and set type for reducers By Tejas Date : 20/9/2018
export const doSellOrder = (sellOrderRequest) => ({
    type: DO_SELL_ORDER,
    payload: { sellOrderRequest }
});

//action for set Success For DO Sell Order and set type for reducers By Tejas Date : 20/9/2018
export const doSellOrderSuccess = (response) => ({
    type: DO_SELL_ORDER_SUCCESS,
    payload: response
});

//action for set failure and error to DO Sell Order and set type for reducers By Tejas Date : 20/9/2018
export const doSellOrderFailure = (error) => ({
    type: DO_SELL_ORDER_FAILURE,
    payload: error
});

//action for DO Bulk Buyer Order  and set type for reducers
export const doBulkBuyOrder = (bulkOrderRequest) => ({
    type: DO_BULK_BUYER_ORDER,
    payload: { bulkOrderRequest }
});


//action for set Success For DO Bulk Buyer Order and set type for reducers
export const doBulkBuyOrderSuccess = (response) => ({
    
    type: DO_BULK_BUYER_ORDER_SUCCESS,
    payload: response.data
});

//action for set failure and error to DO Bulk Buyer Order and set type for reducers
export const doBulkBuyOrderFailure = (error) => ({
    type: DO_BULK_BUYER_ORDER_FAILURE,
    payload: error
});


//action for DO Bulk Seller Order  and set type for reducers By Tejas Date : 20/9/2018
export const doBulkSellOrder = (bulSellOrderRequest) => ({
    type: DO_BULK_SELLER_ORDER,
    payload: { bulSellOrderRequest }
});

//action for set Success For DO Bulk Seller Order and set type for reducers By Tejas Date : 20/9/2018
export const doBulkSellOrderSuccess = (response) => ({
    type: DO_BULK_SELLER_ORDER_SUCCESS,
    payload: response.data
});

//action for set failure and error to DO Bulk Seller Order and set type for reducers By Tejas Date : 20/9/2018
export const doBulkSellOrderFailure = (error) => ({
    type: DO_BULK_SELLER_ORDER_FAILURE,
    payload: error
});
