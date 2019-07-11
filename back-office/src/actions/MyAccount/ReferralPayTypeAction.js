/**
 * Created By Sanjay
 * Creatde Date 12/02/2019
 * Action For Referral PayType 
 */
import {

    LIST_REFERRAL_PAY_TYPE,
    LIST_REFERRAL_PAY_TYPE_SUCCESS,
    LIST_REFERRAL_PAY_TYPE_FAILURE,

    ADD_REFERRAL_PAY_TYPE,
    ADD_REFERRAL_PAY_TYPE_SUCCESS,
    ADD_REFERRAL_PAY_TYPE_FAILURE,

    UPDATE_REFERRAL_PAY_TYPE,
    UPDATE_REFERRAL_PAY_TYPE_SUCCESS,
    UPDATE_REFERRAL_PAY_TYPE_FAILURE,

    ACTIVE_REFERRAL_PAY_TYPE,
    ACTIVE_REFERRAL_PAY_TYPE_SUCCESS,
    ACTIVE_REFERRAL_PAY_TYPE_FAILURE,

    INACTIVE_REFERRAL_PAY_TYPE,
    INACTIVE_REFERRAL_PAY_TYPE_SUCCESS,
    INACTIVE_REFERRAL_PAY_TYPE_FAILURE,

    GET_REFERRAL_PAY_TYPE_BY_ID,
    GET_REFERRAL_PAY_TYPE_BY_ID_SUCCESS,
    GET_REFERRAL_PAY_TYPE_BY_ID_FAILURE

} from '../types';

//For Display Referral Pay Type Data

export const getReferralPayTypeData = () => ({
    type: LIST_REFERRAL_PAY_TYPE
});

export const getReferralPayTypeDataSuccess = (response) => ({
    type: LIST_REFERRAL_PAY_TYPE_SUCCESS,
    payload: response
});

export const getReferralPayTypeDataFailure = (error) => ({
    type: LIST_REFERRAL_PAY_TYPE_FAILURE,
    payload: error
});

//For Add Referral Pay Type 

export const addReferralPayType = (request) => ({
    type: ADD_REFERRAL_PAY_TYPE,
    payload: request
});

export const addReferralPayTypeSuccess = (response) => ({
    type: ADD_REFERRAL_PAY_TYPE_SUCCESS,
    payload: response
});

export const addReferralPayTypeFailure = (error) => ({
    type: ADD_REFERRAL_PAY_TYPE_FAILURE,
    payload: error
});

//For Edit Referral Pay Type 

export const updateReferralPayType = (request) => ({
    type: UPDATE_REFERRAL_PAY_TYPE,
    payload: request
});

export const updateReferralPayTypeSuccess = (response) => ({
    type: UPDATE_REFERRAL_PAY_TYPE_SUCCESS,
    payload: response
});

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

/* Redux Action for Get Referral Pay Type Data By ID */
export const getPayTypeById = (request) => ({
    type: GET_REFERRAL_PAY_TYPE_BY_ID,
    payload: request
});

/* Redux Action for Get Referral Pay Type Data By ID Success */
export const getPayTypeByIdSuccess = (response) => ({
    type: GET_REFERRAL_PAY_TYPE_BY_ID_SUCCESS,
    payload: response
});

/* Redux Action for Get Referral Pay Type Data By ID Failure */
export const getPayTypeByIdFailure = (error) => ({
    type: GET_REFERRAL_PAY_TYPE_BY_ID_FAILURE,
    payload: error
});