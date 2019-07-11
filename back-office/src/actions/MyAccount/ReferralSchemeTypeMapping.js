/**
 * Created By Saloni Rathod
 * Creatde Date 24th May 2019
 * Action For Referral Scheme Type Mapping 
 */
import {

    LIST_REFERRAL_SCHEME_TYPE_MAPPING,
    LIST_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS,
    LIST_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE,

    ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING,
    ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS,
    ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE,

    CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING,
    CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS,
    CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE,

    GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID,
    GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID_SUCCESS,
    GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID_FAILURE

} from '../types';

// For List Referral Scheme Type Mapping
export const getReferralSchemeTypeMappingData = (request) => ({
    type: LIST_REFERRAL_SCHEME_TYPE_MAPPING,
    payload: request
});
export const getReferralSchemeTypeMappingDataSuccess = (response) => ({
    type: LIST_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS,
    payload: response
});
export const getReferralSchemeTypeMappingDataFailure = (error) => ({
    type: LIST_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE,
    payload: error
});

// For Add Referral Scheme Type Mapping
export const addEditReferralSchemeTypeMapping = (request) => ({
    type: ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING,
    payload: request
});
export const addEditReferralSchemeTypeMappingSuccess = (response) => ({
    type: ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS,
    payload: response
});
export const addEditReferralSchemeTypeMappingFailure = (error) => ({
    type: ADD_EDIT_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE,
    payload: error
});

// For Active Status Referral Scheme Type Mapping
export const changeStatusSchemeTypeMapping = (request) => ({
    type: CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING,
    payload: request
});
export const changeStatusSchemeTypeMappingSuccess = (response) => ({
    type: CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING_SUCCESS,
    payload: response
});
export const changeStatusSchemeTypeMappingFailure = (error) => ({
    type: CHANGE_STATUS_REFERRAL_SCHEME_TYPE_MAPPING_FAILURE,
    payload: error
});

// For Get Referral Scheme Type Mapping By ID 
export const getSchemeTypeMappingById = (request) => ({
    type: GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID,
    payload: request
});
export const getSchemeTypeMappingByIdSuccess = (response) => ({
    type: GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID_SUCCESS,
    payload: response
});
export const getSchemeTypeMappingByIdFailure = (error) => ({
    type: GET_REFERRAL_SCHEME_TYPE_MAPPING_BY_ID_FAILURE,
    payload: error
});