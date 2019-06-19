/**
 * Auther : Salim Deraiya
 * Created : 31-01-2019
 * Top Looser Actions
 */

import {
    //Get Top Looser List
    GET_TOP_LOOSER_LIST,
    GET_TOP_LOOSER_LIST_SUCCESS,
    GET_TOP_LOOSER_LIST_FAILURE,

} from "../types";

/**
 * Redux Action To Get Top Looser List
 */
export const getTopLooserList = (data) => ({
    type: GET_TOP_LOOSER_LIST,
    payload : data
});

/**
 * Redux Action To Get Top Looser List Success
 */
export const getTopLooserListSuccess = (data) => ({
    type: GET_TOP_LOOSER_LIST_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Top Looser List Failure
 */
export const getTopLooserListFailure = (error) => ({
    type: GET_TOP_LOOSER_LIST_FAILURE,
    payload: error
});