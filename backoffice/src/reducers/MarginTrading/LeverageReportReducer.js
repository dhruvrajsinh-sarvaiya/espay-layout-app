/* 
    Developer : Nishant Vadgama
    File Comment : Leverage Report reducer constants
    Date : 13-09-2019
*/
import {
    GET_LEVERAGE_REPORT,
    GET_LEVERAGE_REPORT_SUCCESS,
    GET_LEVERAGE_REPORT_FAILURE,
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    loading: false,
    leverageList: [],
    TotalCount: 0
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_LEVERAGE_REPORT:
            return { ...state, loading: true, leverageList: [] };
        case GET_LEVERAGE_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                leverageList: action.payload.Data,
                errors: {},
                TotalCount: action.payload.TotalCount
            };
        case GET_LEVERAGE_REPORT_FAILURE:
            return { ...state, loading: false, errors: action.payload, leverageList: [], TotalCount: 0 };

        default:
            return { ...state };
    }
};
