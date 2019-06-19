/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Application Dashboard Actions
*/
import {
    APPLICATION_DASHBOARD,
    APPLICATION_DASHBOARD_SUCCESS,
    APPLICATION_DASHBOARD_FAILURE,

    ADD_APPLICATION,
    ADD_APPLICATION_SUCCESS,
    ADD_APPLICATION_FAILURE,

    LIST_APPLICATION,
    LIST_APPLICATION_SUCCESS,
    LIST_APPLICATION_FAILURE,

    LIST_ACTIVE_APPLICATION,
    LIST_ACTIVE_APPLICATION_SUCCESS,
    LIST_ACTIVE_APPLICATION_FAILURE,

    LIST_INACTIVE_APPLICATION,
    LIST_INACTIVE_APPLICATION_SUCCESS,
    LIST_INACTIVE_APPLICATION_FAILURE,

    ACTIVE_APPLICATION,
    ACTIVE_APPLICATION_SUCCESS,
    ACTIVE_APPLICATION_FAILURE,

    INACTIVE_APPLICATION,
    INACTIVE_APPLICATION_SUCCESS,
    INACTIVE_APPLICATION_FAILURE
} from "../types";

//For Display Application Data
/**
 * Redux Action To Display Application Data
 */

export const getApplicationData = () => ({
    type: APPLICATION_DASHBOARD
});

/**
 * Redux Action To Display Application Data Success
 */
export const getApplicationDataSuccess = (response) => ({
    type: APPLICATION_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Application Data Failure
 */
export const getApplicationDataFailure = (error) => ({
    type: APPLICATION_DASHBOARD_FAILURE,
    payload: error
});

/* Redux Action To Add Application Data */
export const addApplication = (data) => ({
    type: ADD_APPLICATION,
    payload: data
});

/* Redux Action To Add Application Data Success */
export const addApplicationSuccess = (response) => ({
    type: ADD_APPLICATION_SUCCESS,
    payload: response
});

/* Redux Action To Add Application Data Failure */
export const addApplicationFailure = (error) => ({
    type: ADD_APPLICATION_FAILURE,
    payload: error
});

//For Display List Application Data
/* Redux Action To Display List Application Data */
export const listApplicationData = (listData) => ({
    type: LIST_APPLICATION,
    payload: listData
});

/* Redux Action To Display List Application Data Success */
export const listApplicationDataSuccess = (response) => ({
    type: LIST_APPLICATION_SUCCESS,
    payload: response
});

/* Redux Action To Display List Application Data Failure */
export const listApplicationDataFailure = (error) => ({
    type: LIST_APPLICATION_FAILURE,
    payload: error
});

//For Display List Active Application Data
/* Redux Action To Display List Active Application Data */
export const listActiveApplicationData = (listActiveData) => ({
    type: LIST_ACTIVE_APPLICATION,
    payload: listActiveData,
});

/* Redux Action To Display List Active Application Data Success */
export const listActiveApplicationDataSuccess = (response) => ({
    type: LIST_ACTIVE_APPLICATION_SUCCESS,
    payload: response
});

/* Redux Action To Display List Active Application Data Failure */
export const listActiveApplicationDataFailure = (error) => ({
    type: LIST_ACTIVE_APPLICATION_FAILURE,
    payload: error
});

//For Display List Active Application Data
/* Redux Action To Display List InActive Domain Data */
export const listInActiveApplicationData = (listInActiveData) => ({
    type: LIST_INACTIVE_APPLICATION,
    payload: listInActiveData
});

/* Redux Action To Display List InActive Application Data Success */
export const listInActiveApplicationDataSuccess = (response) => ({
    type: LIST_INACTIVE_APPLICATION_SUCCESS,
    payload: response
});

/* Redux Action To Display List InActive Application Data Failure */
export const listInActiveApplicationDataFailure = (error) => ({
    type: LIST_INACTIVE_APPLICATION_FAILURE,
    payload: error
});

/* Redux Action To Active Application Data */
export const activeApplication = (data) => ({
    type: ACTIVE_APPLICATION,
    payload: data
});

/* Redux Action To Active Application Success */
export const activeApplicationSuccess = (response) => ({
    type: ACTIVE_APPLICATION_SUCCESS,
    payload: response
});

/* Redux Action To Active Application Failure */
export const activeApplicationFailure = (error) => ({
    type: ACTIVE_APPLICATION_FAILURE,
    payload: error
});

/* Redux Action To InActive Application Data */
export const inactiveApplication = (data) => ({
    type: INACTIVE_APPLICATION,
    payload: data
});

/* Redux Action To InActive Application Success */
export const inactiveApplicationSuccess = (response) => ({
    type: INACTIVE_APPLICATION_SUCCESS,
    payload: response
});

/* Redux Action To InActive Application Failure */
export const inactiveApplicationFailure = (error) => ({
    type: INACTIVE_APPLICATION_FAILURE,
    payload: error
});
