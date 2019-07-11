/* 
    Developer : Kevin Ladani
    Date : 24-12-2018
    File Comment : MyAccount Domain Dashboard Actions
*/
import {
    DOMAIN_DASHBOARD,
    DOMAIN_DASHBOARD_SUCCESS,
    DOMAIN_DASHBOARD_FAILURE,

    ADD_DOMAIN,
    ADD_DOMAIN_SUCCESS,
    ADD_DOMAIN_FAILURE,

    LIST_DOMAIN,
    LIST_DOMAIN_SUCCESS,
    LIST_DOMAIN_FAILURE,

    LIST_ACTIVE_DOMAIN,
    LIST_ACTIVE_DOMAIN_SUCCESS,
    LIST_ACTIVE_DOMAIN_FAILURE,

    LIST_INACTIVE_DOMAIN,
    LIST_INACTIVE_DOMAIN_SUCCESS,
    LIST_INACTIVE_DOMAIN_FAILURE,

    ACTIVE_DOMAIN,
    ACTIVE_DOMAIN_SUCCESS,
    ACTIVE_DOMAIN_FAILURE,

    INACTIVE_DOMAIN,
    INACTIVE_DOMAIN_SUCCESS,
    INACTIVE_DOMAIN_FAILURE,


} from "../types";

//For Display Domain Data
/* Redux Action To Display Domain Data */
export const getDomainData = () => ({
    type: DOMAIN_DASHBOARD
});

/* Redux Action To Display Domain Data Success */
export const getDomainDataSuccess = (response) => ({
    type: DOMAIN_DASHBOARD_SUCCESS,
    payload: response
});

/* Redux Action To Display Domain Data Failure */
export const getDomainDataFailure = (error) => ({
    type: DOMAIN_DASHBOARD_FAILURE,
    payload: error
});

/* Redux Action To Add Domain Data */
export const addDomain = (data) => ({
    type: ADD_DOMAIN,
    payload: data
});

/* Redux Action To Add Domain Data Success */
export const addDomainSuccess = (response) => ({
    type: ADD_DOMAIN_SUCCESS,
    payload: response
});

/* Redux Action To Add Domain Data Failure */
export const addDomainFailure = (error) => ({
    type: ADD_DOMAIN_FAILURE,
    payload: error
});


//For Display List Domain Data
/* Redux Action To Display List Domain Data */
export const listDomainData = (listData) => ({
    type: LIST_DOMAIN,
    payload: listData
});

/* Redux Action To Display List Domain Data Success */
export const listDomainDataSuccess = (response) => ({
    type: LIST_DOMAIN_SUCCESS,
    payload: response
});

/* Redux Action To Display List Domain Data Failure */
export const listDomainDataFailure = (error) => ({
    type: LIST_DOMAIN_FAILURE,
    payload: error
});


//For Display List Active Domain Data
/* Redux Action To Display List Active Domain Data */
export const listActiveDomainData = (listActiveData) => ({
    type: LIST_ACTIVE_DOMAIN,
    payload: listActiveData,
});

/* Redux Action To Display List Active Domain Data Success */
export const listActiveDomainDataSuccess = (response) => ({
    type: LIST_ACTIVE_DOMAIN_SUCCESS,
    payload: response
});

/* Redux Action To Display List Active Domain Data Failure */
export const listActiveDomainDataFailure = (error) => ({
    type: LIST_ACTIVE_DOMAIN_FAILURE,
    payload: error
});

//For Display List Active Domain Data
/* Redux Action To Display List InActive Domain Data */
export const listInActiveDomainData = (listInActiveData) => ({
    type: LIST_INACTIVE_DOMAIN,
    payload: listInActiveData
});

/* Redux Action To Display List InActive Domain Data Success */
export const listInActiveDomainDataSuccess = (response) => ({
    type: LIST_INACTIVE_DOMAIN_SUCCESS,
    payload: response
});

/* Redux Action To Display List InActive Domain Data Failure */
export const listInActiveDomainDataFailure = (error) => ({
    type: LIST_INACTIVE_DOMAIN_FAILURE,
    payload: error
});

/* Redux Action To Active Domain Data */
export const activeDomain = (data) => ({
    type: ACTIVE_DOMAIN,
    payload: data
});

/* Redux Action To Active Domain Success */
export const activeDomainSuccess = (response) => ({
    type: ACTIVE_DOMAIN_SUCCESS,
    payload: response
});

/* Redux Action To Active Domain Failure */
export const activeDomainFailure = (error) => ({
    type: ACTIVE_DOMAIN_FAILURE,
    payload: error
});

/* Redux Action To InActive Domain Data */
export const inactiveDomain = (data) => ({
    type: INACTIVE_DOMAIN,
    payload: data
});

/* Redux Action To InActive Domain Success */
export const inactiveDomainSuccess = (response) => ({
    type: INACTIVE_DOMAIN_SUCCESS,
    payload: response
});

/* Redux Action To InActive Domain Failure */
export const inactiveDomainFailure = (error) => ({
    type: INACTIVE_DOMAIN_FAILURE,
    payload: error
});
