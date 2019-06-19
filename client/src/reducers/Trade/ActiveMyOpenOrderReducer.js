// Reduceders for Active Open My Order Data By Tejas Date: 14/9/2018

import {
    GET_ACTIVE_OPEN_MY_ORDER_LIST,
    GET_ACTIVE_OPEN_MY_ORDER_LIST_SUCCESS,
    GET_ACTIVE_OPEN_MY_ORDER_LIST_FAILURE
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    activeOpenMyOrder: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // get  Active Open My Order list
        case GET_ACTIVE_OPEN_MY_ORDER_LIST:
            return { ...state, loading: true };

        // set Data Of   Active Open My Order list
        case GET_ACTIVE_OPEN_MY_ORDER_LIST_SUCCESS:

            return { ...state, loading: false, activeOpenMyOrder: action.payload };

        // Display Error for  Active Open My Order list failure
        case GET_ACTIVE_OPEN_MY_ORDER_LIST_FAILURE:

            return { ...state, loading: false, activeOpenMyOrder: [] };

        default: return { ...state };
    }
}