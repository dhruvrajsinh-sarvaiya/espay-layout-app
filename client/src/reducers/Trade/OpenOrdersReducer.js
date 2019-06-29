// Reduceders for Active Open My Order Data By Tejas Date: 14/9/2018

import {
    GET_ACTIVE_OPEN_MY_ORDER_LIST,
    GET_ACTIVE_OPEN_MY_ORDER_LIST_SUCCESS,
    GET_ACTIVE_OPEN_MY_ORDER_LIST_FAILURE,
    DO_CANCEL_ORDER,
    DO_CANCEL_ORDER_SUCCESS,
    DO_CANCEL_ORDER_FAILURE
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    activeOpenMyOrder: [],
    cancelOrder: [],
    cancelOrderLoading:false,
    activeOrderBit:1
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }
    
    switch (action.type) {

        // get  Active Open My Order list
        case GET_ACTIVE_OPEN_MY_ORDER_LIST:
            return { ...state, loading: true };

        // set Data Of   Active Open My Order list
        case GET_ACTIVE_OPEN_MY_ORDER_LIST_SUCCESS:

        return { ...state, loading: false, activeOpenMyOrder: action.payload,activeOrderBit:++state.activeOrderBit };

        // Display Error for  Active Open My Order list failure
        case GET_ACTIVE_OPEN_MY_ORDER_LIST_FAILURE:

        return { ...state, loading: false, activeOpenMyOrder: [],activeOrderBit:++state.activeOrderBit };

            // do cancel Open Order 
        case DO_CANCEL_ORDER:
            return { ...state, cancelOrderLoading: true };

        // set response Of  cancel Open Order 
        case DO_CANCEL_ORDER_SUCCESS:

            return { ...state, cancelOrderLoading: false, cancelOrder: action.payload };

        // Display Error for cancel Open Order  failure
        case DO_CANCEL_ORDER_FAILURE:

            return { ...state, cancelOrderLoading: false, cancelOrder: [] };

        default: return { ...state };
    }
}