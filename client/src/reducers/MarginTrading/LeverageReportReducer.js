/**
 *   Developer : Parth Andhariya
 *   Date : 05-03-2019
 *   Component: Leverge Report Reducer
 */

import {
    GET_LEVERAGE_REPORT_LIST,
    GET_LEVERAGE_REPORT_LIST_SUCCESS,
    GET_LEVERAGE_REPORT_LIST_FAILURE,
    //added by vishva 
    UPGRADE_LOAN,
    UPGRADE_LOAN_SUCCESS,
    UPGRADE_LOAN_FAILURE

} from "Actions/types";
//initial state
const INITIAL_STATE = {
    loading: false,
    Report: [],
    TotalCount: 0,
    updateLoan:[]
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        //List action
        case GET_LEVERAGE_REPORT_LIST:
            return {
                ...state,
                loading: true,
            };

        case GET_LEVERAGE_REPORT_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                Report: action.payload.Data,
                TotalCount: action.payload.TotalCount
            };
        case GET_LEVERAGE_REPORT_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                Report: [],
                TotalCount: 0
            };
            case UPGRADE_LOAN:
            return {
                ...state,
                loading: true,
                updateLoan:[]
            };

        case UPGRADE_LOAN_SUCCESS:
            return {
                ...state,
                loading: false,
                updateLoan: action.payload,
            };
        case UPGRADE_LOAN_FAILURE:
            return {
                ...state,
                loading: false,
                updateLoan: action.payload,
            };
        default:
            return { ...state };
    }
};
