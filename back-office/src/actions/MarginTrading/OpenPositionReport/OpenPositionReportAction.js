/**
 *   Developer : Parth Andhariya
 *   Date : 23-04-2019
 *   Component: Open Position Report action 
 */
import {
    GET_OPEN_POSITION_REPORT_LIST,
    GET_OPEN_POSITION_REPORT_LIST_SUCCESS,
    GET_OPEN_POSITION_REPORT_LIST_FAILURE,
} from "Actions/types";
//get action
export const getOpenPositionReportList = data => ({
    type: GET_OPEN_POSITION_REPORT_LIST,
    payload: data
});

export const getOpenPositionReportListSuccess = response => ({
    type: GET_OPEN_POSITION_REPORT_LIST_SUCCESS,
    payload: response
});

export const getOpenPositionReportListFailure = error => ({
    type: GET_OPEN_POSITION_REPORT_LIST_FAILURE,
    payload: error
});

