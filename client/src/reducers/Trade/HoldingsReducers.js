// Reduceders for my Holdings Data By Tejas Date: 14/9/2018

import {
    GET_HOLDING_LIST,
    GET_HOLDING_LIST_SUCCESS,
    GET_HOLDING_LIST_FAILURE
}
    from 'Actions/types';

// Set Initial State
const INITIAL_STATE = {
    loading:false,
    holdings: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // get Holding list
        case GET_HOLDING_LIST:
            return { ...state,loading:true };

        // set Data Of  Holding list
        case GET_HOLDING_LIST_SUCCESS:
      
            return { ...state, holdings: action.payload,loading:false };

        // Display Error for Holding list failure
        case GET_HOLDING_LIST_FAILURE:
           
            return { ...state,loading:false,holdings:[] };

        default: return { ...state };

    }
}