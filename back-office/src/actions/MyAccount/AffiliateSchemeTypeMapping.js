/**
 * Auther : Bharat Jograna
 * Created : 27 March 2019
 * Affiliate Scheme Type Mapping Actions
 */

//Import action types form type.js
import {
    //Add Affiliate Scheme Type Mapping
    ADD_AFFILIATE_SCHEME_TYPE_MAPPING,
    ADD_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    ADD_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

    //Edit Affiliate Scheme Type Mapping
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPING,
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    EDIT_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

    //Change Affiliate Scheme Type Mapping Status
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS,
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_FAILURE,

    //List Affiliate Scheme Type Mapping
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

    //Get By Id Affiliate Scheme Type Mapping    
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING,
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

} from '../types';

// Redux Action To Add Affiliate Scheme Type Mapping
export const addAffiliateSchemeTypeMapping = (data) => ({
    type: ADD_AFFILIATE_SCHEME_TYPE_MAPPING,
    payload: data
})

// Redux Action Add Affiliate Scheme Type Mapping Success
export const addAffiliateSchemeTypeMappingSuccess = (data) => ({
    type: ADD_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    payload: data
});

// Redux Action Add Affiliate Scheme Type Mapping Failure
export const addAffiliateSchemeTypeMappingFailure = (error) => ({
    type: ADD_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,
    payload: error
});

// Redux Action To Edit Affiliate Scheme Type Mapping
export const editAffiliateSchemeTypeMapping = (data) => ({
    type: EDIT_AFFILIATE_SCHEME_TYPE_MAPPING,
    payload: data
})

// Redux Action Edit Affiliate Scheme Type Mapping Success
export const editAffiliateSchemeTypeMappingSuccess = (data) => ({
    type: EDIT_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    payload: data
});

// Redux Action Edit Affiliate Scheme Type Mapping Failure
export const editAffiliateSchemeTypeMappingFailure = (error) => ({
    type: EDIT_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,
    payload: error
});

// Redux Action To Change Status Affiliate Scheme Type Mapping
export const changeStatusAffiliateSchemeTypeMapping = (data) => ({
    type: CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS,
    payload: data
})

// Redux Action Change Status Affiliate Scheme Type Mapping Success
export const changeStatusAffiliateSchemeTypeMappingSuccess = (data) => ({
    type: CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Affiliate Scheme Type Mapping Failure
export const changeStatusAffiliateSchemeTypeMappingFailure = (error) => ({
    type: CHANGE_AFFILIATE_SCHEME_TYPE_MAPPING_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Affiliate Scheme Type Mapping
export const getAffiliateSchemeTypeMappingList = (data) => ({
    type: LIST_AFFILIATE_SCHEME_TYPE_MAPPING,
    payload: data
})

// Redux Action List Affiliate Scheme Type Mapping Success
export const getAffiliateSchemeTypeMappingListSuccess = (data) => ({
    type: LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    payload: data
});

// Redux Action List Affiliate Scheme Type Mapping Failure
export const getAffiliateSchemeTypeMappingListFailure = (error) => ({
    type: LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,
    payload: error
});

// Redux Action To Get By ID Affiliate Scheme Type Mapping
export const getAffiliateSchemeTypeMappingById = (data) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING,
    payload: data
})

// Redux Action Get By ID Affiliate Scheme Type Mapping Success
export const getAffiliateSchemeTypeMappingByIdSuccess = (data) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    payload: data
});

// Redux Action Get By ID Affiliate Scheme Type Mapping Failure
export const getAffiliateSchemeTypeMappingByIdFailure = (error) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,
    payload: error
});