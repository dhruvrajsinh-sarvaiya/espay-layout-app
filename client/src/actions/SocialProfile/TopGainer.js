/**
 * Auther : Salim Deraiya
 * Created : 31-01-2019
 * Top Gainer Actions
 */

import {
    //Get Top Gainer List
    GET_TOP_GAINER_LIST,
    GET_TOP_GAINER_LIST_SUCCESS,
    GET_TOP_GAINER_LIST_FAILURE,

} from "../types";

/**
 * Redux Action To Get Top Gainer List
 */
export const getTopGainerList = (data) => ({
    type: GET_TOP_GAINER_LIST,
    payload : data
});

/**
 * Redux Action To Get Top Gainer List Success
 */
export const getTopGainerListSuccess = (data) => ({
    type: GET_TOP_GAINER_LIST_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Top Gainer List Failure
 */
export const getTopGainerListFailure = (error) => ({
    type: GET_TOP_GAINER_LIST_FAILURE,
    payload: error
});