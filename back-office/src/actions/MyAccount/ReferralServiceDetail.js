/**
 * Created By Bharat Jograna
 * Creatde Date 23 May 2019
 * Action For Referral Service Detail 
 */
import {

    LIST_REFERRAL_SERVICE_DETAIL,
    LIST_REFERRAL_SERVICE_DETAIL_SUCCESS,
    LIST_REFERRAL_SERVICE_DETAIL_FAILURE,

    ADD_EDIT_REFERRAL_SERVICE_DETAIL,
    ADD_EDIT_REFERRAL_SERVICE_DETAIL_SUCCESS,
    ADD_EDIT_REFERRAL_SERVICE_DETAIL_FAILURE,

    CHANGE_STATUS_REFERRAL_SERVICE_DETAIL,
    CHANGE_STATUS_REFERRAL_SERVICE_DETAIL_SUCCESS,
    CHANGE_STATUS_REFERRAL_SERVICE_DETAIL_FAILURE,

    GET_REFERRAL_SERVICE_DETAIL_BY_ID,
    GET_REFERRAL_SERVICE_DETAIL_BY_ID_SUCCESS,
    GET_REFERRAL_SERVICE_DETAIL_BY_ID_FAILURE

} from '../types';

// For List Referral Service Detail Data
export const getReferralServiceDetailData = (request) => ({
    type: LIST_REFERRAL_SERVICE_DETAIL,
    payload: request
});
export const getReferralServiceDetailDataSuccess = (response) => ({
    type: LIST_REFERRAL_SERVICE_DETAIL_SUCCESS,
    payload: response
});
export const getReferralServiceDetailDataFailure = (error) => ({
    type: LIST_REFERRAL_SERVICE_DETAIL_FAILURE,
    payload: error
});

// For Add Referral Service Detail Data
export const addReferralServiceDetail = (request) => ({
    type: ADD_EDIT_REFERRAL_SERVICE_DETAIL,
    payload: request
});
export const addReferralServiceDetailSuccess = (response) => ({
    type: ADD_EDIT_REFERRAL_SERVICE_DETAIL_SUCCESS,
    payload: response
});
export const addReferralServiceDetailFailure = (error) => ({
    type: ADD_EDIT_REFERRAL_SERVICE_DETAIL_FAILURE,
    payload: error
});

// For Active Status Referral Service Detail Data
export const changeStatusServiceDetail = (request) => ({
    type: CHANGE_STATUS_REFERRAL_SERVICE_DETAIL,
    payload: request
});
export const changeStatusServiceDetailSuccess = (response) => ({
    type: CHANGE_STATUS_REFERRAL_SERVICE_DETAIL_SUCCESS,
    payload: response
});
export const changeStatusServiceDetailFailure = (error) => ({
    type: CHANGE_STATUS_REFERRAL_SERVICE_DETAIL_FAILURE,
    payload: error
});

// For Get Referral Service Detail Data By ID 
export const getServiceDetailById = (request) => ({
    type: GET_REFERRAL_SERVICE_DETAIL_BY_ID,
    payload: request
});
export const getServiceDetailByIdSuccess = (response) => ({
    type: GET_REFERRAL_SERVICE_DETAIL_BY_ID_SUCCESS,
    payload: response
});
export const getServiceDetailByIdFailure = (error) => ({
    type: GET_REFERRAL_SERVICE_DETAIL_BY_ID_FAILURE,
    payload: error
});