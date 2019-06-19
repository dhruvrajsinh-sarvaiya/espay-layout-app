

/*
Name: Tejas Gauswami
Use : Reducer for  Arbitrage Trade Order
Date  : 11/6/2019
*/

import {

    // types for Arbitrage Trade Order
    ARBITRAGE_TRADE_ORDER,
    ARBITRAGE_TRADE_ORDER_SUCCESS,
    ARBITRAGE_TRADE_ORDER_FAILURE,

    // types for List exchange smart arbitrage
    LIST_EXCHANGE_SMART_ARBITRAGE,
    LIST_EXCHANGE_SMART_ARBITRAGE_SUCCESS,
    LIST_EXCHANGE_SMART_ARBITRAGE_FAILURE,

}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    arbiTrageTradeOrderLoader: false,
    arbitrageTradeOrder: [],
    arbitrageTradeOrderBit: 0,
    arbitrageTradeOrderError: [],
    listExSmtArbitrage: []
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        //  Arbitrage Trade Order
        case ARBITRAGE_TRADE_ORDER:
            return { ...state, arbiTrageTradeOrderLoader: true, arbitrageTradeOrderError: [], arbitrageTradeOrder: [] };

        // set Data Of  Arbitrage Trade Order
        case ARBITRAGE_TRADE_ORDER_SUCCESS:

            return { ...state, arbitrageTradeOrderError: [], arbitrageTradeOrder: action.payload, arbiTrageTradeOrderLoader: false, arbitrageTradeOrderBit: ++state.arbitrageTradeOrderBit };

        // Display Error for Arbitrage Trade Order failure
        case ARBITRAGE_TRADE_ORDER_FAILURE:

            return { ...state, arbitrageTradeOrderError: action.payload, arbiTrageTradeOrderLoader: false, arbitrageTradeOrder: [], arbitrageTradeOrderBit: ++state.arbitrageTradeOrderBit };

        //  List Exchange Smart Arbitrage
        case LIST_EXCHANGE_SMART_ARBITRAGE:
            return { ...state, loading: true, listExSmtArbitrage: [] };

        // set Data Of  List Exchange Smart Arbitrage
        case LIST_EXCHANGE_SMART_ARBITRAGE_SUCCESS:
            return { ...state, loading: false, listExSmtArbitrage: action.payload };

        // Display Error for List Exchange Smart Arbitrage failure
        case LIST_EXCHANGE_SMART_ARBITRAGE_FAILURE:

            return { ...state, loading: false, listExSmtArbitrage: [] };

        default: return { ...state };
    }
}