/* 
    Developer : Parth Andhariya
    Date : 11-06-2019
    File Comment : Conflict History action
*/
import {
    // list 
    LIST_CONFLICT_HISTORY,
    LIST_CONFLICT_HISTORY_SUCCESS,
    LIST_CONFLICT_HISTORY_FAILURE,
    // Recon
    CONFLICT_RECON_REQUEST,
    CONFLICT_RECON_REQUEST_SUCCESS,
    CONFLICT_RECON_REQUEST_FAILURE,
} from "Actions/types";

/* list Topup History */
export const ListConflictHistory = (request) => ({
    type: LIST_CONFLICT_HISTORY,
    request: request
});
export const ListConflictHistorySuccess = (response) => ({
    type: LIST_CONFLICT_HISTORY_SUCCESS,
    payload: response
});
export const ListConflictHistoryFailure = (error) => ({
    type: LIST_CONFLICT_HISTORY_FAILURE,
    payload: error
});
/* Conflict Recon Request */
export const ConflictReconRequest = (request) => ({
    type: CONFLICT_RECON_REQUEST,
    request: request
});
export const ConflictReconRequestSuccess = (response) => ({
    type: CONFLICT_RECON_REQUEST_SUCCESS,
    payload: response
});
export const ConflictReconRequestFailure = (error) => ({
    type: CONFLICT_RECON_REQUEST_FAILURE,
    payload: error
});
