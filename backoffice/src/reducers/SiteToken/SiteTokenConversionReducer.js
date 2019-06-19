// Reducer For Handle Site Token Conversion List By Tejas 8/2/2019
// import types
import {
    GET_SITE_TOKEN_CONVERSION_LIST,
    GET_SITE_TOKEN_CONVERSION_LIST_SUCCESS,
    GET_SITE_TOKEN_CONVERSION_LIST_FAILURE,    
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    siteTokenConversionList: [],
    loading: false,
    errorCode:0
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // get Site Token Conversion List
        case GET_SITE_TOKEN_CONVERSION_LIST:
            return { ...state, loading: true };

        // set Data Of Site Token Conversion List
        case GET_SITE_TOKEN_CONVERSION_LIST_SUCCESS:
            return { ...state, siteTokenConversionList: action.payload.Response,errorCode:action.payload.ErrorCode, loading: false, error: [] };

        // Display Error for Site Token Conversion List failure
        case GET_SITE_TOKEN_CONVERSION_LIST_FAILURE:

            return { ...state, loading: false, siteTokenConversionList: [],errorCode:0, error: action.payload };


        default:
            return { ...state };
    }
};
