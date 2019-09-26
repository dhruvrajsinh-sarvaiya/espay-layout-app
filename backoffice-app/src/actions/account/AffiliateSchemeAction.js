import {
    //Add Affiliate Scheme
    ADD_AFFILIATE_SCHEME,
    ADD_AFFILIATE_SCHEME_SUCCESS,
    ADD_AFFILIATE_SCHEME_FAILURE,

    //Edit Affiliate Scheme
    EDIT_AFFILIATE_SCHEME,
    EDIT_AFFILIATE_SCHEME_SUCCESS,
    EDIT_AFFILIATE_SCHEME_FAILURE,

    //Change Affiliate Scheme Status
    CHANGE_AFFILIATE_SCHEME_STATUS,
    CHANGE_AFFILIATE_SCHEME_STATUS_SUCCESS,
    CHANGE_AFFILIATE_SCHEME_STATUS_FAILURE,

    //List Affiliate Scheme
    LIST_AFFILIATE_SCHEME,
    LIST_AFFILIATE_SCHEME_SUCCESS,
    LIST_AFFILIATE_SCHEME_FAILURE,

    //Get By Id Affiliate Scheme    
    GET_BY_ID_AFFILIATE_SCHEME,
    GET_BY_ID_AFFILIATE_SCHEME_SUCCESS,
    GET_BY_ID_AFFILIATE_SCHEME_FAILURE,

    //clear data
    CLEAR_LIST_AFFILIATE_SCHEME,
} from "../ActionTypes";

// Redux Action To Add Affiliate Scheme
export const addAffiliateScheme = (data) => ({
    type: ADD_AFFILIATE_SCHEME,
    payload: data
})

// Redux Action Add Affiliate Scheme Success
export const addAffiliateSchemeSuccess = (data) => ({
    type: ADD_AFFILIATE_SCHEME_SUCCESS,
    payload: data
});

// Redux Action Add Affiliate Scheme Failure
export const addAffiliateSchemeFailure = (error) => ({
    type: ADD_AFFILIATE_SCHEME_FAILURE,
    payload: error
});

// Redux Action To Edit Affiliate Scheme
export const editAffiliateScheme = (data) => ({
    type: EDIT_AFFILIATE_SCHEME,
    payload: data
})

// Redux Action Edit Affiliate Scheme Success
export const editAffiliateSchemeSuccess = (data) => ({
    type: EDIT_AFFILIATE_SCHEME_SUCCESS,
    payload: data
});

// Redux Action Edit Affiliate Scheme Failure
export const editAffiliateSchemeFailure = (error) => ({
    type: EDIT_AFFILIATE_SCHEME_FAILURE,
    payload: error
});

// Redux Action To Change Status Affiliate Scheme
export const changeStatusAffiliateScheme = (data) => ({
    type: CHANGE_AFFILIATE_SCHEME_STATUS,
    payload: data
})

// Redux Action Change Status Affiliate Scheme Success
export const changeStatusAffiliateSchemeSuccess = (data) => ({
    type: CHANGE_AFFILIATE_SCHEME_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Affiliate Scheme Failure
export const changeStatusAffiliateSchemeFailure = (error) => ({
    type: CHANGE_AFFILIATE_SCHEME_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Affiliate Scheme
export const getAffiliateSchemeList = (data) => ({
    type: LIST_AFFILIATE_SCHEME,
    payload: data
})

// Redux Action List Affiliate Scheme Success
export const getAffiliateSchemeListSuccess = (data) => ({
    type: LIST_AFFILIATE_SCHEME_SUCCESS,
    payload: data
});

// Redux Action List Affiliate Scheme Failure
export const getAffiliateSchemeListFailure = (error) => ({
    type: LIST_AFFILIATE_SCHEME_FAILURE,
    payload: error
});

// Redux Action To Get By ID Affiliate Scheme
export const getAffiliateSchemeById = (data) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME,
    payload: data
})

// Redux Action Get By ID Affiliate Scheme Success
export const getAffiliateSchemeByIdSuccess = (data) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_SUCCESS,
    payload: data
});

// Redux Action Get By ID Affiliate Scheme Failure
export const getAffiliateSchemeByIdFailure = (error) => ({
    type: GET_BY_ID_AFFILIATE_SCHEME_FAILURE,
    payload: error
});

// Redux Action CLear data
export const clearAffiliateScheme = () => ({
    type: CLEAR_LIST_AFFILIATE_SCHEME,
});