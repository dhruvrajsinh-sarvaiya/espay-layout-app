/* 
   Developer : Parth Andhariya
    Date : 10-06-2019
    File Comment : Topup History reducer
*/
import {
    // list...
    LIST_TOPUP_HISTORY,
    LIST_TOPUP_HISTORY_SUCCESS,
    LIST_TOPUP_HISTORY_FAILURE,
    //  Add....
    ADD_TOPUP_REQUEST,
    ADD_TOPUP_REQUEST_SUCCESS,
    ADD_TOPUP_REQUEST_FAILURE,
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    loading: false,
    TopupList: [],
    TopupRequest: '',
    TotalCount: 0
};

export default (state, action) => {
    if (typeof state === 'undefined') {
      return INITIAL_STATE
    }
    switch (action.type) {
        //list...
        case LIST_TOPUP_HISTORY:
            return {
                ...state,
                loading: true,
                TopupList: [],
                TotalCount: 0
            };
        case LIST_TOPUP_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                TopupList: action.payload.Data,
                TotalCount: action.payload.Data.TotalCount
            };
        case LIST_TOPUP_HISTORY_FAILURE:
            return {
                ...state,
                loading: false,
                TopupList: [],
                TotalCount: 0
            };
        //Add...
        case ADD_TOPUP_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ADD_TOPUP_REQUEST_SUCCESS:
        case ADD_TOPUP_REQUEST_FAILURE:
            return {
                ...state,loading: false,TopupRequest: action.payload,
            };
        default:
            return { ...state };
    }
};
