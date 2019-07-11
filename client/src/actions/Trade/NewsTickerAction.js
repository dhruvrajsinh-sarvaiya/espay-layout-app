// Actions For News Ticker list By Tejas Date :14/9/2018

// import types 
import {
    GET_NEWS_TICKER_LIST,
    GET_NEWS_TICKER_LIST_SUCCESS,
    GET_NEWS_TICKER_LIST_FAILURE,
    GET_TICKERS_LIST,
    GET_TICKERS_LIST_SUCCESS,
    GET_TICKERS_LIST_FAILURE
}
    from 'Actions/types';

//action for get News Ticker list and set type for reducers
export const getNewsTickerList = (Pair) => ({
    type: GET_NEWS_TICKER_LIST,
    payload: { Pair }
});

//action for set Success and data to  News Ticker list and set type for reducers
export const getNewsTickerListSuccess = (response) => ({
    type: GET_NEWS_TICKER_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to  News Ticker list and set type for reducers
export const getNewsTickerListFailure = (error) => ({
    type: GET_NEWS_TICKER_LIST_FAILURE,
    payload: error
});

//action for get Ticker list and set type for reducers
export const getTickersList = (tickerListRequest) => ({
    type: GET_TICKERS_LIST,
    payload: { tickerListRequest }
});

//action for set Success and data to  News Ticker list and set type for reducers
export const getTickersListSuccess = (response) => ({
    type: GET_TICKERS_LIST_SUCCESS,
    payload: response.data
});

//action for set failure and error to  News Ticker list and set type for reducers
export const getTickersListFailure = (error) => ({
    type: GET_TICKERS_LIST_FAILURE,
    payload: error
});