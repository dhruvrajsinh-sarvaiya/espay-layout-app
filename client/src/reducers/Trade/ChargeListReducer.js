// Reduceders for Get Charge List Data By Tejas Date: 2/6/2019

import {
    GET_CHARGES_LIST,
    GET_CHARGES_LIST_SUCCESS,
    GET_CHARGES_LIST_FAILURE
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading: false,
    chargesList: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // get charge list 
        case GET_CHARGES_LIST:
            return { ...state, loading: true };

        // set Data Of charge list 
        case GET_CHARGES_LIST_SUCCESS:

            return { ...state, loading: false, chargesList: action.payload };

        // Display Error for charge list  failure
        case GET_CHARGES_LIST_FAILURE:

            return { ...state, loading: false, chargesList: [] };

        default: return { ...state };
    }
}