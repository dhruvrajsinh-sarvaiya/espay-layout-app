// Actions For Site Token
// import types
import {
    //Site token list
    GET_SITE_TOKEN_LIST,
    GET_SITE_TOKEN_LIST_SUCCESS,
    GET_SITE_TOKEN_LIST_FAILURE,

    //Site token add
    ADD_SITE_TOKEN_LIST,
    ADD_SITE_TOKEN_LIST_SUCCESS,
    ADD_SITE_TOKEN_LIST_FAILURE,

    //Site token edit
    UPDATE_SITE_TOKEN_LIST,
    UPDATE_SITE_TOKEN_LIST_SUCCESS,
    UPDATE_SITE_TOKEN_LIST_FAILURE,

    //Rate type
    GET_RATE_TYPE,
    GET_RATE_TYPE_SUCCESS,
    GET_RATE_TYPE_FAILURE,

    //clear data
    CLEAR_SITE_TOKEN
} from "../ActionTypes";

//action for Site Token and set type for reducers
export const getSiteTokenList = request => ({
    type: GET_SITE_TOKEN_LIST,
    payload: { request }
});

//action for set Success and Site Token and set type for reducers
export const getSiteTokenListSuccess = response => ({
    type: GET_SITE_TOKEN_LIST_SUCCESS,
    payload: response
});

//action for set failure and error to Site Token and set type for reducers
export const getSiteTokenListFailure = error => ({
    type: GET_SITE_TOKEN_LIST_FAILURE,
    payload: error
});

//action for Add Site Token and set type for reducers
export const addSiteToken = request => ({
    type: ADD_SITE_TOKEN_LIST,
    payload: { request }
});

//action for set Success and Add Site Token and set type for reducers
export const addSiteTokenSuccess = response => ({
    type: ADD_SITE_TOKEN_LIST_SUCCESS,
    payload: response
});

//action for set failure and error to Add Site Token and set type for reducers
export const addSiteTokenFailure = error => ({
    type: ADD_SITE_TOKEN_LIST_FAILURE,
    payload: error
});

//action for Update Site Token and set type for reducers
export const updateSiteToken = request => ({
    type: UPDATE_SITE_TOKEN_LIST,
    payload: { request }
});

//action for set Success and Update Site Token and set type for reducers
export const updateSiteTokenSuccess = response => ({
    type: UPDATE_SITE_TOKEN_LIST_SUCCESS,
    payload: response
});

//action for set failure and error to Update Site Token and set type for reducers
export const updateSiteTokenFailure = error => ({
    type: UPDATE_SITE_TOKEN_LIST_FAILURE,
    payload: error
});

//action for Get Rate Type and set type for reducers
export const getRateTypeList = Data => ({
    type: GET_RATE_TYPE,
    payload: { Data }
});

//action for set Success and Get Rate Type and set type for reducers
export const getRateTypeListSuccess = response => ({
    type: GET_RATE_TYPE_SUCCESS,
    payload: response
});

//action for set failure and error to Get Rate Type and set type for reducers
export const getRateTypeListFailure = error => ({
    type: GET_RATE_TYPE_FAILURE,
    payload: error
});

//action for Clear Site Token data
export const clearSiteToken = () => ({
    type: CLEAR_SITE_TOKEN
});