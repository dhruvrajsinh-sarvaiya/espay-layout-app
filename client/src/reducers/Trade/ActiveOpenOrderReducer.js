// Reduceders for Active Open Order Data By Tejas Date: 14/9/2018

import {
    GET_ACTIVE_OPEN_ORDER_LIST,
    GET_ACTIVE_OPEN_ORDER_LIST_SUCCESS,
    GET_ACTIVE_OPEN_ORDER_LIST_FAILURE,
    DO_CANCEL_ORDER,
    DO_CANCEL_ORDER_SUCCESS,
    DO_CANCEL_ORDER_FAILURE
}
    from 'Actions/types';


// Set Initial State
const INITIAL_STATE = {
    loading: false,
    OpenOrder: [],
    cancelOrder: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // get Active Open Order list
        case GET_ACTIVE_OPEN_ORDER_LIST:
            return { ...state, loading: true };

        // set Data Of  Active Open Order list
        case GET_ACTIVE_OPEN_ORDER_LIST_SUCCESS:

            return { ...state, loading: false, OpenOrder: action.payload };

        // Display Error for Active Open Order list failure
        case GET_ACTIVE_OPEN_ORDER_LIST_FAILURE:

            return { ...state, OpenOrder: [], loading: false };

        // do cancel Open Order 
        case DO_CANCEL_ORDER:
            return { ...state, loading: true };

        // set response Of  cancel Open Order 
        case DO_CANCEL_ORDER_SUCCESS:

            return { ...state, loading: false, cancelOrder: action.payload };

        // Display Error for cancel Open Order  failure
        case DO_CANCEL_ORDER_FAILURE:

            return { ...state, loading: false, cancelOrder: [] };


        default: return { ...state };

    }
}