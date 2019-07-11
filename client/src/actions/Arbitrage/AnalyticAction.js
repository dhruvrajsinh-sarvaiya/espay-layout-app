/* 
    Developer : Vishva shah
    Date : 13-06-2019
    File Comment : Analytics Action
*/
import {
    //Analytics method
    GET_ANALYTICSGRAPH_RECORD,
	GET_ANALYTICSGRAPH_RECORD_SUCCESS,
	GET_ANALYTICSGRAPH_RECORD_FAILURE,
} from '../types';

/* List analytic grapg report*/
export const getAnalyticGraphRecord = (request) => ({
    type: GET_ANALYTICSGRAPH_RECORD,
    request: request
});
export const getAnalyticGraphRecordSuccess = (response) => ({
    type: GET_ANALYTICSGRAPH_RECORD_SUCCESS,
    payload: response
});
export const getAnalyticGraphRecordFailure = (error) => ({
    type: GET_ANALYTICSGRAPH_RECORD_FAILURE,
    payload: error
});