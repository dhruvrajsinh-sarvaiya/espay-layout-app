/*
Name: Tejas Gauswami
Use : Reducer for  Place Order
Date  : 5/6/2019
*/

import {

    // types Place Order
    ARBITRAGE_PLACE_ORDER,
    ARBITRAGE_PLACE_ORDER_SUCCESS,
    ARBITRAGE_PLACE_ORDER_FAILURE,

    // types for place bulk order
    ARBITRAGE_PLACE_BULK_ORDER,
    ARBITRAGE_PLACE_BULK_ORDER_SUCCESS,
    ARBITRAGE_PLACE_BULK_ORDER_FAILURE,

}
    from 'Actions/types';

// Set Initial State
const INIT_STATE = {
    placeOrderLoader: false,
    arbitragePlaceOrder: [],
    arbitragePlaceOrderBit: 0,
    arbitragePlaceOrderError: [],

};

export default (state,action) => {
	if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //  Place Order
        case ARBITRAGE_PLACE_ORDER:
            return { ...state, placeOrderLoader: true, arbitragePlaceOrderError: [], arbitragePlaceOrder: [] };

        // set Data Of  Place Order
        case ARBITRAGE_PLACE_ORDER_SUCCESS:

            return { ...state, arbitragePlaceOrderError: [], arbitragePlaceOrder: action.payload, placeOrderLoader: false, arbitragePlaceOrderBit: ++state.arbitragePlaceOrderBit };

        // Display Error for Place Order failure
        case ARBITRAGE_PLACE_ORDER_FAILURE:

            return { ...state, arbitragePlaceOrderError: action.payload, placeOrderLoader: false, arbitragePlaceOrder: [], arbitragePlaceOrderBit: ++state.arbitragePlaceOrderBit };

        //  Place Order
        case ARBITRAGE_PLACE_BULK_ORDER:
            return { ...state, placeOrderLoader: true, arbitragePlaceOrderError: [], arbitragePlaceOrder: [] };

        // set Data Of  Place Order
        case ARBITRAGE_PLACE_BULK_ORDER_SUCCESS:

            return { ...state, arbitragePlaceOrderError: [], arbitragePlaceOrder: action.payload, placeOrderLoader: false, arbitragePlaceOrderBit: ++state.arbitragePlaceOrderBit };

        // Display Error for Place Order failure
        case ARBITRAGE_PLACE_BULK_ORDER_FAILURE:

            return { ...state, arbitragePlaceOrderError: action.payload, placeOrderLoader: false, arbitragePlaceOrder: [], arbitragePlaceOrderBit: ++state.arbitragePlaceOrderBit };


        default: return { ...state };
    }
}