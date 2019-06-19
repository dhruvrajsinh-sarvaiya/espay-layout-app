// Reduceders for  Market Trade History Data By Tejas Date: 14/9/2018

import {
    GET_MARKET_TRADE_HISTORY,
    GET_MARKET_TRADE_HISTORY_SUCCESS,
    GET_MARKET_TRADE_HISTORY_FAILURE,
    CHANGE_MARKET_TRADE_HISTORY_SOCKET,
    CLOSE_SOCKET_CONNECTION,
} from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    marketHistory: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // get Market Trade History list
        case GET_MARKET_TRADE_HISTORY:
            return { ...state, loading: true };

        // set Data Of  Market Trade History list
        case GET_MARKET_TRADE_HISTORY_SUCCESS:
            return { ...state, marketHistory: action.payload, loading: false };

        // Display Error for Market Trade History list failure
        case GET_MARKET_TRADE_HISTORY_FAILURE:
            return { ...state, loading: false };

        case CHANGE_MARKET_TRADE_HISTORY_SOCKET:
            return { ...state, loading: false, marketHistory: [] };

        case CLOSE_SOCKET_CONNECTION:
            return { ...state, loading: false, marketHistory: [] };

        default: return { ...state };
    }
}