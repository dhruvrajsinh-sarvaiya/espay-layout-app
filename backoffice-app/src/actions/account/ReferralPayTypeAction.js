/**
 * Created By Dipesh
 * Creatde Date 28/02/2019
 * Action For Referral PayType 
 */
import {

    //list referral pay type
    LIST_REFERRAL_PAY_TYPE,
    LIST_REFERRAL_PAY_TYPE_SUCCESS,
    LIST_REFERRAL_PAY_TYPE_FAILURE,

    //add referral pay type
    ADD_REFERRAL_PAY_TYPE,
    ADD_REFERRAL_PAY_TYPE_SUCCESS,
    ADD_REFERRAL_PAY_TYPE_FAILURE,

    //update referral pay type
    UPDATE_REFERRAL_PAY_TYPE,
    UPDATE_REFERRAL_PAY_TYPE_SUCCESS,
    UPDATE_REFERRAL_PAY_TYPE_FAILURE,

    //active referral pay type
    ACTIVE_REFERRAL_PAY_TYPE,
    ACTIVE_REFERRAL_PAY_TYPE_SUCCESS,
    ACTIVE_REFERRAL_PAY_TYPE_FAILURE,

    //in active referral pay type
    INACTIVE_REFERRAL_PAY_TYPE,
    INACTIVE_REFERRAL_PAY_TYPE_SUCCESS,
    INACTIVE_REFERRAL_PAY_TYPE_FAILURE,

    //clear data
    ACTIVE_INACTIVE_REFERRAL_PAY_TYPE_CLEAR,
    CLEAR_DATA_REFERRAL_PAY_TYPE,
} from "../ActionTypes";

//For Display Referral Pay Type Data
export const getReferralPayTypeData = () => ({
    type: LIST_REFERRAL_PAY_TYPE
});
//For Display Referral Pay Type Data success
export const getReferralPayTypeDataSuccess = (response) => ({
    type: LIST_REFERRAL_PAY_TYPE_SUCCESS,
    payload: response
});
//For Display Referral Pay Type Data failure
export const getReferralPayTypeDataFailure = (error) => ({
    type: LIST_REFERRAL_PAY_TYPE_FAILURE,
    payload: error
});

//For Add Referral Pay Type 
export const addReferralPayType = (request) => ({
    type: ADD_REFERRAL_PAY_TYPE,
    payload: request
});
//For Add Referral Pay Type success
export const addReferralPayTypeSuccess = (response) => ({
    type: ADD_REFERRAL_PAY_TYPE_SUCCESS,
    payload: response
});
//For Add Referral Pay Type failure
export const addReferralPayTypeFailure = (error) => ({
    type: ADD_REFERRAL_PAY_TYPE_FAILURE,
    payload: error
});

//For Edit Referral Pay Type 
export const updateReferralPayType = (request) => ({
    type: UPDATE_REFERRAL_PAY_TYPE,
    payload: request
});
//For Edit Referral Pay Type success
export const updateReferralPayTypeSuccess = (response) => ({
    type: UPDATE_REFERRAL_PAY_TYPE_SUCCESS,
    payload: response
});
//For Edit Referral Pay Type failure
export const updateReferralPayTypeFailure = (error) => ({
    type: UPDATE_REFERRAL_PAY_TYPE_FAILURE,
    payload: error
});

/* Redux Action To Active PayType Data */
export const activePayType = (request) => ({
    type: ACTIVE_REFERRAL_PAY_TYPE,
    payload: request
});
/* Redux Action To Active PayType Success */
export const activePayTypeSuccess = (response) => ({
    type: ACTIVE_REFERRAL_PAY_TYPE_SUCCESS,
    payload: response
});
/* Redux Action To Active PayType Failure */
export const activePayTypeFailure = (error) => ({
    type: ACTIVE_REFERRAL_PAY_TYPE_FAILURE,
    payload: error
});
/* Redux Action To InActive PayType Data */
export const inactivePayType = (request) => ({
    type: INACTIVE_REFERRAL_PAY_TYPE,
    payload: request
});

/* Redux Action To InActive PayType Success */
export const inactivePayTypeSuccess = (response) => ({
    type: INACTIVE_REFERRAL_PAY_TYPE_SUCCESS,
    payload: response
});
/* Redux Action To InActive PayType Failure */
export const inactivePayTypeFailure = (error) => ({
    type: INACTIVE_REFERRAL_PAY_TYPE_FAILURE,
    payload: error
});
/* Redux Action for clear active inactive data */
export const clearActiveInactive = (error) => ({
    type: ACTIVE_INACTIVE_REFERRAL_PAY_TYPE_CLEAR,
});

/* Redux Action for clear all data */
export const clearData = (error) => ({
    type: CLEAR_DATA_REFERRAL_PAY_TYPE,
});