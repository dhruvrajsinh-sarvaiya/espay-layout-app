/*
Name: Tejas Gauswami
Use : Reducer for  Place Order
Date  : 12/6/2019
*/

import {

    // types Exchange List
    ARBITRAGE_EXCHANGE_LIST,
    ARBITRAGE_EXCHANGE_LIST_SUCCESS,
    ARBITRAGE_EXCHANGE_LIST_FAILURE

}
    from 'Actions/types';

// Set Initial State
const INIT_STATE = {

    arbitrageExchange: [],
    arbitrageExchangeLoading: 0,
    arbitrageExchangeError: [],

};

export default (state, action) => {

    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {

        //  Exchange List
        case ARBITRAGE_EXCHANGE_LIST:
            return { ...state, arbitrageExchangeLoading: true, arbitrageExchangeError: [], arbitrageExchange: [] };

        // set Data Of  Exchange List
        case ARBITRAGE_EXCHANGE_LIST_SUCCESS:

            return { ...state, arbitrageExchangeError: [], arbitrageExchange: action.payload.response, arbitrageExchangeLoading: false };

        // Display Error for Exchange List failure
        case ARBITRAGE_EXCHANGE_LIST_FAILURE:

            return { ...state, arbitrageExchangeError: action.payload, arbitrageExchangeLoading: false, arbitrageExchange: [] };

        default: return { ...state };
    }
}