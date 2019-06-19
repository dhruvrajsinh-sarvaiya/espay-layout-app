// Reduceders for  Buyer Order Data By Tejas Date: 14/9/2018

import {
    GET_BUYER_ORDER_LIST,
    GET_BUYER_ORDER_LIST_SUCCESS,
    GET_BUYER_ORDER_LIST_FAILURE,
    CLOSE_SOCKET_CONNECTION,
    CHANGE_BUY_PAIR_SOCKET,
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    buyerOrder: [],
    buyerOrderBit:0,
    bulkOrder: []
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        // get Buyer Order list
        case GET_BUYER_ORDER_LIST:
            return { ...state, loading: true };

        // set Data Of  Buyer Order list
        case GET_BUYER_ORDER_LIST_SUCCESS:

            return { ...state, buyerOrder: action.payload, loading: false,buyerOrderBit:++state.buyerOrderBit };

        // Display Error for Buyer Order list failure
        case GET_BUYER_ORDER_LIST_FAILURE:

            return { ...state, loading: false, buyerOrder: [],buyerOrderBit:++state.buyerOrderBit};

        // close socket connection
        case CLOSE_SOCKET_CONNECTION:
            return { ...state, loading: false, buyerOrder: [] };

        // change socket connection when pair change
        case CHANGE_BUY_PAIR_SOCKET:
            return { ...state, loading: false, buyerOrder: [] };

        default: return { ...state };
    }
}