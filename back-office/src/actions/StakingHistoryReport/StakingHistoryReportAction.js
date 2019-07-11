/* 
    Developer : Vishva shah
    Date : 23-05-2019
    File Comment : Staking History Report Actions
*/
import {
    // list...
   GET_STAKINGHISTORY_LIST,
   GET_STAKINGHISTORYLIST_SUCCESS,
   GET_STAKINGHISTORYLIST_FAILURE,
   
} from "../types";

/* List methods.. */
export const getStakingHistoryList = (request) => ({
    type: GET_STAKINGHISTORY_LIST,
    request: request
});
export const getStakingHistoryListSuccess = (response) => ({
    type: GET_STAKINGHISTORYLIST_SUCCESS,
    payload: response
});
export const getStakingHistoryListFailure = (error) => ({
    type: GET_STAKINGHISTORYLIST_FAILURE,
    payload: error
});