/**
 * Auther : Salim Deraiya
 * Created : 20/03/2019
 * Affiliate Scheme Type Actions
 */

//Import action types form type.js
import {
    //Add Affiliate Scheme Type
    ADD_AFFILIATE_SCHEME_TYPE,
    ADD_AFFILIATE_SCHEME_TYPE_SUCCESS,
    ADD_AFFILIATE_SCHEME_TYPE_FAILURE,

    //Edit Affiliate Scheme Type
    EDIT_AFFILIATE_SCHEME_TYPE,
    EDIT_AFFILIATE_SCHEME_TYPE_SUCCESS,
    EDIT_AFFILIATE_SCHEME_TYPE_FAILURE,

    //Change Affiliate Scheme Type Status
    CHANGE_AFFILIATE_SCHEME_TYPE_STATUS,
    CHANGE_AFFILIATE_SCHEME_TYPE_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_TYPE_STATUS_FAILURE,

    //List Affiliate Scheme Type
    LIST_AFFILIATE_SCHEME_TYPE,
    LIST_AFFILIATE_SCHEME_TYPE_SUCCESS,
    LIST_AFFILIATE_SCHEME_TYPE_FAILURE,

    //Get By Id Affiliate Scheme Type    
    GET_BY_ID_AFFILIATE_SCHEME_TYPE,
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_SUCCESS,
    GET_BY_ID_AFFILIATE_SCHEME_TYPE_FAILURE,

} from '../types';

// Redux Action To Add Affiliate Scheme Type
export const addAffiliateSchemeType = (data) => ({
    type: ADD_AFFILIATE_SCHEME_TYPE,
    payload: data
})

// Redux Action Add Affiliate Scheme Type Success
export const addAffiliateSchemeTypeSuccess = (data) => ({
    type: ADD_AFFILIATE_SCHEME_TYPE_SUCCESS,
    payload: data
});

// Redux Action Add Affiliate Scheme Type Failure
export const addAffiliateSchemeTypeFailure = (error) => ({
    type: ADD_AFFILIATE_SCHEME_TYPE_FAILURE,
    payload: error
});

// Redux Action To Edit Affiliate Scheme Type
export const editAffiliateSchemeType = (data) => ({
    type: EDIT_AFFILIATE_SCHEME_TYPE,
    payload: data
})

// Redux Action Edit Affiliate Scheme Type Success
export const editAffiliateSchemeTypeSuccess = (data) => ({
    type: EDIT_AFFILIATE_SCHEME_TYPE_SUCCESS,
    payload: data
});

// Redux Action Edit Affiliate Scheme Type Failure
export const editAffiliateSchemeTypeFailure = (error) => ({
    type: EDIT_AFFILIATE_SCHEME_TYPE_FAILURE,
    payload: error
});

// Redux Action To Change Status Affiliate Scheme Type
export const changeStatusAffiliateSchemeType = (data) => ({
    type: CHANGE_AFFILIATE_SCHEME_TYPE_STATUS,
    payload: data
})

// Redux Action Change Status Affiliate Scheme Type Success
export const changeStatusAffiliateSchemeTypeSuccess = (data) => ({
    type: CHANGE_AFFILIATE_SCHEME_TYPE_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Affiliate Scheme Type Failure
export const changeStatusAffiliateSchemeTypeFailure = (error) => ({
    type: CHANGE_AFFILIATE_SCHEME_TYPE_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Affiliate Scheme Type
export const getAffiliateSchemeTypeList = (data) => ({
    type: LIST_AFFILIATE_SCHEME_TYPE,
    payload: data
})

// Redux Action List Affiliate Scheme Type Success
export const getAffiliateSchemeTypeListSuccess = (data) => ({
    type: LIST_AFFILIATE_SCHEME_TYPE_SUCCESS,
    payload: data
});

// Redux Action List Affiliate Scheme Type Failure
export const getAffiliateSchemeTypeListFailure = (error) => ({
    type: LIST_AFFILIATE_SCHEME_TYPE_FAILURE,
    payload: error
});

// Redux Action To Get By ID Affiliate Scheme Type
export const getAffiliateSchemeTypeById = (data) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_TYPE,
    payload: data
})

// Redux Action Get By ID Affiliate Scheme Type Success
export const getAffiliateSchemeTypeByIdSuccess = (data) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_TYPE_SUCCESS,
    payload: data
});

// Redux Action Get By ID Affiliate Scheme Type Failure
export const getAffiliateSchemeTypeByIdFailure = (error) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_TYPE_FAILURE,
    payload: error
});