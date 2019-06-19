/**
 * Auther : Salim Deraiya
 * Created : 07-02-2019
 * Leader Board Actions
 */

import {
    //Get Leader Board List
    GET_LEADER_BOARD_LIST,
    GET_LEADER_BOARD_LIST_SUCCESS,
    GET_LEADER_BOARD_LIST_FAILURE,

} from "../types";

/**
 * Redux Action To Get Leader Board List
 */
export const getLeaderBoardList = (data) => ({
    type: GET_LEADER_BOARD_LIST,
    payload: data
});

/**
 * Redux Action To Get Leader Board List Success
 */
export const getLeaderBoardListSuccess = (data) => ({
    type: GET_LEADER_BOARD_LIST_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Leader Board List Failure
 */
export const getLeaderBoardListFailure = (error) => ({
    type: GET_LEADER_BOARD_LIST_FAILURE,
    payload: error
});