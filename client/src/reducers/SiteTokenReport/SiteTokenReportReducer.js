// Reducer For Handle Site Token Report List By Tejas 8/2/2019
// import types
import {
    GET_SITE_TOKEN_REPORT_LIST,
    GET_SITE_TOKEN_REPORT_LIST_SUCCESS,
    GET_SITE_TOKEN_REPORT_LIST_FAILURE,    
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    siteTokenHistory: [],
    loading: false,
    errorCode:0
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // get Site Token Report List
        case GET_SITE_TOKEN_REPORT_LIST:
            return { ...state, loading: true };

        // set Data Of Site Token Report List
        case GET_SITE_TOKEN_REPORT_LIST_SUCCESS:
            return { ...state, siteTokenHistory: action.payload.Response,errorCode:action.payload.ErrorCode, loading: false, error: [] };

        // Display Error for Site Token Report List failure
        case GET_SITE_TOKEN_REPORT_LIST_FAILURE:

            return { ...state, loading: false, siteTokenHistory: [],errorCode:0, error: action.payload };


        default:
            return { ...state };
    }
};
