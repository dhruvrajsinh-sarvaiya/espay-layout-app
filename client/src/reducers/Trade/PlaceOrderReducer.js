// Reduceders for Do Buy And Sell Order By Tejas Date: 20/9/2018

import {
    DO_BUY_ORDER,
    DO_BUY_ORDER_SUCCESS,
    DO_BUY_ORDER_FAILURE,
    DO_SELL_ORDER,
    DO_SELL_ORDER_SUCCESS,
    DO_SELL_ORDER_FAILURE,
    DO_BULK_BUYER_ORDER,
    DO_BULK_BUYER_ORDER_SUCCESS,
    DO_BULK_BUYER_ORDER_FAILURE,
    DO_BULK_SELLER_ORDER,
    DO_BULK_SELLER_ORDER_SUCCESS,
    DO_BULK_SELLER_ORDER_FAILURE,
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading:false,
    sellOrderLoading:false,
    buyOrderLoading: false,
    buyOrder: [],
    sellOrder: [],
    bulkBuyOrder: [],
    bulkSellOrder: [],
    error: []
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        // get Buyer Order list
        case DO_BUY_ORDER:
            return { ...state, buyOrderLoading: true };

        // set Data Of  Buyer Order list
        case DO_BUY_ORDER_SUCCESS:
            return { ...state, buyOrderLoading: false, buyOrder: action.payload, error: [] };

        // Display Error for Buyer Order list failure
        case DO_BUY_ORDER_FAILURE:
            return { ...state, buyOrderLoading: false, buyOrder: [], error: action.payload };

        // Do Bulk Order  By tejas Date: 20/9/2018
        case DO_SELL_ORDER:
            return { ...state, sellOrderLoading: true };

        // Do Bulk Order  Success  By tejas Date: 20/9/2018
        case DO_SELL_ORDER_SUCCESS:
            return { ...state, sellOrderLoading: false, sellOrder: action.payload, error: [] };

        // Do Bulk Order  Failure failure By tejas Date: 20/9/2018
        case DO_SELL_ORDER_FAILURE:
            return { ...state, sellOrderLoading: false, sellOrder: [], error: action.payload };

        // Do Bulk Order  By tejas Date: 20/9/2018
        case DO_BULK_BUYER_ORDER:
            return { ...state, loading: true };

        // Do Bulk Order  Success  By tejas Date: 20/9/2018
        case DO_BULK_BUYER_ORDER_SUCCESS:
            return { ...state, loading: false, bulkBuyOrder: action.payload };

        // Do Bulk Order  Failure failure By tejas Date: 20/9/2018
        case DO_BULK_BUYER_ORDER_FAILURE:
            return { ...state, loading: false, bulkBuyOrder: [] };

        // Do Bulk Order  By tejas Date: 20/9/2018
        case DO_BULK_SELLER_ORDER:
            return { ...state, loading: true };

        // Do Bulk Order  Success  By tejas Date: 20/9/2018
        case DO_BULK_SELLER_ORDER_SUCCESS:
            return { ...state, bulkSellOrder: action.payload, loading: false };

        // Do Bulk Order  Failure failure By tejas Date: 20/9/2018
        case DO_BULK_SELLER_ORDER_FAILURE:
            return { ...state, loading: false, bulkSellOrder: [] };

        default: return { ...state };
    }
}