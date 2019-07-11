/**
 * Author : Saloni Rathod
 * Created : 28/03/2019
 * Affiliate Scheme  Detail  Actions
 */

//Import action types form type.js
import {
    //Add Affiliate Scheme Detail
    ADD_AFFILIATE_SCHEME_DETAIL,
    ADD_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    ADD_AFFILIATE_SCHEME_DETAIL_FAILURE,

    //Edit Affiliate Scheme Detail
    EDIT_AFFILIATE_SCHEME_DETAIL,
    EDIT_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    EDIT_AFFILIATE_SCHEME_DETAIL_FAILURE,

    //Change Affiliate Scheme  Detail Status
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS,
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_FAILURE,

    //List Affiliate Scheme Detail
    LIST_AFFILIATE_SCHEME_DETAIL,
    LIST_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    LIST_AFFILIATE_SCHEME_DETAIL_FAILURE,

    //Get By Id Affiliate Scheme  Detail    
    GET_BY_ID_AFFILIATE_SCHEME_DETAIL,
    GET_BY_ID_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    GET_BY_ID_AFFILIATE_SCHEME_DETAIL_FAILURE,

} from '../types';

// Redux Action To Add Affiliate Scheme Detail
export const addAffiliateSchemeDetail = (data) => ({
    type: ADD_AFFILIATE_SCHEME_DETAIL,
    payload: data
})

// Redux Action Add Affiliate Scheme  Detail Success
export const addAffiliateSchemeDetailSuccess = (data) => ({
    type: ADD_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    payload: data
});

// Redux Action Add Affiliate Scheme  Detail Failure
export const addAffiliateSchemeDetailFailure = (error) => ({
    type: ADD_AFFILIATE_SCHEME_DETAIL_FAILURE,
    payload: error
});

// Redux Action To Edit Affiliate Scheme Detail
export const editAffiliateSchemeDetail = (data) => ({
    type: EDIT_AFFILIATE_SCHEME_DETAIL,
    payload: data
})

// Redux Action Edit Affiliate Scheme  Detail Success
export const editAffiliateSchemeDetailSuccess = (data) => ({
    type: EDIT_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    payload: data
});

// Redux Action Edit Affiliate Scheme  Detail Failure
export const editAffiliateSchemeDetailFailure = (error) => ({
    type: EDIT_AFFILIATE_SCHEME_DETAIL_FAILURE,
    payload: error
});

// Redux Action To Change Status Affiliate Scheme Detail
export const changeStatusAffiliateSchemeDetail = (data) => ({
    type: CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS,
    payload: data
})

// Redux Action Change Status Affiliate Scheme  Detail Success
export const changeStatusAffiliateSchemeDetailSuccess = (data) => ({
    type: CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Affiliate Scheme  Detail Failure
export const changeStatusAffiliateSchemeDetailFailure = (error) => ({
    type: CHANGE_AFFILIATE_SCHEME_DETAIL_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Affiliate Scheme Detail
export const getAffiliateSchemeDetailList = (data) => ({
    type: LIST_AFFILIATE_SCHEME_DETAIL,
    payload: data
})

// Redux Action List Affiliate Scheme  Detail Success
export const getAffiliateSchemeDetailListSuccess = (data) => ({
    type: LIST_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    payload: data
});

// Redux Action List Affiliate Scheme  Detail Failure
export const getAffiliateSchemeDetailListFailure = (error) => ({
    type: LIST_AFFILIATE_SCHEME_DETAIL_FAILURE,
    payload: error
});

// Redux Action To Get By ID Affiliate Scheme Detail
export const getAffiliateSchemeDetailById = (data) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_DETAIL,
    payload: data
})

// Redux Action Get By ID Affiliate Scheme  Detail Success
export const getAffiliateSchemeDetailByIdSuccess = (data) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_DETAIL_SUCCESS,
    payload: data
});

// Redux Action Get By ID Affiliate Scheme  Detail Failure
export const getAffiliateSchemeDetailByIdFailure = (error) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_DETAIL_FAILURE,
    payload: error
});