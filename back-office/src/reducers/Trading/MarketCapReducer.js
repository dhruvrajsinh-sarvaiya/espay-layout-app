/* 
    Createdby : Devang Parekh
    CreatedDate : 26-12-2018
    Description : handle State for coin slider list landing page
*/
import {
    MARKET_CAP_LIST,
    MARKET_CAP_LIST_SUCCESS,
    MARKET_CAP_LIST_FAILURE,
    EDIT_MARKET_CAP,
    EDIT_MARKET_CAP_SUCCESS,
    EDIT_MARKET_CAP_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    marketCapList: [],
    loading: false,
    editMarketCap: []
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
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

        // edit market cap
        case EDIT_MARKET_CAP:
            return { loading: true };

        // edit market cap 
        case EDIT_MARKET_CAP_SUCCESS:  
        case EDIT_MARKET_CAP_FAILURE:
            return { editMarketCap: action.payload, loading: false };

        default: return { ...state };
    }
}
