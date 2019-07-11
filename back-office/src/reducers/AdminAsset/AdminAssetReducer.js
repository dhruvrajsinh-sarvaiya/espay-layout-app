/* 
    Developer : Nishant Vadgama
    Date : 01-02-2019
    File Comment : Admin assets report reducer constants
*/
import {
    // list...
    GET_ADMINASSET_REPORT,
    GET_ADMINASSET_REPORT_SUCCESS,
    GET_ADMINASSET_REPORT_FAILURE,
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    loading: false,
    TotalCount: 0,
    adminAssetList: []
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
      }
    switch (action.type) {
        //list...
        case GET_ADMINASSET_REPORT:
            return {
                ...state,
                loading: true,
            };
        case GET_ADMINASSET_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                adminAssetList: action.payload.Data,
                TotalCount: action.payload.TotalCount
            };
        case GET_ADMINASSET_REPORT_FAILURE:
            return {
                ...state,
                loading: false,
                adminAssetList: [],
                TotalCount: 0
            };

        default:
            return { ...state };
    }
};
