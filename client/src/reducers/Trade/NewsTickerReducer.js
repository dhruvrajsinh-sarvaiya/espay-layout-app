// Reduceders for  News Ticker Data By Tejas Date: 14/9/2018

import {
    GET_NEWS_TICKER_LIST,
    GET_NEWS_TICKER_LIST_SUCCESS,
    GET_NEWS_TICKER_LIST_FAILURE,
    GET_TICKERS_LIST,
    GET_TICKERS_LIST_SUCCESS,
    GET_TICKERS_LIST_FAILURE
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    tickers: [],
    newsTicker: []
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        // get News Ticker list
        case GET_NEWS_TICKER_LIST:
            return { ...state, loading: true };

        // set Data Of  News Ticker list
        case GET_NEWS_TICKER_LIST_SUCCESS:
            return { ...state, newsTicker: action.payload, loading: false };

        // Display Error for News Ticker list failure
        case GET_NEWS_TICKER_LIST_FAILURE:
            return { ...state, loading: false, newsTicker: [] };

        // get News Ticker list
        case GET_TICKERS_LIST:
            return { ...state, loading: true };

        // set Data Of  News Ticker list
        case GET_TICKERS_LIST_SUCCESS:
            return { ...state, tickers: action.payload, loading: false };

        // Display Error for News Ticker list failure
        case GET_TICKERS_LIST_FAILURE:
            return { ...state, loading: false, tickers: [] };

        default: return { ...state };

    }
}