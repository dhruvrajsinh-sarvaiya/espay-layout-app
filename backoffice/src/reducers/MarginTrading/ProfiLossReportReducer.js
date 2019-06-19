/**
 *   Developer : Vishva shah
 *   Date : 27-04-2019
 *   Component: Profit loss Report reducer 
 */

import {
    GET_PROFITLOSS_LIST,
    GET_PROFITLOSS_LIST_SUCCESS,
    GET_PROFITLOSS_LIST_FAILURE,
} from "Actions/types";
//initial state
const INITIAL_STATE = {
    loading: false,
    ProfitLossReport: [],
    TotalCount:0
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        //List action
        case GET_PROFITLOSS_LIST:
            return {
                ...state,
                loading: true,
                TotalCount:0
            };

        case GET_PROFITLOSS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                ProfitLossReport: action.payload.Data,
                TotalCount:action.payload.TotalCount
            };
        case GET_PROFITLOSS_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                ProfitLossReport: [],
                TotalCount:0
            };
        default:
            return { ...state };
    }
};
