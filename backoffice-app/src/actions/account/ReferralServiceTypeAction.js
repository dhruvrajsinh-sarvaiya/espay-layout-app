/**
 * Created By Dipesh
 * Creatde Date 27/02/2019
 * Action For Referral ServiceType 
 */
import {

    //list referral service type
    LIST_REFERRAL_SERVICE_TYPE,
    LIST_REFERRAL_SERVICE_TYPE_SUCCESS,
    LIST_REFERRAL_SERVICE_TYPE_FAILURE,

    //add referral service type
    ADD_REFERRAL_SERVICE_TYPE,
    ADD_REFERRAL_SERVICE_TYPE_SUCCESS,
    ADD_REFERRAL_SERVICE_TYPE_FAILURE,

    //edit referral service type
    UPDATE_REFERRAL_SERVICE_TYPE,
    UPDATE_REFERRAL_SERVICE_TYPE_SUCCESS,
    UPDATE_REFERRAL_SERVICE_TYPE_FAILURE,

    //active referral service type
    ACTIVE_REFERRAL_SERVICE_TYPE,
    ACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS,
    ACTIVE_REFERRAL_SERVICE_TYPE_FAILURE,

    //in active referral service type
    INACTIVE_REFERRAL_SERVICE_TYPE,
    INACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS,
    INACTIVE_REFERRAL_SERVICE_TYPE_FAILURE,

    //clear data
    ACTIVE_INACTIVE_SERVICE_CLEAR,
    CLEAR_DATA_SERVICE_TYPE,

} from "../ActionTypes";

/* Redux Action getReferralServiceType Data */
export const getReferralServiceTypeData = () => ({
    type: LIST_REFERRAL_SERVICE_TYPE
});
/* Redux Action getReferralServiceType Data success */
export const getReferralServiceTypeDataSuccess = (response) => ({
    type: LIST_REFERRAL_SERVICE_TYPE_SUCCESS,
    payload: response
});
/* Redux Action getReferralServiceType Data failure */
export const getReferralServiceTypeDataFailure = (error) => ({
    type: LIST_REFERRAL_SERVICE_TYPE_FAILURE,
    payload: error
});

/* Redux Action addReferralServiceType Data */
export const addReferralServiceType = (request) => ({
    type: ADD_REFERRAL_SERVICE_TYPE,
    payload: request
});
/* Redux Action addReferralServiceType Data success*/
export const addReferralServiceTypeSuccess = (response) => ({
    type: ADD_REFERRAL_SERVICE_TYPE_SUCCESS,
    payload: response
});
/* Redux Action addReferralServiceType Data failure */
export const addReferralServiceTypeFailure = (error) => ({
    type: ADD_REFERRAL_SERVICE_TYPE_FAILURE,
    payload: error
});

/* Redux Action updateReferralServiceType Data */
export const updateReferralServiceType = (request) => ({
    type: UPDATE_REFERRAL_SERVICE_TYPE,
    payload: request
});
/* Redux Action updateReferralServiceType success */
export const updateReferralServiceTypeSuccess = (response) => ({
    type: UPDATE_REFERRAL_SERVICE_TYPE_SUCCESS,
    payload: response
});
/* Redux Action updateReferralServiceType failure */
export const updateReferralServiceTypeFailure = (error) => ({
    type: UPDATE_REFERRAL_SERVICE_TYPE_FAILURE,
    payload: error
});

/* Redux Action To Active ServiceType Data */
export const activeServiceType = (request) => ({
    type: ACTIVE_REFERRAL_SERVICE_TYPE,
    payload: request
});
/* Redux Action To Active ServiceType Success */
export const activeServiceTypeSuccess = (response) => ({
    type: ACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS,
    payload: response
});
/* Redux Action To Active ServiceType Failure */
export const activeServiceTypeFailure = (error) => ({
    type: ACTIVE_REFERRAL_SERVICE_TYPE_FAILURE,
    payload: error
});

/* Redux Action To InActive ServiceType Data */
export const inactiveServiceType = (request) => ({
    type: INACTIVE_REFERRAL_SERVICE_TYPE,
    payload: request
});
/* Redux Action To InActive ServiceType Success */
export const inactiveServiceTypeSuccess = (response) => ({
    type: INACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS,
    payload: response
});
/* Redux Action To InActive ServiceType Failure */
export const inactiveServiceTypeFailure = (error) => ({
    type: INACTIVE_REFERRAL_SERVICE_TYPE_FAILURE,
    payload: error
});

/* Redux Action for clear active inactive data */
export const clearActiveInactive = (error) => ({
    type: ACTIVE_INACTIVE_SERVICE_CLEAR,
});

/* Redux Action for clear all data */
export const clearData = (error) => ({
    type: CLEAR_DATA_SERVICE_TYPE,
});