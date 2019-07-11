/* 
    Developer : Nishant Vadgama
    Date : 12-02-2019
    File Comment : Leverage Requests reducer constants
*/

import {
    //wallets...
    LEVERAGE_REQUEST_LIST,
    LEVERAGE_REQUEST_LIST_SUCCESS,
    LEVERAGE_REQUEST_LIST_FAILURE,
    // accpet or reject request
    ACCEPTREJECT_LEVERAGEREQUEST,
    ACCEPTREJECT_LEVERAGEREQUEST_SUCCESS,
    ACCEPTREJECT_LEVERAGEREQUEST_FAILURE,
} from 'Actions/types';

// initial state
const INIT_STATE = {
    loading: false,
    leverageRequest: [],
    leverageResponse: {},
    totalCount: 0,
}

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        //wallets...
        case LEVERAGE_REQUEST_LIST:
            return { ...state, loading: true, leverageRequest: [], leverageResponse: {} }
        case LEVERAGE_REQUEST_LIST_SUCCESS:
            return { ...state, loading: false, leverageRequest: action.payload.Data, totalCount: action.payload.TotalCount }
        case LEVERAGE_REQUEST_LIST_FAILURE:
            return { ...state, loading: false, leverageRequest: [], totalCount: 0 }
        // accpet or reject request
        case ACCEPTREJECT_LEVERAGEREQUEST:
            return { ...state, loading: true, leverageResponse: {} }
        case ACCEPTREJECT_LEVERAGEREQUEST_SUCCESS:
        case ACCEPTREJECT_LEVERAGEREQUEST_FAILURE:
            return { ...state, loading: false, leverageResponse: action.payload }
        //default
        default:
            return { ...state };
    }
}