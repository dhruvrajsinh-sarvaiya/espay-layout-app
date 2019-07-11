/**
 * Auther : Salim Deraiya
 * Created : 31-01-2019
 * Top Leader Actions
 */

import {
    //Get Top Leader List
    GET_TOP_LEADER_LIST,
    GET_TOP_LEADER_LIST_SUCCESS,
    GET_TOP_LEADER_LIST_FAILURE,

} from "../types";

/**
 * Redux Action To Get Top Leader List
 */
export const getTopLeaderList = () => ({
    type: GET_TOP_LEADER_LIST
});

/**
 * Redux Action To Get Top Leader List Success
 */
export const getTopLeaderListSuccess = (data) => ({
    type: GET_TOP_LEADER_LIST_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Top Leader List Failure
 */
export const getTopLeaderListFailure = (error) => ({
    type: GET_TOP_LEADER_LIST_FAILURE,
    payload: error
});