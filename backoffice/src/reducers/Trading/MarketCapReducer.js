/* 
    Createdby : Devang Parekh
    CreatedDate : 26-12-2018
    Description : handle State for coin slider list landing page
*/
import {
    MARKET_CAP_LIST,
    MARKET_CAP_LIST_SUCCESS,
    MARKET_CAP_LIST_FAILURE,
    /* ADD_MARKET_CAP,
    ADD_MARKET_CAP_SUCCESS,
    ADD_MARKET_CAP_FAILURE, */
    EDIT_MARKET_CAP,
    EDIT_MARKET_CAP_SUCCESS,
    EDIT_MARKET_CAP_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    marketCapList: [],
    loading: false,
    //addMarketCap:[],
    editMarketCap: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        // get market cap
        case MARKET_CAP_LIST:
            return { loading: true };

        // get market cap success
        case MARKET_CAP_LIST_SUCCESS:
            return { loading: false, marketCapList: action.payload };

        // get market cap failure
        case MARKET_CAP_LIST_FAILURE:
            return { loading: false, marketCapList: [] };

        /* // add market cap
        case ADD_MARKET_CAP:
            return {loading: true};

        // add market cap success
        case ADD_MARKET_CAP_SUCCESS:
            return { addMarketCap:action.payload,loading: false};

        // add market cap failure
        case ADD_MARKET_CAP_FAILURE:
            return {addMarketCap:action.payload,loading: false}; */

        // edit market cap
        case EDIT_MARKET_CAP:
            return { loading: true };

        // edit market cap success
        case EDIT_MARKET_CAP_SUCCESS:
            return { editMarketCap: action.payload, loading: false };

        // edit market cap failure
        case EDIT_MARKET_CAP_FAILURE:
            return { editMarketCap: action.payload, loading: false };

        default: return { ...state };
    }
}
