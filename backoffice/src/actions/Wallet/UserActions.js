/* 
    Developer : Nishant Vadgama
    Date : 13-12-2018
    File Comment : User details related actions
*/
import {
    USERLIST,
    USERLIST_SUCCESS,
    USERLIST_FAILURE
} from "../types";

/* get user list methods */
export const getUserList = payload => ({
    type: USERLIST,
    payload: payload
});
export const getUserListSuccess = response => ({
    type: USERLIST_SUCCESS,
    payload: response.Details
});
export const getUserListFailulre = error => ({
    type: USERLIST_FAILURE,
    error: error
});
