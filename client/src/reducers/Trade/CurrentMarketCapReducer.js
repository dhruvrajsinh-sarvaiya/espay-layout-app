// Reducer for PAir List Data By Tejas Date: 14/9/2018

import {
    GET_MARKET_CAP_LIST,
    GET_MARKET_CAP_LIST_SUCCESS,
    GET_MARKET_CAP_LIST_FAILURE
}
    from 'Actions/types';

// Set Initial State
const INIT_STATE = {
    loading: false,
    currentMarketCap: [],
    lastPriceBit: 1
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {

        // get pair list
        case GET_MARKET_CAP_LIST:
            return { ...state, loading: true };

        // set Data Of  pair list
        case GET_MARKET_CAP_LIST_SUCCESS:

            return { ...state, currentMarketCap: action.payload, loading: false, lastPriceBit: ++state.lastPriceBit };

        // Display Error for pair list failure
        case GET_MARKET_CAP_LIST_FAILURE:

            return { ...state, loading: false, currentMarketCap: [], lastPriceBit: ++state.lastPriceBit };

        default: return { ...state };

    }
}