/* 
    Developer : Parth Andhariya
    Date : 15-04-2019
    File Comment : IP Wise Request report reducer
*/
import {
    // list...
    GET_IP_WISE_REQUEST_REPORT,
    GET_IP_WISE_REQUEST_REPORT_SUCCESS,
    GET_IP_WISE_REQUEST_REPORT_FAILURE,
} from "Actions/types";
// initial state
const INITIAL_STATE = {
    loading: false,
    TotalCount: 0,
    IpWiseReport: []
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        //list...
        case GET_IP_WISE_REQUEST_REPORT:
            return {
                ...state,
                loading: true,
            };
        case GET_IP_WISE_REQUEST_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                IpWiseReport: action.payload.Response,
                TotalCount: action.payload.TotalCount
            };
        case GET_IP_WISE_REQUEST_REPORT_FAILURE:
            return {
                ...state,
                loading: false,
                IpWiseReport: [],
                TotalCount: 0
            };

        default:
            return { ...state };
    }
};
