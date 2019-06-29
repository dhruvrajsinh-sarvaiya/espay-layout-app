/*
Name: Devang Parekh
Use : Reducer for  Profit Indicator
Date  : 7/6/2019
*/

import {
    // types Profit Indicator
    GET_ARBITRAGE_PROFITINDICATOR,
    GET_ARBITRAGE_PROFITINDICATOR_SUCCESS,
    GET_ARBITRAGE_PROFITINDICATOR_FAILURE,
} from 'Actions/types';

// Set Initial State
const INIT_STATE = {
    profitIndicatorLoader: false,
    arbitrageProfitIndicator: []
};

export default (state,action) => {
	if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //  Profit Indicator
        case GET_ARBITRAGE_PROFITINDICATOR:
            return { profitIndicatorLoader: true, arbitrageProfitIndicator: [] };

        // set Data Of  Profit Indicator
        case GET_ARBITRAGE_PROFITINDICATOR_SUCCESS:
            return { profitIndicatorLoader: false, arbitrageProfitIndicator: action.payload };

        // Display Error for Profit Indicator failure
        case GET_ARBITRAGE_PROFITINDICATOR_FAILURE:
            return { profitIndicatorLoader: false, arbitrageProfitIndicator: action.payload };

        default: return { ...state };
    }
}