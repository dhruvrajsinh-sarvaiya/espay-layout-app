// Actions For Site Token Conversion List By Tejas 9/2/2019

// import types
import {
    GET_SITE_TOKEN_CONVERSION_LIST,
    GET_SITE_TOKEN_CONVERSION_LIST_SUCCESS,
    GET_SITE_TOKEN_CONVERSION_LIST_FAILURE,    
} from "Actions/types";

//action for Site Token Conversion List and set type for reducers
export const getSiteTokenConversionList = Data => ({
    type: GET_SITE_TOKEN_CONVERSION_LIST,
    payload: { Data }
});

//action for set Success and Site Token Conversion List and set type for reducers
export const getSiteTokenConversionListSuccess = response => ({
    type: GET_SITE_TOKEN_CONVERSION_LIST_SUCCESS,
    payload: response
});

//action for set failure and error to Site Token Conversion List and set type for reducers
export const getSiteTokenConversionListFailure = error => ({
    type: GET_SITE_TOKEN_CONVERSION_LIST_FAILURE,
    payload: error
});