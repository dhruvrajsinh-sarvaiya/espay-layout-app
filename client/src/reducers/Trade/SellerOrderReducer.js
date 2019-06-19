// Reduceders for  Seller Order Data By Tejas Date: 14/9/2018

import {
    GET_SELLER_ORDER_LIST,
    GET_SELLER_ORDER_LIST_SUCCESS,
    GET_SELLER_ORDER_LIST_FAILURE,
    CHANGE_BUY_PAIR_SOCKET,
    CLOSE_SOCKET_CONNECTION
} from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    sellerOrder: [],
    sellerOrderBit:0,
    bulkOrder: []
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        // get Seller Order list
        case GET_SELLER_ORDER_LIST:
            return { ...state, loading: true };

        // set Data Of  Seller Order list
        case GET_SELLER_ORDER_LIST_SUCCESS:
            return { ...state, loading: false, sellerOrder: action.payload,sellerOrderBit:++state.sellerOrderBit };

        // Display Error for Seller Order list failure
        case GET_SELLER_ORDER_LIST_FAILURE:
            return { ...state, loading: false, sellerOrder: [],sellerOrderBit:++state.sellerOrderBit };

        //close socket connection
        case CLOSE_SOCKET_CONNECTION:
            return { ...state, loading: false, buyerOrder: [] };

        // change socket connection when pair change
        case CHANGE_BUY_PAIR_SOCKET:
            return { ...state, loading: false, buyerOrder: [] };

        default: return { ...state };

    }
}