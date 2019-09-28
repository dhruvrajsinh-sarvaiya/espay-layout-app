
import {
    GET_CMS_DASHBOARD_DETAILS,
    GET_CMS_DASHBOARD_DETAILS_SUCCESS,
    GET_CMS_DASHBOARD_DETAILS_FAILURE,

    CLEAR_DATA_GET_CMS_DASHBOARD_DETAILS,
} from '../ActionTypes';

//  Function for Get Cms Dashboard Data Action

export const getCmsDashboardDetails = (payload) => ({
    type: GET_CMS_DASHBOARD_DETAILS,
    payload: payload
});

//  Function for Get get CmsDashboard Data Success Action

export const getCmsDashboardDetailsSuccess = (response) => ({
    type: GET_CMS_DASHBOARD_DETAILS_SUCCESS,
    response: response
});

//   Function for CmsDashboard Data Failure Action

export const getCmsDashboardDetailsFailure = (error) => ({
    type: GET_CMS_DASHBOARD_DETAILS_FAILURE,
    response: error
});

export const clearData = () => ({
    type: CLEAR_DATA_GET_CMS_DASHBOARD_DETAILS,
});