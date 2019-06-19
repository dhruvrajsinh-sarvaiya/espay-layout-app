// code added by devang parekh 26-12-2018
// Code for make action for handle coin slider request response and failure case

import {
    MARKET_CAP_LIST,
    MARKET_CAP_LIST_SUCCESS,
    MARKET_CAP_LIST_FAILURE,
    /* ADD_MARKET_CAP,
    ADD_MARKET_CAP_SUCCESS,
    ADD_MARKET_CAP_FAILURE, */
    EDIT_MARKET_CAP,
    EDIT_MARKET_CAP_SUCCESS,
    EDIT_MARKET_CAP_FAILURE,

} from 'Actions/types';


export const getMarketCapList = (MarketCapRequest) => ({
    type: MARKET_CAP_LIST,
    payload: MarketCapRequest
});


export const getMarketCapListSuccess = (MarketCapList) => ({
    type: MARKET_CAP_LIST_SUCCESS,
    payload: MarketCapList
});


export const getMarketCapListFailure = (error) => ({
    type: MARKET_CAP_LIST_FAILURE,
    payload: error
});

/* export const addMarketCap = (addMarketCapRequest) => ({
    type: ADD_MARKET_CAP,
    payload: addMarketCapRequest
});


export const addMarketCapSuccess = (response) => ({
    type: ADD_MARKET_CAP_SUCCESS,
    payload: response
});


export const addMarketCapFailure = (error) => ({
    type: ADD_MARKET_CAP_FAILURE,
    payload: error
}); */

export const editMarketCapDetail = (editMarketCapRequest) => ({
    type: EDIT_MARKET_CAP,
    payload: editMarketCapRequest
});


export const editMarketCapSuccess = (response) => ({
    type: EDIT_MARKET_CAP_SUCCESS,
    payload: response
});


export const editMarketCapFailure = (error) => ({
    type: EDIT_MARKET_CAP_FAILURE,
    payload: error
});