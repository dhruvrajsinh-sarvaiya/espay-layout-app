/* 
    Developer : Nishant Vadgama
    Date : 07-02-2019
    File Comment : Charges collected report reducer constants
*/

import {
    GET_CHARGECOLLECTED_REPORT,
    GET_CHARGECOLLECTED_REPORT_SUCCESS,
    GET_CHARGECOLLECTED_REPORT_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
    chargesData: [],
    totalCount: 0,
    loading: false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        case GET_CHARGECOLLECTED_REPORT:
            return { ...state, loading: true, chargesData: [] };

        case GET_CHARGECOLLECTED_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                chargesData: action.payload.Data,
                totalCount: action.payload.TotalCount,
            };

        case GET_CHARGECOLLECTED_REPORT_FAILURE:
            return { ...state, loading: false, chargesData: [], totalCount: 0 };

        default:
            return { ...state };
    }
};
