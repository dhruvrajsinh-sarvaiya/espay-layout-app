/* 
    Developer : Vishva shah
    FIle Comment : arbitrage address reducer 
    Date : 12-06-2019
*/

import {
    // get list
    GET_ARBITRAGE_ADDRESS_LIST,
    GET_ARBITRAGE_ADDRESS_LIST_SUCCESS,
    GET_ARBITRAGE_ADDRESS_LIST_FAILURE,
    //insert&update record
    INSERT_UPDATE_ARBITRAGEADDRESS,
    INSERT_UPDATE_ARBITRAGEADDRESS_SUCCESS,
    INSERT_UPDATE_ARBITRAGEADDRESS_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
    errors: {},
    arbitrageAddressList: [],
    formResponse: {},
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // list arbitrage address list
        case GET_ARBITRAGE_ADDRESS_LIST:
            return { ...state, loading: true, errors: {}, formResponse: {} }
        case GET_ARBITRAGE_ADDRESS_LIST_SUCCESS:
            return { ...state, loading: false, arbitrageAddressList: action.payload.Data, formResponse: {} }
        case GET_ARBITRAGE_ADDRESS_LIST_FAILURE:
            return { ...state, loading: false, arbitrageAddressList: [], formResponse: {} }
        // insert & update arbitrage address list
        case INSERT_UPDATE_ARBITRAGEADDRESS:
            return { ...state, loading: true, formResponse: {} }
        case INSERT_UPDATE_ARBITRAGEADDRESS_SUCCESS:
        case INSERT_UPDATE_ARBITRAGEADDRESS_FAILURE:
            return { ...state, loading: false, formResponse: action.payload }
        default:
            return { ...state };
    }
};
