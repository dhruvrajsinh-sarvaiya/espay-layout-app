// Reduceders for Active Open Order Data By Tejas Date: 14/9/2018

import {
    GET_ACTIVE_OPEN_ORDER_LIST,
    GET_ACTIVE_OPEN_ORDER_LIST_SUCCESS,
    GET_ACTIVE_OPEN_ORDER_LIST_FAILURE
}
    from 'Actions/types';


// Set Initial State
const INITIAL_STATE = {
    loading: false,
    OpenOrder: [],
    cancelOrder: [],
    recentOrderBit:1
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // get Active Open Order list
        case GET_ACTIVE_OPEN_ORDER_LIST:
            return { ...state, loading: true };

        // set Data Of  Active Open Order list
        case GET_ACTIVE_OPEN_ORDER_LIST_SUCCESS:

        return { ...state, loading: false, OpenOrder: action.payload,recentOrderBit:++state.recentOrderBit };

        // Display Error for Active Open Order list failure
        case GET_ACTIVE_OPEN_ORDER_LIST_FAILURE:

        return { ...state, OpenOrder: [], loading: false,recentOrderBit:++state.recentOrderBit };

        default: return { ...state };

    }
}