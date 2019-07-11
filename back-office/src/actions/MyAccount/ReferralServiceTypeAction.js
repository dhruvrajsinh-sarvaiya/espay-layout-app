/**
 * Created By Sanjay
 * Creatde Date 13/02/2019
 * Action For Referral ServiceType 
 */
import {

    LIST_REFERRAL_SERVICE_TYPE,
    LIST_REFERRAL_SERVICE_TYPE_SUCCESS,
    LIST_REFERRAL_SERVICE_TYPE_FAILURE,

    ADD_REFERRAL_SERVICE_TYPE,
    ADD_REFERRAL_SERVICE_TYPE_SUCCESS,
    ADD_REFERRAL_SERVICE_TYPE_FAILURE,

    UPDATE_REFERRAL_SERVICE_TYPE,
    UPDATE_REFERRAL_SERVICE_TYPE_SUCCESS,
    UPDATE_REFERRAL_SERVICE_TYPE_FAILURE,

    ACTIVE_REFERRAL_SERVICE_TYPE,
    ACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS,
    ACTIVE_REFERRAL_SERVICE_TYPE_FAILURE,

    INACTIVE_REFERRAL_SERVICE_TYPE,
    INACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS,
    INACTIVE_REFERRAL_SERVICE_TYPE_FAILURE,

    GET_REFERRAL_SERVICE_TYPE_BY_ID,
    GET_REFERRAL_SERVICE_TYPE_BY_ID_SUCCESS,
    GET_REFERRAL_SERVICE_TYPE_BY_ID_FAILURE

} from '../types';

//For Display Referral Service Type Data

export const getReferralServiceTypeData = () => ({
    type: LIST_REFERRAL_SERVICE_TYPE
});

export const getReferralServiceTypeDataSuccess = (response) => ({
    type: LIST_REFERRAL_SERVICE_TYPE_SUCCESS,
    payload: response
});

export const getReferralServiceTypeDataFailure = (error) => ({
    type: LIST_REFERRAL_SERVICE_TYPE_FAILURE,
    payload: error
});

//For Add Referral Service Type 

export const addReferralServiceType = (request) => ({
    type: ADD_REFERRAL_SERVICE_TYPE,
    payload: request
});

export const addReferralServiceTypeSuccess = (response) => ({
    type: ADD_REFERRAL_SERVICE_TYPE_SUCCESS,
    payload: response
});

export const addReferralServiceTypeFailure = (error) => ({
    type: ADD_REFERRAL_SERVICE_TYPE_FAILURE,
    payload: error
});

//For Edit Referral Service Type 

export const updateReferralServiceType = (request) => ({
    type: UPDATE_REFERRAL_SERVICE_TYPE,
    payload: request
});

export const updateReferralServiceTypeSuccess = (response) => ({
    type: UPDATE_REFERRAL_SERVICE_TYPE_SUCCESS,
    payload: response
});

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

/* Redux Action for Get Referral Service Type Data By ID */
export const getServiceTypeById = (request) => ({
    type: GET_REFERRAL_SERVICE_TYPE_BY_ID,
    payload: request
});

/* Redux Action for Get Referral Service Type Data By ID Success */
export const getServiceTypeByIdSuccess = (response) => ({
    type: GET_REFERRAL_SERVICE_TYPE_BY_ID_SUCCESS,
    payload: response
});

/* Redux Action for Get Referral Service Type Data By ID Failure */
export const getServiceTypeByIdFailure = (error) => ({
    type: GET_REFERRAL_SERVICE_TYPE_BY_ID_FAILURE,
    payload: error
});