/**
   Auther: Palak Gajjar
   Created : 04/06/2019
    Reducer File for Market Making List Component
 */

//Import action types form type.js
import {
    GET_MARKET_MAKING,
    GET_MARKET_MAKING_SUCCESS,
    GET_MARKET_MAKING_FAILURE,

    UPDATE_MARKET_MAKING,
    UPDATE_MARKET_MAKING_SUCCESS,
    UPDATE_MARKET_MAKING_FAILURE,
} from "Actions/types";

/**
 * initial data
 */
const INIT_STATE = {
    marketList: [],
    loading: false,
    chngStsData: [],
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //List Market Making
        case GET_MARKET_MAKING:
            return { ...state, loading: true, marketList: '',chngStsData: '' };

        case GET_MARKET_MAKING_SUCCESS:
        case GET_MARKET_MAKING_FAILURE:
            return { ...state, loading: false, marketList: action.payload };

        //Change Status of Market Making
        case UPDATE_MARKET_MAKING:
            return { ...state, loading: true, chngStsData: '', marketList : ''};

        case UPDATE_MARKET_MAKING_SUCCESS:
        case UPDATE_MARKET_MAKING_FAILURE:
            return { ...state, loading: false, chngStsData: action.payload };
        default:
            return { ...state };
    }
};