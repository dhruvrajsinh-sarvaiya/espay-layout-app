// Reduceders for Currency Details Data By Tejas Date: 17/9/2018

import {
    GET_CURRENCY_LIST,
    GET_CURRENCY_LIST_SUCCESS,
    GET_CURRENCY_LIST_FAILURE,
    GET_CURRENT_PRICE,
    GET_CURRENT_PRICELIST_SUCCESS,
    GET_CURRENT_PRICE_FAILURE,
    UPDATE_BALANCE,
    UPDATE_BALANCE_SUCCESS,
    UPDATE_BALANCE_FAILURE,
    GET_CURRENCY_DATA,
    GET_CURRENCY_DATA_SUCCESS,
    GET_CURRENCY_DATA_FAILURE,
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    wallets: [],
    currentPrice: [],
    updateBalance: [],
    lastPriceBit: 1,
    currencyData: [],
    currencyLoader: false
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        // get Currency list
        case GET_CURRENCY_LIST:
            return { ...state, loading: true };

        // set Data Of  Currency list
        case GET_CURRENCY_LIST_SUCCESS:

            return { ...state, wallets: action.payload, loading: false };

        // Display Error for Currency list failure
        case GET_CURRENCY_LIST_FAILURE:

            return { ...state, loading: false, wallets: [] };

        // get Current Price list
        case GET_CURRENT_PRICE:
            return { ...state, loading: true };

        // set Data Of  Current Price list
        case GET_CURRENT_PRICELIST_SUCCESS:

            return { ...state, currentPrice: action.payload, loading: false, lastPriceBit: ++state.lastPriceBit };

        // Display Error for Current Price list failure
        case GET_CURRENT_PRICE_FAILURE:

            return { ...state, loading: false, currentPrice: [], lastPriceBit: ++state.lastPriceBit };

        //  update balance
        case UPDATE_BALANCE:
            return { ...state, loading: true };

        // set Data Of   update balance
        case UPDATE_BALANCE_SUCCESS:

            return { ...state, updateBalance: action.payload, loading: false };

        // Display Error for update balance failure
        case UPDATE_BALANCE_FAILURE:

            return { ...state, loading: false, updateBalance: [] };


        // get Currency list
        case GET_CURRENCY_DATA:
            return { ...state, currencyLoader: true };

        // set Data Of  Currency list
        case GET_CURRENCY_DATA_SUCCESS:

            return { ...state, currencyData: action.payload, currencyLoader: false };

        // Display Error for Currency list failure
        case GET_CURRENCY_DATA_FAILURE:

            return { ...state, currencyLoader: false, currencyData: [] };

        default: return { ...state };
    }
}